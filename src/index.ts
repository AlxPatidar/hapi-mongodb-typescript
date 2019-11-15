import * as dot from "dotenv";
dot.config();
import * as Server from "./server";
import * as Database from "./config/database";
import * as Configs from "./settings";
import { cronOptions } from "./config/cron";

console.log(`Running environment ${process.env.NODE_ENV || "development"}`);

// Catch unhandling unexpected exceptions
process.on("uncaughtException", (error: Error) => {
  console.error(`uncaughtException ${error.message}`);
});

// Catch unhandling rejected promises
process.on("unhandledRejection", (reason: any) => {
  console.error(`unhandledRejection ${reason}`);
});

// Define async start function
const start = async ({ config, db, cronOptions }) => {
  try {
    const server = await Server.init(config, db, cronOptions);
    // Start server with call hapi server method
    await server.start();
    console.log("Server running at:", server.info.uri);
  } catch (err) {
    console.error("Error starting server: ", err.message);
    throw err;
  }
};

// Init Database
const dbConfigs = Configs.getDatabaseConfig();
const database = Database.init(dbConfigs);

// Starting Application Server
const serverConfigs = Configs.getServerConfigs();

// Start the server
start({
  config: serverConfigs,
  db: database,
  cronOptions
});
