import { config as appConfig } from "@/config";
import type { Knex } from "knex";

const connection: Knex.Config["connection"] = {
  host: appConfig.database.host,
  user: appConfig.database.user,
  password: appConfig.database.password,
  database: appConfig.database.name,
  port: appConfig.database.port,
};

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection,
    migrations: {
      directory: "./lib/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./lib/seeds",
      extension: "ts",
    },
  },

  production: {
    client: "pg",
    connection,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./lib/migrations",
      extension: "ts",
    },
  },
};

export default config;
