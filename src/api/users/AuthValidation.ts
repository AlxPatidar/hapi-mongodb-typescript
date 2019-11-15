import * as Joi from "joi";

// Validate login for email and passowrd
export const loginValidation = Joi.object({
    email: Joi.string()
        .required()
        .error(new Error("Email is required")),
    password: Joi.string()
        .required()
        .error(new Error("Password is required"))
});