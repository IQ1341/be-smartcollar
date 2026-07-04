import { db } from "../../config/firebase.js";

const COLLECTION = "cows";

/**
 * Ambil seluruh sapi milik owner
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
 * Cari sapi berdasarkan owner + id
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

  const cow = snapshot.val();

  if (cow.ownerId !== ownerId) {
    return null;
  }

  return cow;
};

/**
 * Cari sapi berdasarkan owner + code
 */
export const findByOwnerCode = async (
  ownerId,
  code
) => {

  const ownerCode =
    `${ownerId}_${code.toUpperCase()}`;

  const snapshot = await db
    .ref(COLLECTION)
    .orderByChild("ownerCode")
    .equalTo(ownerCode)
    .once("value");

  const data = snapshot.val();

  if (!data) {
    return null;
  }

  return Object.values(data)[0];
};

/**
 * Cek apakah sapi ada
 */
export const exists = async (
  ownerId,
  id
) => {

  const cow = await findById(
    ownerId,
    id
  );

  return cow !== null;
};

/**
 * Tambah sapi
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
 * Update sapi
 */
export const update = async (
  ownerId,
  id,
  data
) => {

  const cow = await findById(ownerId, id);

  if (!cow) {
    return null;
  }

  await db
    .ref(`${COLLECTION}/${id}`)
    .update(data);

  return await findById(ownerId, id);
};

/**
 * Hapus sapi
 */
export const deleteById = async (
  ownerId,
  id
) => {

  const cow =
    await findById(
      ownerId,
      id
    );

  if (!cow) {
    return false;
  }

  await db
  .ref(`${COLLECTION}/${id}`)
  .remove();

  return true;
};