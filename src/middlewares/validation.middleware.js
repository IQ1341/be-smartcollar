import { validate } from "../core/validator/validator.js";

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      req.body = validate(schema, req.body);

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validationMiddleware;