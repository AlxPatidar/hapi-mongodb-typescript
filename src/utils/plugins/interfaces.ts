import * as Hapi from "hapi";
import { IDatabase } from "../../config/database";
import { ICronJob } from "../../config/cron";
import { IServerConfigurations } from "../../settings";

export interface IPluginOptions {
  database: IDatabase;
  serverConfigs: IServerConfigurations;
  cronJobs: ICronJob;
}

export interface IPlugin {
  register(server: Hapi.Server, options?: IPluginOptions): Promise<void>;
  info(): IPluginInfo;
}

export interface IPluginInfo {
  name: string;
  version: string;
}
