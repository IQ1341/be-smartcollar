import { db } from "../../config/firebase.js";

import {
  buildOwnerSerial,
  buildSerialSecret,
} from "../../shared/utils/owner-key.js";

const COLLECTION = "collars";

/**
 * Ambil semua Smart Collar milik owner
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
 * Cari Smart Collar berdasarkan ID
 */
export const findById = async (
  ownerId,
  id
) => {

  const snapshot = await db
    .ref(`${COLLECTION}/${id}`)
    .once("value");

  if (!snapshot.exists()) {
    return null;
  }

  const collar = snapshot.val();

  if (collar.ownerId !== ownerId) {
    return null;
  }

  return collar;
};

/**
 * Cari berdasarkan serial number
 */
export const findBySerial = async (
  ownerId,
  serialNumber
) => {

  const ownerSerial =
    buildOwnerSerial(
      ownerId,
      serialNumber
    );

  const snapshot = await db
    .ref(COLLECTION)
    .orderByChild("ownerSerial")
    .equalTo(ownerSerial)
    .once("value");

  const data = snapshot.val();

  if (!data) {
    return null;
  }

  return Object.values(data)[0];
};

/**
 * Digunakan ESP32
 */
export const findByDevice = async (
  serialNumber,
  deviceSecret
) => {

  const serialSecret =
    buildSerialSecret(
      serialNumber,
      deviceSecret
    );

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
 * Cek apakah Smart Collar ada
 */
export const exists = async (
  ownerId,
  id
) => {

  const collar =
    await findById(
      ownerId,
      id
    );

  return collar !== null;
};

/**
 * Cek apakah sedang digunakan
 */
export const isAssigned = async (
  ownerId,
  id
) => {

  const collar =
    await findById(
      ownerId,
      id
    );

  if (!collar) {
    return false;
  }

  return collar.assigned;
};

/**
 * Tambah Smart Collar
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
 * Update data Smart Collar
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
 * Update status device
 * Dipakai Monitoring
 */
export const updateStatus = async (
  ownerId,
  id,
  status
) => {

  await db
    .ref(`${COLLECTION}/${id}`)
    .update(status);

  return await findById(
    ownerId,
    id
  );
};

/**
 * Update heartbeat device
 * Dipanggil setiap ESP32 mengirim data
 */
export const touchOnline = async (
  ownerId,
  id,
  payload
) => {

  await db
    .ref(`${COLLECTION}/${id}`)
    .update({

      signal:
        payload.signal,

      firmwareVersion:
        payload.firmwareVersion,

      hardwareVersion:
        payload.hardwareVersion,

      online: true,

      lastOnline:
        payload.lastOnline,

      lastSync:
        payload.lastSync,

      updatedAt:
        payload.lastSync,

    });

};

/**
 * Set offline
 * Dipakai scheduler
 */
export const setOffline = async (
  ownerId,
  id
) => {

  await db
    .ref(`${COLLECTION}/${id}`)
    .update({

      online: false,

      updatedAt:
        Date.now()

    });

};

/**
 * Hapus Smart Collar
 */
export const deleteById = async (
  ownerId,
  id
) => {

  const exists =
    await findById(
      ownerId,
      id
    );

  if (!exists) {
    return false;
  }

  await db
    .ref(`${COLLECTION}/${id}`)
    .remove();

  return true;
};