import * as Hapi from "hapi";
import { IPlugin } from "./utils/plugins/interfaces";
import { IServerConfigurations } from "./settings";
import * as Logs from "./utils/plugins/logging";
import { IDatabase } from "./config/database";
import { ICronJob } from "./config/cron";
import * as Api from "./api";

export async function init(
  configs: IServerConfigurations,
  database: IDatabase,
  cronJobs: ICronJob
): Promise<Hapi.Server> {
  
  try {
    const port = process.env.PORT || configs.port;
    // Create hapi server instance
    const server = new Hapi.Server({
      debug: { request: ['error'] },
      port: port,
      routes: {
        cors: {
          origin: ["*"]
        }
      }
    });

    console.log("Register Routes");
    await Api.RegisterRoutes(server);
    console.log("Routes registered successfully.");
    console.log(`server is running on http://localhost:${port}`)

    if (configs.routePrefix) {
      server.realm.modifiers.route.prefix = configs.routePrefix;
    }
    //  Setup Hapi Plugins
    const plugins: Array<string> = configs.plugins;
    const pluginOptions = {
      database: database,
      serverConfigs: configs,
      cronJobs: cronJobs
    };

    let pluginPromises: Promise<any>[] = [];
    // List of all plugins
    plugins.forEach((pluginName: string) => {
      const plugin: IPlugin = require("./utils/plugins/" + pluginName).default();
      console.log(
        `Register Plugin ${plugin.info().name} v${plugin.info().version}`
      );
      pluginPromises.push(plugin.register(server, pluginOptions));
    });
    await Promise.all(pluginPromises);
    console.log("All plugins registered successfully.");
    Logs.init(server, configs, database);

    return server;
  } catch (err) {
    console.log("Error starting server: ", err);
    throw err;
  }
}

