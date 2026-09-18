import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "sitecraft-super-secure-production-jwt-key-2025",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "sitecraft-super-secure-refresh-key-2025",
  
  // Custom Domain Configuration
  cnameTarget: process.env.CNAME_TARGET || "sites.sitecraft.io",
  serverIp: process.env.SERVER_IP || "76.76.21.21", // Standard edge IP for A records
  
  // Rate limiting & security
  maxUploadSizeBytes: 15 * 1024 * 1024, // 15MB
};
