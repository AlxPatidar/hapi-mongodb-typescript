import hapi from 'hapi';
import * as User from './users';
import * as Todo from './todos';

// Create routes array for register routes on server
export function RegisterRoutes(server: hapi.Server): void {
  let routes: Array<Route> = [].concat(
    User.userRoutes(),
    Todo.todoRoutes()
  );
  server.route(routes);
}

export class Route implements hapi.IRouteConfiguration {
  method: string;
  path: string;
  handler: any;
  config: hapi.IRouteHandlerConfig;
}