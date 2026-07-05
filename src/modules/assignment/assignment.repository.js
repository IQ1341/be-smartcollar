import { db } from "../../config/firebase.js";

import {
  buildOwnerCow,
  buildOwnerCollar,
} from "../../shared/utils/owner-key.js";

const COLLECTION = "assignments";

/**
 * Semua assignment
 */
export const findAll = async (
  ownerId
) => {

  const snapshot = await db
    .ref(COLLECTION)
    .orderByChild("ownerId")
    .equalTo(ownerId)
    .once("value");

  const data = snapshot.val();

  return data
    ? Object.values(data)
    : [];

};

/**
 * Detail assignment
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

  const assignment =
    snapshot.val();

  if (
    assignment.ownerId !== ownerId
  ) {
    return null;
  }

  return assignment;

};

/**
 * Assignment aktif berdasarkan sapi
 */
export const findActiveByCow = async (
  ownerId,
  cowId
) => {

  const ownerCow =
    buildOwnerCow(
      ownerId,
      cowId
    );

  const snapshot = await db
    .ref(COLLECTION)
    .orderByChild("ownerCow")
    .equalTo(ownerCow)
    .once("value");

  const data =
    snapshot.val();

  if (!data) {
    return null;
  }

  const assignment =
    Object.values(data)
      .find(
        (item) =>
          item.active
      );

  return assignment || null;

};

/**
 * Assignment aktif berdasarkan collar
 */
export const findActiveByCollar = async (
  ownerId,
  collarId
) => {

  const ownerCollar =
    buildOwnerCollar(
      ownerId,
      collarId
    );

  const snapshot = await db
    .ref(COLLECTION)
    .orderByChild("ownerCollar")
    .equalTo(ownerCollar)
    .once("value");

  const data =
    snapshot.val();

  if (!data) {
    return null;
  }

  const assignment =
    Object.values(data)
      .find(
        (item) =>
          item.active
      );

  return assignment || null;

};

/**
 * Simpan
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