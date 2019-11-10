import * as Hapi from "hapi";

import { IPlugin } from "./utils/plugins/interfaces";
import { IServerConfigurations } from "./settings";
import * as Logs from "./utils/plugins/logging";
import { IDatabase } from "./config/database";
import * as Api from "./api";

export async function init(
  configs: IServerConfigurations,
  database: IDatabase
): Promise<Hapi.Server> {
  try {
    const port = process.env.PORT || configs.port;
    const server = new Hapi.Server({
      debug: { request: ['error'] },
      port: port,
      routes: {
        cors: {
          origin: ["*"]
        }
      }
    });
    console.log(`server is running on http://localhost:${port}`)


    if (configs.routePrefix) {
      server.realm.modifiers.route.prefix = configs.routePrefix;
    }

    //  Setup Hapi Plugins
    const plugins: Array<string> = configs.plugins;
    const pluginOptions = {
      database: database,
      serverConfigs: configs
    };

    let pluginPromises: Promise<any>[] = [];

    plugins.forEach((pluginName: string) => {
      var plugin: IPlugin = require("./utils/plugins/" + pluginName).default();
      console.log(
        `Register Plugin ${plugin.info().name} v${plugin.info().version}`
      );
      pluginPromises.push(plugin.register(server, pluginOptions));
    });

    await Promise.all(pluginPromises);

    console.log("All plugins registered successfully.");

    console.log("Register Routes");
    Logs.init(server, configs, database);
    Api.RegisterRoutes(server);
    console.log("Routes registered successfully.");

    return server;
  } catch (err) {
    console.log("Error starting server: ", err);
    throw err;
  }
}

