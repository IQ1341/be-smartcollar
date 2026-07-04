import AppError from "../../core/exceptions/AppError.js";

import { generateId } from "../../shared/id/generateId.js";

import {
  buildOwnerCode,
} from "../../shared/utils/owner-key.js";

import {
  now,
} from "../../shared/utils/timestamp.js";

import * as repository from "./cow.repository.js";

/**
 * Ambil semua sapi milik user
 */
export const getAll = async (ownerId) => {
  return await repository.findAll(ownerId);
};

/**
 * Detail sapi
 */
export const getById = async (
  ownerId,
  id
) => {
  const cow = await repository.findById(
    ownerId,
    id
  );

  if (!cow) {
    throw new AppError(
      "Cow not found",
      404
    );
  }

  return cow;
};

/**
 * Tambah sapi
 */
export const create = async (
  ownerId,
  body
) => {
  const duplicate =
    await repository.findByOwnerCode(
      ownerId,
      body.code
    );

  if (duplicate) {
    throw new AppError(
      "Cow code already exists",
      400
    );
  }

  const timestamp = now();

  const cow = {
    id: generateId("cow"),

    ownerId,

    ownerCode: buildOwnerCode(
      ownerId,
      body.code
    ),

    ...body,

    code: body.code.toUpperCase(),

    createdAt: timestamp,

    updatedAt: timestamp,
  };

  return await repository.create(cow);
};

/**
 * Update sapi
 */
export const update = async (
  ownerId,
  id,
  body
) => {
  await getById(ownerId, id);

  if (body.code) {
    const duplicate =
      await repository.findByOwnerCode(
        ownerId,
        body.code
      );

    if (
      duplicate &&
      duplicate.id !== id
    ) {
      throw new AppError(
        "Cow code already exists",
        400
      );
    }

    body.code =
      body.code.toUpperCase();

    body.ownerCode =
      buildOwnerCode(
        ownerId,
        body.code
      );
  }

  body.updatedAt = now();

  return await repository.update(
    ownerId,
    id,
    body
  );
};

/**
 * Hapus sapi
 */
export const deleteById = async (
  ownerId,
  id
) => {
  const cow = await getById(
    ownerId,
    id
  );

  await repository.deleteById(
    ownerId,
    id
  );

  return cow;
};