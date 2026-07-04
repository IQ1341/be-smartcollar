import crypto from "crypto";

/**
 * Generate device secret
 */
export const generateDeviceSecret = () => {
  return crypto.randomUUID();
};