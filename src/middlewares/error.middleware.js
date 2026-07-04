import AppError from "../core/exceptions/AppError.js";
import logger from "../core/logger/logger.js";
import { errorResponse } from "../core/response/response.js";

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.message, err);

  if (err instanceof AppError) {
    return errorResponse(
      res,
      err.message,
      err.statusCode,
      err.errors
    );
  }

  return errorResponse(
    res,
    "Internal Server Error",
    500
  );
};

export default errorMiddleware;