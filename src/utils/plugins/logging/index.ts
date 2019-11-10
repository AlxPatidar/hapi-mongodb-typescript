import * as Hapi from "hapi";
import { IDatabase } from "../../../config/database";
import { IServerConfigurations } from "../../../settings";

export function init(
  server: Hapi.Server,
  configs: IServerConfigurations,
  database: IDatabase
) {}
