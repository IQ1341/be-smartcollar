import { errorResponse } from "../core/response/response.js";

const notFoundMiddleware = (req, res) => {
  return errorResponse(
    res,
    `Route ${req.originalUrl} not found`,
    404
  );
};

export default notFoundMiddleware;