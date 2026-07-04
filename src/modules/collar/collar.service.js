import AppError from "../../core/exceptions/AppError.js";

import { generateId } from "../../shared/id/generateId.js";

import { generateDeviceSecret } from "../../shared/utils/device.js";

import {
  buildOwnerSerial,
  buildSerialSecret,
} from "../../shared/utils/owner-key.js";

import { now } from "../../shared/utils/timestamp.js";

import { COLLAR_STATUS as collarStatus } from "../../shared/constants/collar-status.js";

import * as repository from "./collar.repository.js";

/**
 * Ambil semua Smart Collar
 */
export const getAll = async (ownerId) => {
  return await repository.findAll(ownerId);
};

/**
 * Detail Smart Collar
 */
export const getById = async (
  ownerId,
  id
) => {
  const collar = await repository.findById(
    ownerId,
    id
  );

  if (!collar) {
    throw new AppError(
      "Smart Collar not found",
      404
    );
  }

  return collar;
};

/**
 * Tambah Smart Collar
 */
export const create = async (
  ownerId,
  body
) => {
  const duplicate =
    await repository.findBySerial(
      ownerId,
      body.serialNumber
    );

  if (duplicate) {
    throw new AppError(
      "Serial number already exists",
      400
    );
  }

  const serial =
    body.serialNumber.toUpperCase();

  const secret =
    generateDeviceSecret();

  const timestamp = now();

  const collar = {
    id: generateId("collar"),

    ownerId,

    ownerSerial: buildOwnerSerial(
      ownerId,
      serial
    ),

    serialNumber: serial,

    deviceSecret: secret,

    serialSecret: buildSerialSecret(
      serial,
      secret
    ),

    deviceName: body.deviceName,

    hardwareVersion:
      body.hardwareVersion,

    firmwareVersion:
      body.firmwareVersion,

    macAddress:
      body.macAddress,

    simNumber:
      body.simNumber,

    battery: 100,

    signal: 100,

    assigned: false,

    status: collarStatus.AVAILABLE,

    lastOnline: 0,

    createdAt: timestamp,

    updatedAt: timestamp,
  };

  return await repository.create(
    collar
  );
};

/**
 * Update Smart Collar
 */
export const update = async (
  ownerId,
  id,
  body
) => {
  const collar =
    await getById(
      ownerId,
      id
    );

  if (body.serialNumber) {
    const duplicate =
      await repository.findBySerial(
        ownerId,
        body.serialNumber
      );

    if (
      duplicate &&
      duplicate.id !== id
    ) {
      throw new AppError(
        "Serial number already exists",
        400
      );
    }

    body.serialNumber =
      body.serialNumber.toUpperCase();

    body.ownerSerial =
      buildOwnerSerial(
        ownerId,
        body.serialNumber
      );

    body.serialSecret =
      buildSerialSecret(
        body.serialNumber,
        collar.deviceSecret
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
 * Hapus Smart Collar
 */
export const deleteById = async (
  ownerId,
  id
) => {
  const collar =
    await getById(
      ownerId,
      id
    );

  await repository.deleteById(
    ownerId,
    id
  );

  return collar;
};