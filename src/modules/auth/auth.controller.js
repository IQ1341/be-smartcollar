import { successResponse } from "../../core/response/response.js";

import {
  syncUser,
  getProfile,
} from "./auth.service.js";

export const sync = async (req, res, next) => {
  try {
    const user = await syncUser(req.user, req.body);

    return successResponse(
      res,
      user,
      "User synchronized successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await getProfile(req.user.uid);

    return successResponse(
      res,
      user,
      "Profile fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};