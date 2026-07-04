import { auth } from "../config/firebase.js";
import AppError from "../core/exceptions/AppError.js";

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      throw new AppError(
        "Unauthorized",
        401
      );
    }

    const token =
      authorization.replace(
        "Bearer ",
        ""
      );

    const decoded =
      await auth.verifyIdToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    next(
      new AppError(
        "Invalid authentication token",
        401
      )
    );
  }
};

export default authMiddleware;