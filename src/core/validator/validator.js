import AppError from "../exceptions/AppError.js";

export const validate = (schema, data) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  return result.data;
};