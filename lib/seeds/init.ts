import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("payment_methods").insert([
    {
      id: "11111111-1111-1111-1111-111111111111",
      name: "PIX",
      description: "Pagamento instantâneo brasileiro",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Cartão de Crédito",
      description: "Pagamento com cartão de crédito via Stripe",
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      name: "PayPal",
      description: "Pagamento via PayPal",
    },
  ]);

  await knex("users").insert([
    {
      id: "44444444-4444-4444-4444-444444444444",
      name: "admin",
      email: "admin@example.com",
      password: "$2a$10$JwU8S.jX9s5jjL5C7GZ9t.AMZtJ.hDvfxS1dCT1UGVpRNkYBlwXCe",
    },
  ]);

  await knex("offers").insert([
    {
      id: "55555555-5555-5555-5555-555555555555",
      user_id: "44444444-4444-4444-4444-444444444444",
      type: "sell",
      quantity: 100,
      price_per_coin: 10,
      currency: "BRL",
      payment_method: "11111111-1111-1111-1111-111111111111",
      status: "active",
      history:
        '[{"timestamp":"2025-03-22T00:00:00.000Z","event":"Offer created"}]',
    },
    {
      id: "66666666-6666-6666-6666-666666666666",
      user_id: "44444444-4444-4444-4444-444444444444",
      type: "buy",
      quantity: 200,
      price_per_coin: 9,
      currency: "BRL",
      payment_method: "22222222-2222-2222-2222-222222222222",
      status: "active",
      history:
        '[{"timestamp":"2025-03-22T00:00:00.000Z","event":"Offer created"}]',
    },
  ]);
}
