import hapi from 'hapi';
import * as joi from 'joi';
import * as ServerRoutes from '../index';
import AuthController from "./AuthController"
import * as Validation from "./AuthValidation"

const authController: AuthController = new AuthController();

export function userRoutes(): Array<ServerRoutes.Route> {
  let routes: Array<ServerRoutes.Route> = [
    {
      method: 'POST',
      path: '/login',
      handler: authController.login,
      config: {
        auth: false,
        validate: {
          payload: Validation.loginValidation
        },
        tags: ["api", "user"],
        description: "Login with email and password.",
        notes: [],
      }
    },
    {
      method: 'GET',
      path: '/me',
      handler: authController.authenticate,
      config: { auth: "jwt" }
    },
    {
      method: 'POST',
      path: '/users',
      handler: () => console.log("======="),
      config: {
        auth: false,
        validate: {
          payload: {
            username: joi.string(),
            age: joi.number().integer()
          }
        }
      }
    }
  ];
  return routes;
}
