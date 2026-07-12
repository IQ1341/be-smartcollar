import { db } from "../../config/firebase.js";

const COLLECTION = "notifications";

export const getLastAlert = async (
  ownerId,
  cowId,
  alertType
) => {
  const snapshot = await db
    .ref(`${COLLECTION}/last/${ownerId}/${cowId}/${alertType}`)
    .once("value");

  return snapshot.val();
};

export const saveLastAlert = async (
  ownerId,
  cowId,
  alertType,
  data
) => {
  await db
    .ref(`${COLLECTION}/last/${ownerId}/${cowId}/${alertType}`)
    .set(data);
};

export const saveNotificationLog = async (
  ownerId,
  cowId,
  data
) => {
  const timestamp = Date.now();
  await db
    .ref(`${COLLECTION}/logs/${ownerId}/${cowId}/${timestamp}`)
    .set({
      ...data,
      createdAt: timestamp,
    });
};
