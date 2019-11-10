import * as Joi from "joi";

export const loginValidation = Joi.object({
    email: Joi.string()
        .required()
        .error(new Error("Email is required")),
    password: Joi.string()
        .required()
        .error(new Error("Password is required"))
});