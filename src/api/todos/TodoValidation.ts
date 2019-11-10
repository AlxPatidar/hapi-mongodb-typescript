import * as Joi from "joi";

export const createTodo = Joi.object({
  userId: Joi.string().required().error(new Error("User Id is required")),
  task: Joi.string().required().error(new Error("Task is required")),
});

export const updateTodo = Joi.object().keys({
  task: Joi.string().optional(),
  completed: Joi.boolean().optional()
});
