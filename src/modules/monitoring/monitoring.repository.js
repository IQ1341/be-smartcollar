import { db } from "../../config/firebase.js";

/*
|--------------------------------------------------------------------------
| SAVE LATEST
|--------------------------------------------------------------------------
*/

export const saveLatest = async (
  ownerId,
  cowId,
  data
) => {

  await db
    .ref(
      `monitoring/latest/${ownerId}/${cowId}`
    )
    .set(data);

};

/*
|--------------------------------------------------------------------------
| SAVE HISTORY
|--------------------------------------------------------------------------
*/

/**
 * Simpan history monitoring
 */
export const saveHistory = async (
  ownerId,
  cowId,
  data
) => {

  const date = new Date(data.timestamp);

  const year = String(date.getFullYear());

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  await db
    .ref(
      `monitoring/history/${ownerId}/${cowId}/${year}/${month}/${day}`
    )
    .push(data);

};

/*
|--------------------------------------------------------------------------
| GET LATEST
|--------------------------------------------------------------------------
*/

export const getLatest = async (
  ownerId
) => {

  const snapshot =
    await db

      .ref(
`monitoring/latest/${ownerId}`
      )

      .once("value");

  return snapshot.val();

};

/*
|--------------------------------------------------------------------------
| GET LATEST BY COW
|--------------------------------------------------------------------------
*/

export const getLatestByCow =
async (

  ownerId,

  cowId

) => {

  const snapshot =
    await db

      .ref(

`monitoring/latest/${ownerId}/${cowId}`

      )

      .once("value");

  return snapshot.exists()

    ? snapshot.val()

    : null;

};

/*
|--------------------------------------------------------------------------
| GET HISTORY DAY
|--------------------------------------------------------------------------
*/

export const getHistoryByDay = async (
  ownerId,
  cowId,
  year,
  month,
  day
) => {

  const snapshot = await db
    .ref(
      `monitoring/history/${ownerId}/${cowId}/${year}/${month}/${day}`
    )
    .once("value");

  const data = snapshot.val();

  return data
    ? Object.values(data)
    : [];
};

/*
|--------------------------------------------------------------------------
| GET HISTORY MONTH
|--------------------------------------------------------------------------
*/

export const getHistoryByMonth = async (
  ownerId,
  cowId,
  year,
  month
) => {

  const snapshot = await db
    .ref(
      `monitoring/history/${ownerId}/${cowId}/${year}/${month}`
    )
    .once("value");

  return snapshot.val();
};

/*
|--------------------------------------------------------------------------
| DELETE HISTORY
|--------------------------------------------------------------------------
*/

export const deleteHistory = async (
  ownerId,
  cowId,
  year,
  month,
  day
) => {

  await db
    .ref(
      `monitoring/history/${ownerId}/${cowId}/${year}/${month}/${day}`
    )
    .remove();

};