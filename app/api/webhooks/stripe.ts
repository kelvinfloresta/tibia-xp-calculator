import { config } from "@/config";
import { OfferService } from "@/lib/services/offer";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(config.stripe.apiKey, {
  apiVersion: "2025-02-24.acacia",
});

/**
 * This endpoint handles Stripe webhooks
 * It verifies the webhook signature and processes the event
 * @param req The request object
 * @param res The response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ errorId: "METHOD_NOT_ALLOWED" });
  }

  const signature = req.headers["stripe-signature"] as string;
  if (!signature) {
    return res.status(400).json({ errorId: "WEBHOOK_SIGNATURE_NOT_FOUND" });
  }

  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe.webhookSecret
    );

    // Handle the event based on its type
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;
      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(400).json({ errorId: "ERROR_PROCESSING_WEBHOOK" });
  }
}

/**
 * Handle a successful payment intent
 * @param paymentIntent The payment intent object
 */
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  const { offerId } = paymentIntent.metadata;
  if (!offerId) {
    console.error("Offer ID not found in payment intent metadata");
    return;
  }

  try {
    // Complete the offer
    await OfferService.completeOffer(offerId, paymentIntent.id);
    console.log(`Offer ${offerId} completed successfully`);
  } catch (error) {
    console.error(`Error completing offer ${offerId}:`, error);
  }
}

/**
 * Handle a failed payment intent
 * @param paymentIntent The payment intent object
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { offerId } = paymentIntent.metadata;
  if (!offerId) {
    console.error("Offer ID not found in payment intent metadata");
    return;
  }

  try {
    // Cancel the offer
    await OfferService.cancelOffer(
      offerId,
      `Payment failed: ${
        paymentIntent.last_payment_error?.message || "Unknown error"
      }`
    );
    console.log(`Offer ${offerId} canceled due to payment failure`);
  } catch (error) {
    console.error(`Error canceling offer ${offerId}:`, error);
  }
}
