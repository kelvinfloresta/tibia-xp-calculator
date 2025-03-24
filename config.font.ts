import zod from "zod";

const ConfigSchema = zod.object({
  stripe: zod.object({
    publicKey: zod.string(),
  }),
});

const parsed = ConfigSchema.safeParse({
  stripe: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
});

if (!parsed.success) {
  const error = new Error(
    `❌ Invalid environment variables:\n ${parsed.error.message}`
  );

  throw error;
}

export const config = parsed.data;
