import { OfferService } from "@/lib/services/offer";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.method, req.url);
  
  // GET /api/offers - List all active offers, optionally filtered by type
  if (req.method === "GET") {
    try {
      const { type } = req.query;
      const offers = await OfferService.getActiveOffers(type as "buy" | "sell" | undefined);
      return res.status(200).json(offers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorId: "ERROR_LISTING_OFFERS" });
    }
  }

  // POST /api/offers - Create a new offer
  if (req.method === "POST") {
    try {
      const offer = req.body;
      const id = await OfferService.create(offer);
      return res.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorId: "ERROR_CREATING_OFFER" });
    }
  }

  return res.status(405).json({ errorId: "METHOD_NOT_ALLOWED" });
}