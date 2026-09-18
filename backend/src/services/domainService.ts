import dns from "node:dns/promises";
import crypto from "node:crypto";
import { config } from "../config/env";
import { CustomDomainConfig } from "../lib/types";

/**
 * Normalizes input domain by stripping protocol, trailing slashes, paths, and ports.
 */
export function normalizeDomain(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.+$/, "");
}

/**
 * Validates domain syntax according to RFC standards.
 */
export function validateDomainSyntax(domain: string): { valid: boolean; error?: string } {
  if (!domain) {
    return { valid: false, error: "Domain name is required" };
  }

  if (domain.length > 253) {
    return { valid: false, error: "Domain name exceeds maximum length of 253 characters" };
  }

  // Reject local IP addresses or localhost as custom domains
  if (domain === "localhost" || domain.endsWith(".localhost") || /^(\d{1,3}\.){3}\d{1,3}$/.test(domain)) {
    return { valid: false, error: "Localhost or raw IP addresses cannot be used as custom domains" };
  }

  // Standard domain regex checking labels and valid TLD
  const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,63}$/;
  if (!domainRegex.test(domain)) {
    return { valid: false, error: "Invalid domain format. Example: yourdomain.com or landing.yourbrand.com" };
  }

  return { valid: true };
}

/**
 * Determines whether a domain is an apex/root domain (needs A record) or subdomain (needs CNAME).
 */
export function detectRecordType(domain: string): "A" | "CNAME" {
  const parts = domain.split(".");
  // e.g., "example.com" or "example.co.uk" (2 parts or 3 with two-part TLD)
  // Subdomains like "app.example.com" or "landing.company.org" have 3+ parts.
  return parts.length <= 2 ? "A" : "CNAME";
}

/**
 * Generates a verification challenge token for DNS TXT records.
 */
export function generateVerificationToken(domain: string): string {
  const hash = crypto.createHash("sha256").update(`${domain}-${Date.now()}`).digest("hex").slice(0, 24);
  return `sitecraft-verify=${hash}`;
}

export interface DnsCheckResult {
  verified: boolean;
  status: "verified" | "pending" | "invalid";
  foundRecords: string[];
  message: string;
}

/**
 * Performs real-time DNS lookups using Node.js native dns promises.
 */
export async function checkDnsRecords(
  domain: string,
  recordType: "A" | "CNAME",
  expectedTarget: string,
  verificationToken?: string
): Promise<DnsCheckResult> {
  const foundRecords: string[] = [];

  try {
    if (recordType === "CNAME") {
      try {
        const cnames = await dns.resolveCname(domain);
        foundRecords.push(...cnames);

        const matches = cnames.some(
          (c) => normalizeDomain(c) === normalizeDomain(expectedTarget)
        );

        if (matches) {
          return {
            verified: true,
            status: "verified",
            foundRecords,
            message: `CNAME record successfully verified pointing to ${expectedTarget}`,
          };
        }
      } catch (err: any) {
        if (err.code !== "ENODATA" && err.code !== "ENOTFOUND") {
          console.warn(`DNS CNAME query warning for ${domain}:`, err.message);
        }
      }
    } else {
      // Apex domain checking A record
      try {
        const ips = await dns.resolve4(domain);
        foundRecords.push(...ips);

        const matches = ips.some((ip) => ip === expectedTarget);
        if (matches) {
          return {
            verified: true,
            status: "verified",
            foundRecords,
            message: `A record successfully verified pointing to IP ${expectedTarget}`,
          };
        }
      } catch (err: any) {
        if (err.code !== "ENODATA" && err.code !== "ENOTFOUND") {
          console.warn(`DNS A query warning for ${domain}:`, err.message);
        }
      }
    }

    // Optional TXT challenge verification
    if (verificationToken) {
      try {
        const txtRecords = await dns.resolveTxt(`_sitecraft-challenge.${domain}`);
        const flattened = txtRecords.flat();
        foundRecords.push(...flattened);

        if (flattened.includes(verificationToken)) {
          return {
            verified: true,
            status: "verified",
            foundRecords,
            message: "Ownership verified via DNS TXT record challenge.",
          };
        }
      } catch {
        // TXT record may not exist yet, continue
      }
    }

    if (foundRecords.length > 0) {
      return {
        verified: false,
        status: "invalid",
        foundRecords,
        message: `Records found (${foundRecords.join(", ")}), but do not match expected target: ${expectedTarget}`,
      };
    }

    return {
      verified: false,
      status: "pending",
      foundRecords: [],
      message: "No DNS records detected yet. DNS changes can take up to 24-48 hours to propagate worldwide.",
    };
  } catch (error: any) {
    return {
      verified: false,
      status: "pending",
      foundRecords: [],
      message: `DNS lookup failed: ${error.message || "Propagation pending"}`,
    };
  }
}

/**
 * Builds the complete domain configuration object for a project.
 */
export function buildDomainConfig(domain: string): CustomDomainConfig {
  const normalized = normalizeDomain(domain);
  const recordType = detectRecordType(normalized);
  const expectedTarget = recordType === "CNAME" ? config.cnameTarget : config.serverIp;
  const verificationToken = generateVerificationToken(normalized);

  return {
    domain: normalized,
    verified: false,
    status: "pending",
    recordType,
    expectedTarget,
    verificationToken,
    sslActive: false,
    sslStatus: "pending",
    configuredAt: new Date().toISOString(),
  };
}
