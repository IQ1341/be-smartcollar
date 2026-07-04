import crypto from "crypto";

export const generateId = (prefix) => {
  return `${prefix}_${crypto.randomUUID()}`;
};