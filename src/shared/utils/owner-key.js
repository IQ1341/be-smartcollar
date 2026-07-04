/**
 * Generate ownerCode
 */
export const buildOwnerCode = (
  ownerId,
  code
) => {
  return `${ownerId}_${code.toUpperCase()}`;
};

/**
 * Generate ownerSerial
 */
export const buildOwnerSerial = (
  ownerId,
  serialNumber
) => {
  return `${ownerId}_${serialNumber.toUpperCase()}`;
};

/**
 * Generate serialSecret
 */
export const buildSerialSecret = (
  serialNumber,
  secret
) => {
  return `${serialNumber.toUpperCase()}_${secret}`;
};

/**
 * Generate ownerCow
 */
export const buildOwnerCow = (
  ownerId,
  cowId
) => {
  return `${ownerId}_${cowId}`;
};

/**
 * Generate ownerCollar
 */
export const buildOwnerCollar = (
  ownerId,
  collarId
) => {
  return `${ownerId}_${collarId}`;
};