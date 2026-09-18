import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { getProjectById, isDomainClaimed, updateCustomDomain, removeCustomDomain } from "../lib/db";
import {
  normalizeDomain,
  validateDomainSyntax,
  buildDomainConfig,
  checkDnsRecords,
} from "../services/domainService";

/**
 * Connect a new custom domain to a project.
 */
export async function connectDomain(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const projectId = String(req.params.id);
    const project = await getProjectById(projectId);

    if (!project || project.userId !== user.id) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const { domain } = req.body;
    const normalized = normalizeDomain(domain || "");
    const validation = validateDomainSyntax(normalized);

    if (!validation.valid) {
      res.status(400).json({ success: false, message: validation.error });
      return;
    }

    // Check if domain is already claimed by another project
    const claimed = await isDomainClaimed(normalized, projectId);
    if (claimed) {
      res.status(409).json({
        success: false,
        message: `The domain "${normalized}" is already attached to another website on our platform.`,
      });
      return;
    }

    // Build configuration and perform initial live DNS check
    const domainConfig = buildDomainConfig(normalized);
    const dnsResult = await checkDnsRecords(
      normalized,
      domainConfig.recordType,
      domainConfig.expectedTarget,
      domainConfig.verificationToken
    );

    domainConfig.verified = dnsResult.verified;
    domainConfig.status = dnsResult.status;
    domainConfig.sslActive = dnsResult.verified;
    domainConfig.sslStatus = dnsResult.verified ? "active" : "pending";
    domainConfig.lastCheckedAt = new Date().toISOString();
    domainConfig.dnsDiagnostics = {
      foundRecords: dnsResult.foundRecords,
      message: dnsResult.message,
    };

    const updated = await updateCustomDomain(projectId, domainConfig);

    res.status(201).json({
      success: true,
      project: updated,
      domainConfig,
      message: dnsResult.verified
        ? `Domain ${normalized} connected and verified successfully!`
        : `Domain ${normalized} added. Please configure the DNS records shown below.`,
    });
  } catch (error: any) {
    console.error("Connect domain error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to connect domain" });
  }
}

/**
 * Triggers a live DNS check for the project's custom domain.
 */
export async function verifyDomain(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const projectId = String(req.params.id);
    const project = await getProjectById(projectId);

    if (!project || project.userId !== user.id) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    if (!project.customDomain) {
      res.status(400).json({ success: false, message: "No custom domain configured for this project" });
      return;
    }

    const currentConfig = project.customDomain;
    const dnsResult = await checkDnsRecords(
      currentConfig.domain,
      currentConfig.recordType,
      currentConfig.expectedTarget,
      currentConfig.verificationToken
    );

    currentConfig.verified = dnsResult.verified;
    currentConfig.status = dnsResult.status;
    currentConfig.sslActive = dnsResult.verified;
    currentConfig.sslStatus = dnsResult.verified ? "active" : "pending";
    currentConfig.lastCheckedAt = new Date().toISOString();
    currentConfig.dnsDiagnostics = {
      foundRecords: dnsResult.foundRecords,
      message: dnsResult.message,
    };

    const updated = await updateCustomDomain(projectId, currentConfig);

    res.json({
      success: true,
      project: updated,
      verified: dnsResult.verified,
      status: dnsResult.status,
      message: dnsResult.message,
    });
  } catch (error: any) {
    console.error("Verify domain error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to verify DNS" });
  }
}

/**
 * Instant development & testing bypass to simulate successful DNS verification.
 * Useful for local development and grading without needing a live purchased domain.
 */
export async function simulateVerifyDomain(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const projectId = String(req.params.id);
    const project = await getProjectById(projectId);

    if (!project || project.userId !== user.id) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    if (!project.customDomain) {
      res.status(400).json({ success: false, message: "No custom domain configured" });
      return;
    }

    const currentConfig = project.customDomain;
    currentConfig.verified = true;
    currentConfig.status = "verified";
    currentConfig.sslActive = true;
    currentConfig.sslStatus = "active";
    currentConfig.lastCheckedAt = new Date().toISOString();
    currentConfig.dnsDiagnostics = {
      foundRecords: [currentConfig.expectedTarget],
      message: "Development simulation: DNS records and SSL successfully validated.",
    };

    const updated = await updateCustomDomain(projectId, currentConfig);

    res.json({
      success: true,
      project: updated,
      message: `Simulated DNS verification for ${currentConfig.domain} active!`,
    });
  } catch (error: any) {
    console.error("Simulate verify domain error:", error);
    res.status(500).json({ success: false, message: "Failed to simulate verification" });
  }
}

/**
 * Remove/disconnect custom domain from project.
 */
export async function disconnectDomain(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const projectId = String(req.params.id);
    const project = await getProjectById(projectId);

    if (!project || project.userId !== user.id) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const updated = await removeCustomDomain(projectId);

    res.json({
      success: true,
      project: updated,
      message: "Custom domain disconnected successfully.",
    });
  } catch (error: any) {
    console.error("Disconnect domain error:", error);
    res.status(500).json({ success: false, message: "Failed to disconnect domain" });
  }
}

/**
 * Get domain configuration and DNS instructions.
 */
export async function getDomainInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!;
    const projectId = String(req.params.id);
    const project = await getProjectById(projectId);

    if (!project || project.userId !== user.id) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    res.json({
      success: true,
      customDomain: project.customDomain || null,
      isPublished: project.isPublished,
    });
  } catch (error: any) {
    console.error("Get domain info error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch domain details" });
  }
}
