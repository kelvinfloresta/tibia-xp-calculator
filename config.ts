import zod from "zod";

const StripeSchema = zod.object({
  apiKey: zod.string(),
  publicKey: zod.string(),
  webhookSecret: zod.string(),
});

const ConfigSchema = zod.object({
  env: zod.string(),
  stripe: StripeSchema,
  database: zod.object({
    host: zod.string(),
    user: zod.string(),
    password: zod.string(),
    name: zod.string(),
    port: zod.string(),
  }),
});

const parsed = ConfigSchema.safeParse({
  env: process.env.NODE_ENV,
  stripe: {
    apiKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
});

if (!parsed.success) {
  const error = new Error(
    `❌ Invalid environment variables:\n ${parsed.error.message}`
  );

  throw error;
}

export const config = parsed.data;
