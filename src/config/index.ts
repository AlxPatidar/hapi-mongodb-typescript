export const NODE_ENV = process.env.NODE_ENV || "development";

const dev = {
  environment: "development",
  app: {
    host: process.env.HOST || 'localhost',
    // tslint:disable-next-line:radix
    port: parseInt(process.env.PORT) || 5002,
    jwtSecret: "random-secret-password",
    routePrefix: "/api/v1",
    plugins: ["logger", "jwt-auth", "swagger"]
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    // tslint:disable-next-line:radix
    port: parseInt(process.env.DB_PORT) || 27017,
    name: process.env.DB_NAME || 'db',
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/development"
  }
};

const test = {
  environment: "test",
  app: {
    host: process.env.HOST || 'localhost',
    // tslint:disable-next-line:radix
    port: parseInt(process.env.PORT) || 5002,
    jwtSecret: "random-secret-password",
    routePrefix: "/api/v1",
    plugins: ["logger", "jwt-auth", "swagger"]
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    // tslint:disable-next-line:radix
    port: parseInt(process.env.DB_PORT) || 27017,
    name: process.env.DB_NAME || 'test',
    url: process.env.MONGO_URL || "mongodb://localhost:27017/development"
  }
};


const config = {
  dev,
  test
};

export default config[NODE_ENV];
