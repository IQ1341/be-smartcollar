import { successResponse } from "../../core/response/response.js";

import * as collarService from "./collar.service.js";

/**
 * GET /collars
 */
export const getAll = async (req, res, next) => {
  try {
    const collars = await collarService.getAll(
      req.user.uid
    );

    return successResponse(
      res,
      collars,
      "Smart Collar list retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /collars/:id
 */
export const getById = async (req, res, next) => {
  try {
    const collar = await collarService.getById(
      req.user.uid,
      req.params.id
    );

    return successResponse(
      res,
      collar,
      "Smart Collar retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /collars
 */
export const create = async (req, res, next) => {
  try {
    const collar = await collarService.create(
      req.user.uid,
      req.body
    );

    return successResponse(
      res,
      collar,
      "Smart Collar created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /collars/:id
 */
export const update = async (req, res, next) => {
  try {
    const collar = await collarService.update(
      req.user.uid,
      req.params.id,
      req.body
    );

    return successResponse(
      res,
      collar,
      "Smart Collar updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /collars/:id
 */
export const deleteById = async (req, res, next) => {
  try {
    await collarService.deleteById(
      req.user.uid,
      req.params.id
    );

    return successResponse(
      res,
      null,
      "Smart Collar deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};