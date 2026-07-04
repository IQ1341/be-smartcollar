import { db } from "../../config/firebase.js";

const COLLECTION = "collars";

/**
 * Semua collar milik owner
 */
export const findAll = async (ownerId) => {

  const snapshot = await db
    .ref(COLLECTION)
    .orderByChild("ownerId")
    .equalTo(ownerId)
    .once("value");

  const data = snapshot.val();

  return data ? Object.values(data) : [];
};

/**
 * Cari berdasarkan id
 */
export const findById = async (
  ownerId,
  id
) => {

  const snapshot = await db
    .ref(`${COLLECTION}/${id}`)
    .once("value");

  if (!snapshot.exists())
    return null;

  const collar = snapshot.val();

  if (collar.ownerId !== ownerId)
    return null;

  return collar;
};

/**
 * Cari berdasarkan serial
 */
export const findBySerial = async (
  ownerId,
  serialNumber
) => {

  const ownerSerial =
    `${ownerId}_${serialNumber.toUpperCase()}`;

  const snapshot = await db
    .ref(COLLECTION)
    .orderByChild("ownerSerial")
    .equalTo(ownerSerial)
    .once("value");

  const data = snapshot.val();

  if (!data)
    return null;

  return Object.values(data)[0];
};

/**
 * Cari berdasarkan serial + secret
 * Digunakan oleh ESP32 saat mengirim monitoring
 */
export const findByDevice = async (
  serialNumber,
  deviceSecret
) => {

  const serialSecret =
    `${serialNumber.toUpperCase()}_${deviceSecret}`;

  const snapshot = await db
    .ref(COLLECTION)
    .orderByChild("serialSecret")
    .equalTo(serialSecret)
    .once("value");

  const data = snapshot.val();

  if (!data) {
    return null;
  }

  return Object.values(data)[0];
};

/**
 * Create
 */
export const create = async (
  data
) => {

  await db
    .ref(`${COLLECTION}/${data.id}`)
    .set(data);

  return data;
};

/**
 * Update
 */
export const update = async (
  ownerId,
  id,
  data
) => {

  await db
    .ref(`${COLLECTION}/${id}`)
    .update(data);

  return await findById(
    ownerId,
    id
  );
};

/**
 * Delete
 */
export const deleteById = async (
  ownerId,
  id
) => {

  const collar =
    await findById(
      ownerId,
      id
    );

  if (!collar)
    return false;

  await db
    .ref(`${COLLECTION}/${id}`)
    .remove();

  return true;
};