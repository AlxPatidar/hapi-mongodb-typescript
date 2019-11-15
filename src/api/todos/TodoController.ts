import * as Hapi from "hapi";
import * as mongoose from "mongoose";
import * as _ from "lodash";
import { ITodo, Todo } from "../../models/Todo";
import { IRequest } from "../../config/request";

export default class TodoController {
  // Create todo item
  public async createTodo(request: IRequest, reply: Hapi.ResponseToolkit) {
    try {
      const payload: ITodo = <ITodo>request.payload
      const todo: ITodo = await Todo.create(payload)
      return reply.response({
        status: true,
        message: "Todo create successfully.",
        data: todo
      }).code(200)
    } catch (e) {
      return reply.response({
        status: false,
        message: "Invalid Request.",
        data: []
      }).code(200)
    }
  }
  // Update todo item
  public async updateTodo(request: IRequest, reply: Hapi.ResponseToolkit) {
    const todoId = request.params["todoId"];
    const payload = request.payload
    try {
      const todo: ITodo = await Todo.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(todoId) },
        { $set: payload },
        { new: true }
      )
      return reply.response({
        status: true,
        message: "Todo updated successfully.",
        data: todo
      }).code(200)
    } catch (error) {
      return reply.response({
        status: false,
        message: "Invalid Request.",
        data: []
      }).code(200)
    }
  }
  // Delete todo item
  public async deleteTodo(request: IRequest, reply: Hapi.ResponseToolkit) {
    const todoId = request.params["todoId"];
    const deletedTodo = await Todo.findOneAndDelete({
      _id: todoId,
    });
    if (deletedTodo) {
      return reply.response({
        status: true,
        message: "Todo item deleted successfully.",
        data: deletedTodo
      }).code(200);
    } else {
      return reply.response({
        status: false,
        message: "Invalid Request.",
        data: []
      }).code(200);
    }
  }
  // Get todo detail by todo Id
  public async getTodoById(request: IRequest, reply: Hapi.ResponseToolkit) {
    try {
      const todoId = request.params["todoId"];
      const todo = await Todo.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(todoId), isDelete: false } },
        {
          $lookup: {
            from: "users",
            let: { userId: "$userId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
              {
                $project: {
                  name: "$name", serId: "$_id", _id: 0, email: "$email", address: "$address",
                  username: "$username", profilePicture: "$profilePicture", occupation: "$occupation"
                }
              }],
            as: "user"
          }
        },
        {
          $project: {
            task: "$task",
            createdAt: "$createdAt",
            completed: "$completed",
            todoId: { $toString: "$_id" },
            _id: 0,
            user: { $arrayElemAt: ["$user", 0] }
          }
        }
      ])
      return {
        status: true,
        message: "Todo information fetch successfully.",
        data: _.get(todo, "[0]", [])
      };
    } catch (error) {
      return {
        status: true,
        message: error,
        data: []
      };
    }
  }
  // Get todo list or fetch all todo list
  public async getTodoList(request: IRequest, reply: Hapi.ResponseToolkit) {
    try {
      const tasks = await Todo.aggregate([
        { $match: { isDelete: false } },
        {
          $lookup: {
            from: "users",
            let: { userId: "$userId" },
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            {
              $project: {
                name: "$name",
                userId: "$_id", _id: 0, username: "$username", profilePicture: "$profilePicture",
                occupation: "$occupation", email: "$email", address: "$address"
              }
            }],
            as: "user"
          }
        },
        {
          $project: {
            task: "$task", createdAt: "$createdAt",
            completed: "$completed", todoId: { $toString: "$_id" },
            _id: 0, user: { $arrayElemAt: ["$user", 0] }
          }
        }
      ]);
      return {
        status: true,
        message: "Todo list fetch successfully..",
        data: tasks
      };
    } catch (error) {
      return {
        status: true,
        message: error,
        data: []
      };
    }
  }
  // Filter todo for pagination
  public async filterTodoList(request: IRequest, reply: Hapi.ResponseToolkit) {
    let userId = request.auth.credentials.id;
    let top = request.query["top"];
    let skip = request.query["skip"];
    let tasks = await Todo
      .find({ userId: userId })
      .lean(true)
      .skip(skip)
      .limit(top);

    return tasks;
  }

}
