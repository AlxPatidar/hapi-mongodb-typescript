import * as ServerRoutes from '../index';
import TodoController from './TodoController';
import * as Validation from "./TodoValidation";

const todoController: TodoController = new TodoController();

// Merge all todo based routes
export function todoRoutes(): Array<ServerRoutes.Route> {
  let routes: Array<ServerRoutes.Route> = [
    {
      method: 'GET',
      path: '/todos',
      handler: todoController.getTodoList,
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/filter-todos',
      handler: todoController.filterTodoList,
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/todos/{todoId}',
      handler: todoController.getTodoById,
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/todos',
      handler: todoController.createTodo,
      config: {
        auth: false,
        validate: {
          payload: Validation.createTodo
        }
      }
    },
    {
      method: 'PUT',
      path: '/todos/{todoId}',
      handler: todoController.updateTodo,
      config: {
        auth: false,
        validate: {
          payload: Validation.updateTodo
        }
      }
    },
    {
      method: 'DELETE',
      path: '/todos/{todoId}',
      handler: todoController.deleteTodo,
      config: {
        auth: false
      }
    },
  ];
  return routes;
}