import * as Mongoose from "mongoose";
import { IDataConfiguration } from "../settings";

import { ILogging, LoggingModel } from "../utils/plugins/logging/logging";
import { IUser, User } from "../models/User";

export interface IDatabase {
  loggingModel: Mongoose.Model<ILogging>;
  userModel: Mongoose.Model<IUser>;
}

export function init(config: IDataConfiguration): IDatabase {
  (<any>Mongoose).Promise = Promise;
  Mongoose.connect(config.connectionString);

  let mongoDb = Mongoose.connection;
  // Mongodb error when unable to connect
  mongoDb.on("error", () => {
    console.log(`Unable to connect to database: ${config.connectionString}`);
  });
  // Mongodb success on connection
  mongoDb.once("open", () => {
    console.log(`Connected to database: ${config.connectionString}`);
  });

  return {
    loggingModel: LoggingModel,
    userModel: User
  };
}
