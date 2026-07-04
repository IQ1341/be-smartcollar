import { db } from "../../config/firebase.js";

const USER_COLLECTION = "users";

export const findUserById = async (uid) => {
  const snapshot = await db
    .ref(`${USER_COLLECTION}/${uid}`)
    .once("value");

  return snapshot.val();
};

export const createUser = async (uid, data) => {
  await db.ref(`${USER_COLLECTION}/${uid}`).set(data);

  return data;
};

export const updateUser = async (uid, data) => {
  await db.ref(`${USER_COLLECTION}/${uid}`).update(data);

  const snapshot = await db
    .ref(`${USER_COLLECTION}/${uid}`)
    .once("value");

  return snapshot.val();
};