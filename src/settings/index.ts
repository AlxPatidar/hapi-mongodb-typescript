import * as nconf from "nconf";
import * as path from "path";
import config from "../config";

// Read Configurations
const configs = new nconf.Provider({
  env: true,
  argv: true,
  store: {
    type: "file",
    file: path.join(__dirname, `./config.${config.environment || "dev"}.json`)
  }
});


export interface IServerConfigurations {
  port: number;
  plugins: Array<string>;
  jwtSecret: string;
  jwtExpiration: string;
  routePrefix: string;
}

export interface IDataConfiguration {
  connectionString: string;
}

export function getDatabaseConfig(): IDataConfiguration {
 // return configs.get("database");
  return {
    "connectionString": config.db.mongoUrl
  };
}

export function getServerConfigs(): IServerConfigurations {
  // return configs.get("server");
  return {
    "port": config.app.port,
    "jwtSecret": config.app.jwtSecret,
    "jwtExpiration": "1h",
    "routePrefix": config.app.routePrefix,
    "plugins": config.app.plugins
  };
}
