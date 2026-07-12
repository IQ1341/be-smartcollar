import AppError from "../exceptions/AppError.js";

export const validate = (schema, data) => {

    const result = schema.safeParse(data);

    if (!result.success) {

        throw new AppError(
            "Validation Error",
            400,
            result.error.issues
        );

    }

    return result.data;
};