import AppError from "../../core/exceptions/AppError.js";

import { generateId } from "../../shared/id/generateId.js";

import { now } from "../../shared/utils/timestamp.js";

import {
  buildOwnerCow,
  buildOwnerCollar,
} from "../../shared/utils/owner-key.js";

import * as repository from "./assignment.repository.js";

import * as cowRepository from "../cow/cow.repository.js";

import * as collarRepository from "../collar/collar.repository.js";

/**
 * Semua assignment
 */
export const getAll = async (
  ownerId
) => {

  return await repository.findAll(
    ownerId
  );

};

/**
 * Pasang Smart Collar
 */
export const attach = async (
  ownerId,
  body
) => {

  // ==========================
  // VALIDASI SAPI
  // ==========================

  const cow =
    await cowRepository.findById(
      ownerId,
      body.cowId
    );

  if (!cow) {

    throw new AppError(
      "Cow not found",
      404
    );

  }

  // ==========================
  // VALIDASI COLLAR
  // ==========================

  const collar =
    await collarRepository.findById(
      ownerId,
      body.collarId
    );

  if (!collar) {

    throw new AppError(
      "Smart Collar not found",
      404
    );

  }

  // ==========================
  // CEK SAPI
  // ==========================

  const cowAssignment =
    await repository.findActiveByCow(
      ownerId,
      body.cowId
    );

  if (cowAssignment) {

    throw new AppError(
      "Cow already has Smart Collar",
      400
    );

  }

  // ==========================
  // CEK COLLAR
  // ==========================

  const collarAssignment =
    await repository.findActiveByCollar(
      ownerId,
      body.collarId
    );

  if (collarAssignment) {

    throw new AppError(
      "Smart Collar already assigned",
      400
    );

  }

  const timestamp =
    now();

  const assignment = {

    id:
      generateId(
        "assignment"
      ),

    ownerId,

    ownerCow:
      buildOwnerCow(
        ownerId,
        cow.id
      ),

    ownerCollar:
      buildOwnerCollar(
        ownerId,
        collar.id
      ),

    cowId:
      cow.id,

    cowCode:
      cow.code,

    cowName:
      cow.name,

    collarId:
      collar.id,

    serialNumber:
      collar.serialNumber,

    deviceName:
      collar.deviceName,

    active:true,

    assignedAt:
      timestamp,

    unassignedAt:null,

    createdAt:
      timestamp,

    updatedAt:
      timestamp

  };

  await repository.create(
    assignment
  );

await collarRepository.update(

    ownerId,

    collar.id,

    {

        assigned:true,

        status:"assigned",

        currentCowId:
            cow.id,

        currentCowCode:
            cow.code,

        currentCowName:
            cow.name,

        currentAssignmentId:
            assignment.id,

        updatedAt:timestamp

    }

);

  return assignment;

};

/**
 * Lepas Smart Collar
 */
export const detach = async (
  ownerId,
  cowId
) => {

  const assignment =
    await repository.findActiveByCow(
      ownerId,
      cowId
    );

  if (!assignment) {

    throw new AppError(
      "Assignment not found",
      404
    );

  }

  const timestamp =
    now();

  await repository.update(

    ownerId,

    assignment.id,

    {

      active:false,

      unassignedAt:
        timestamp,

      updatedAt:
        timestamp

    }

  );

await collarRepository.update(

    ownerId,

    assignment.collarId,

    {

        assigned:false,

        status:"available",

        currentCowId:null,

        currentCowCode:null,

        currentCowName:null,

        currentAssignmentId:null,

        updatedAt:timestamp

    }

);

  return {

    message:
      "Smart Collar detached successfully"

  };

};