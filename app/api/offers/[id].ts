import { OfferService } from "@/lib/services/offer";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const offerId = id as string;

  if (!offerId) {
    return res.status(400).json({ errorId: "INVALID_ID" });
  }

  // GET /api/offers/[id] - Get an offer by ID
  if (req.method === "GET") {
    try {
      const offer = await OfferService.getById(offerId);
      return offer 
        ? res.json(offer) 
        : res.status(404).json({ errorId: "OFFER_NOT_FOUND" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorId: "ERROR_FETCHING_OFFER" });
    }
  }

  // PUT /api/offers/[id] - Update an offer
  if (req.method === "PUT") {
    try {
      const updateData = req.body;
      const updated = await OfferService.update(offerId, updateData);
      return updated 
        ? res.status(204).end() 
        : res.status(404).json({ errorId: "OFFER_NOT_FOUND" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorId: "ERROR_UPDATING_OFFER" });
    }
  }

  // DELETE /api/offers/[id] - Delete an offer
  if (req.method === "DELETE") {
    try {
      const deleted = await OfferService.del(offerId);
      return deleted 
        ? res.status(204).end() 
        : res.status(404).json({ errorId: "OFFER_NOT_FOUND" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorId: "ERROR_DELETING_OFFER" });
    }
  }

  // POST /api/offers/[id]/accept - Accept an offer
  if (req.method === "POST" && req.url?.includes("/accept")) {
    try {
      const acceptData = req.body;
      const accepted = await OfferService.acceptOffer(offerId, acceptData);
      return accepted 
        ? res.status(204).end() 
        : res.status(404).json({ errorId: "OFFER_NOT_FOUND_OR_INACTIVE" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorId: "ERROR_ACCEPTING_OFFER" });
    }
  }

  // POST /api/offers/[id]/payment - Create a payment intent for an offer
  if (req.method === "POST" && req.url?.includes("/payment")) {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ errorId: "USER_ID_REQUIRED" });
      }

      const paymentIntent = await OfferService.createPaymentIntent(offerId, userId);
      return paymentIntent 
        ? res.status(201).json(paymentIntent) 
        : res.status(404).json({ errorId: "OFFER_NOT_FOUND_OR_INACTIVE" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorId: "ERROR_CREATING_PAYMENT_INTENT" });
    }
  }

  // POST /api/offers/[id]/complete - Complete an offer after payment
  if (req.method === "POST" && req.url?.includes("/complete")) {
    try {
      const { paymentIntentId } = req.body;
      if (!paymentIntentId) {
        return res.status(400).json({ errorId: "PAYMENT_INTENT_ID_REQUIRED" });
      }

      const completed = await OfferService.processPayment(offerId, paymentIntentId);
      return completed 
        ? res.status(204).end() 
        : res.status(404).json({ errorId: "OFFER_NOT_FOUND_INACTIVE_OR_PAYMENT_FAILED" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorId: "ERROR_COMPLETING_OFFER" });
    }
  }

  // POST /api/offers/[id]/cancel - Cancel an offer
  if (req.method === "POST" && req.url?.includes("/cancel")) {
    try {
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ errorId: "CANCELLATION_REASON_REQUIRED" });
      }

      const canceled = await OfferService.cancelOffer(offerId, reason);
      return canceled 
        ? res.status(204).end() 
        : res.status(404).json({ errorId: "OFFER_NOT_FOUND_OR_INACTIVE" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorId: "ERROR_CANCELING_OFFER" });
    }
  }

  return res.status(405).json({ errorId: "METHOD_NOT_ALLOWED" });
}