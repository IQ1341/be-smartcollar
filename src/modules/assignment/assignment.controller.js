import { successResponse } from "../../core/response/response.js";

import * as assignmentService from "./assignment.service.js";

/**
 * GET /assignments
 */
export const getAll = async (
  req,
  res,
  next
) => {

  try {

    const data =
      await assignmentService.getAll(
        req.user.uid
      );

    return successResponse(
      res,
      data,
      "Assignment retrieved successfully"
    );

  } catch (error) {

    next(error);

  }

};

/**
 * POST /assignments/attach
 */
export const attach = async (
  req,
  res,
  next
) => {

  try {

    const data =
      await assignmentService.attach(
        req.user.uid,
        req.body
      );

    return successResponse(
      res,
      data,
      "Smart Collar attached successfully",
      201
    );

  } catch (error) {

    next(error);

  }

};

/**
 * POST /assignments/detach
 */
export const detach = async (
  req,
  res,
  next
) => {

  try {

    const data =
      await assignmentService.detach(
        req.user.uid,
        req.body.cowId
      );

    return successResponse(
      res,
      data,
      "Smart Collar detached successfully"
    );

  } catch (error) {

    next(error);

  }

};