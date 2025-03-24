import { config as appConfig } from "@/config";
import config from "@/knexfile";
import knex from "knex";

export const db = knex(config[appConfig.env]);
