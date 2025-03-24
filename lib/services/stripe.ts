import { config } from "@/config";
import Stripe from "stripe";
import { Currency } from "./offer.interface";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(config.stripe.apiKey, {
  apiVersion: "2025-02-24.acacia", // Use the latest API version
});

export class StripeService {
  /**
   * Create a payment intent for an offer
   * @param amount The amount to charge in the smallest currency unit (e.g., cents for USD)
   * @param currency The currency to charge in
   * @param metadata Additional metadata to store with the payment intent
   * @returns The created payment intent
   */
  static async createPaymentIntent(
    amount: number,
    currency: Currency,
    metadata: Record<string, string>
  ): Promise<Stripe.PaymentIntent> {
    return await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  /**
   * Retrieve a payment intent by ID
   * @param paymentIntentId The ID of the payment intent to retrieve
   * @returns The retrieved payment intent
   */
  static async retrievePaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  }

  /**
   * Confirm a payment intent
   * @param paymentIntentId The ID of the payment intent to confirm
   * @returns The confirmed payment intent
   */
  static async confirmPaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    return await stripe.paymentIntents.confirm(paymentIntentId);
  }

  /**
   * Cancel a payment intent
   * @param paymentIntentId The ID of the payment intent to cancel
   * @returns The canceled payment intent
   */
  static async cancelPaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    return await stripe.paymentIntents.cancel(paymentIntentId);
  }

  /**
   * Create a Stripe Checkout session for an offer
   * @param amount The amount to charge in the smallest currency unit (e.g., cents for USD)
   * @param currency The currency to charge in
   * @param metadata Additional metadata to store with the session
   * @param successUrl The URL to redirect to after a successful payment
   * @param cancelUrl The URL to redirect to after a canceled payment
   * @returns The created checkout session
   */
  static async createCheckoutSession(
    amount: number,
    currency: Currency,
    metadata: Record<string, string>,
    successUrl: string,
    cancelUrl: string
  ): Promise<Stripe.Checkout.Session> {
    return await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: "Tibia Coins",
              description: `${metadata.quantity} Tibia Coins`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });
  }
}
