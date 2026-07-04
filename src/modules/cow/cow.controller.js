import { successResponse } from "../../core/response/response.js";
import * as cowService from "./cow.service.js";

export const getAll = async (req, res, next) => {
  try {
    const cows = await cowService.getAll(req.user.uid);

    return successResponse(
      res,
      cows,
      "Cow list retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const cow = await cowService.getById(
      req.user.uid,
      req.params.id
    );

    return successResponse(
      res,
      cow,
      "Cow retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const cow = await cowService.create(
      req.user.uid,
      req.body
    );

    return successResponse(
      res,
      cow,
      "Cow created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const cow = await cowService.update(
      req.user.uid,
      req.params.id,
      req.body
    );

    return successResponse(
      res,
      cow,
      "Cow updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await cowService.deleteById(
      req.user.uid,
      req.params.id
    );

    return successResponse(
      res,
      null,
      "Cow deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};