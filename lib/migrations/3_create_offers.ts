import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("offers", (table) => {
    table.uuid("id").primary();
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").comment("The user who created the offer");
    table.enu("type", ["buy", "sell"]).notNullable().comment("The type of the offer");
    table.integer("quantity").notNullable().comment("The quantity of the coin");
    table.integer("price_per_coin").notNullable().comment("The price per coin");
    table.enu("currency", ["BRL", "USD", "EUR"]).notNullable().defaultTo("BRL").comment("Currency of the transaction");
    table.uuid("payment_method").nullable().references("id").inTable("payment_methods").comment("The payment method");
    table.uuid("counterparty_id").nullable().references("id").inTable("users").comment("The user who accepted the offer");
    table.enu("status", ["active", "completed", "canceled", "expired"]).defaultTo("active");
    table.jsonb("history").defaultTo(JSON.stringify([])).comment("The history of the offer");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("offers");
}