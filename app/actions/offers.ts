"use server";

import { OfferService } from "@/lib/services/offer";
import {
  AcceptOfferDto,
  CreateOfferDto,
  UpdateOfferDto,
} from "@/lib/services/offer.interface";
import { revalidatePath } from "next/cache";

/**
 * Get all active offers, optionally filtered by type
 */
export async function list(type?: "buy" | "sell") {
  try {
    const offers = await OfferService.getActiveOffers(type);
    return { success: true, data: offers };
  } catch (error) {
    console.error(error);
    return { success: false, errorId: "ERROR_LISTING_OFFERS" };
  }
}

/**
 * Get an offer by ID
 */
export async function get(id: string) {
  try {
    const offer = await OfferService.getById(id);
    if (!offer) {
      return { success: false, errorId: "OFFER_NOT_FOUND" };
    }
    return { success: true, data: offer };
  } catch (error) {
    console.error(error);
    return { success: false, errorId: "ERROR_FETCHING_OFFER" };
  }
}

/**
 * Create a new offer
 */
export async function create(offerData: CreateOfferDto) {
  try {
    const id = await OfferService.create(offerData);
    revalidatePath("/offers");
    return { success: true, data: { id } };
  } catch (error) {
    console.error(error);
    return { success: false, errorId: "ERROR_CREATING_OFFER" };
  }
}

/**
 * Update an offer
 */
export async function update(id: string, offerData: UpdateOfferDto) {
  try {
    const updated = await OfferService.update(id, offerData);
    if (!updated) {
      return { success: false, errorId: "OFFER_NOT_FOUND" };
    }
    revalidatePath("/offers");
    revalidatePath(`/offers/${id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, errorId: "ERROR_UPDATING_OFFER" };
  }
}

/**
 * Delete an offer
 */
export async function del(id: string) {
  try {
    const deleted = await OfferService.del(id);
    if (!deleted) {
      return { success: false, errorId: "OFFER_NOT_FOUND" };
    }
    revalidatePath("/offers");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, errorId: "ERROR_DELETING_OFFER" };
  }
}

/**
 * Accept an offer
 */
export async function accept(id: string, acceptData: AcceptOfferDto) {
  try {
    const accepted = await OfferService.acceptOffer(id, acceptData);
    if (!accepted) {
      return { success: false, errorId: "OFFER_NOT_FOUND_OR_INACTIVE" };
    }
    revalidatePath("/offers");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, errorId: "ERROR_ACCEPTING_OFFER" };
  }
}

/**
 * Cancel an offer
 */
export async function cancel(id: string, reason: string) {
  try {
    if (!reason) {
      return { success: false, errorId: "CANCELLATION_REASON_REQUIRED" };
    }

    const canceled = await OfferService.cancelOffer(id, reason);
    if (!canceled) {
      return { success: false, errorId: "OFFER_NOT_FOUND_OR_INACTIVE" };
    }
    revalidatePath("/offers");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, errorId: "ERROR_CANCELING_OFFER" };
  }
}
