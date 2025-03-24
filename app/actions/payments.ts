'use server';

import { OfferService } from "@/lib/services/offer";
import { revalidatePath } from "next/cache";

/**
 * Create a payment intent for an offer
 */
export async function createPaymentIntent(offerId: string, userId: string) {
  try {
    if (!userId) {
      return { success: false, errorId: "USER_ID_REQUIRED" };
    }

    const paymentIntent = await OfferService.createPaymentIntent(offerId, userId);
    if (!paymentIntent) {
      return { success: false, errorId: "OFFER_NOT_FOUND_OR_INACTIVE" };
    }

    return { success: true, data: paymentIntent };
  } catch (error) {
    console.error(error);
    return { success: false, errorId: "ERROR_CREATING_PAYMENT_INTENT" };
  }
}

/**
 * Complete a payment for an offer
 */
export async function completePayment(offerId: string, paymentIntentId: string) {
  try {
    if (!paymentIntentId) {
      return { success: false, errorId: "PAYMENT_INTENT_ID_REQUIRED" };
    }

    const completed = await OfferService.processPayment(offerId, paymentIntentId);
    if (!completed) {
      return { success: false, errorId: "OFFER_NOT_FOUND_INACTIVE_OR_PAYMENT_FAILED" };
    }

    revalidatePath('/offers');
    revalidatePath(`/offers/complete`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, errorId: "ERROR_COMPLETING_OFFER" };
  }
}