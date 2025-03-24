import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("payment_methods", (table) => {
    table.uuid("id").primary();
    table
      .string("name")
      .notNullable()
      .comment("The name of the payment method");
    table
      .string("description")
      .nullable()
      .comment("The description of the payment method");
    table
      .boolean("is_active")
      .defaultTo(true)
      .comment("The status of the payment method");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("offers");
}
