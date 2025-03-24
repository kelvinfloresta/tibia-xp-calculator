import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import {
  AcceptOfferDto,
  CreateOfferDto,
  Offer,
  PaymentIntent,
  TransactionHistory,
  UpdateOfferDto,
} from "./offer.interface";
import { StripeService } from "./stripe";

export class OfferService {
  static async create(offerDto: CreateOfferDto): Promise<string> {
    console.log(offerDto);

    const now = new Date().toISOString();
    const history: TransactionHistory[] = [
      { timestamp: now, event: "Offer created" },
    ];

    const [offer] = await db("offers")
      .insert({
        id: uuidv4(),
        ...offerDto,
        status: "active",
        history: JSON.stringify(history),
        created_at: now,
        updated_at: now,
      })
      .returning("id");

    return offer.id;
  }

  static async getById(id: string): Promise<Offer | null> {
    const offer = await db("offers").where({ id }).first();
    return offer || null;
  }

  static async update(id: string, offerDto: UpdateOfferDto): Promise<boolean> {
    const offer = await this.getById(id);
    if (!offer) return false;

    const now = new Date().toISOString();
    const history = [...offer.history];

    history.push({
      timestamp: now,
      event: "Offer updated",
      data: { previous: { ...offer }, updated: { ...offerDto } },
    });

    const updated = await db("offers")
      .where({ id })
      .update({
        ...offerDto,
        history: JSON.stringify(history),
        updated_at: now,
      });

    return updated > 0;
  }

  static async del(id: string): Promise<boolean> {
    const offer = await this.getById(id);
    if (!offer) return false;

    const now = new Date().toISOString();
    const history = [...offer.history];

    history.push({
      timestamp: now,
      event: "Offer deleted",
    });

    const updated = await db("offers")
      .where({ id })
      .update({
        status: "canceled",
        history: JSON.stringify(history),
        updated_at: now,
      });

    return updated > 0;
  }

  static async getActiveOffers(type?: "buy" | "sell"): Promise<Offer[]> {
    const query = db("offers").where({ status: "active" });

    if (type) {
      query.andWhere({ type });
    }

    const offers = await query.orderBy("created_at", "desc");

    console.log(offers[0].history);
    return offers;
  }

  static async acceptOffer(
    id: string,
    acceptDto: AcceptOfferDto
  ): Promise<boolean> {
    const offer = await this.getById(id);
    if (!offer || offer.status !== "active") return false;

    const now = new Date().toISOString();
    const history = [...offer.history];

    history.push({
      timestamp: now,
      event: "Offer accepted",
      data: { counterparty_id: acceptDto.counterparty_id },
    });

    const updated = await db("offers")
      .where({ id })
      .update({
        counterparty_id: acceptDto.counterparty_id,
        status: acceptDto.payment_intent_id ? "completed" : "active",
        history: history,
        updated_at: now,
      });

    return updated > 0;
  }

  static async completeOffer(
    id: string,
    paymentIntentId: string
  ): Promise<boolean> {
    const offer = await this.getById(id);
    if (!offer || offer.status !== "active" || !offer.counterparty_id)
      return false;

    const now = new Date().toISOString();
    const history = [...offer.history];

    history.push({
      timestamp: now,
      event: "Payment completed",
      data: { payment_intent_id: paymentIntentId },
    });

    const updated = await db("offers").where({ id }).update({
      status: "completed",
      history: history,
      updated_at: now,
    });

    return updated > 0;
  }

  static async cancelOffer(id: string, reason: string): Promise<boolean> {
    const offer = await this.getById(id);
    if (!offer || offer.status !== "active") return false;

    const now = new Date().toISOString();
    const history = [...offer.history];

    history.push({
      timestamp: now,
      event: "Offer canceled",
      data: { reason },
    });

    const updated = await db("offers")
      .where({ id })
      .update({
        status: "canceled",
        history: JSON.stringify(history),
        updated_at: now,
      });

    return updated > 0;
  }

  /**
   * Create a payment intent for an offer
   * @param offerId The ID of the offer to create a payment intent for
   * @param userId The ID of the user creating the payment intent
   * @returns The created payment intent
   */
  static async createPaymentIntent(
    offerId: string,
    userId: string
  ): Promise<PaymentIntent | null> {
    const offer = await this.getById(offerId);
    if (!offer || offer.status !== "active") return null;

    // Calculate the total amount in the smallest currency unit (e.g., cents for USD)
    const amount = offer.price_per_coin * offer.quantity;

    try {
      // Create a payment intent with Stripe
      const paymentIntent = await StripeService.createPaymentIntent(
        amount,
        offer.currency,
        {
          offerId,
          userId,
          quantity: offer.quantity.toString(),
          type: offer.type,
        }
      );

      // Return the payment intent in our application format
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: offer.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret || "",
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return null;
    }
  }

  /**
   * Process a payment for an offer
   * @param offerId The ID of the offer to process payment for
   * @param paymentIntentId The ID of the payment intent to process
   * @returns Whether the payment was processed successfully
   */
  static async processPayment(
    offerId: string,
    paymentIntentId: string
  ): Promise<boolean> {
    try {
      // Retrieve the payment intent from Stripe
      const paymentIntent = await StripeService.retrievePaymentIntent(
        paymentIntentId
      );

      // If the payment intent is successful, complete the offer
      if (paymentIntent.status === "succeeded") {
        return await this.completeOffer(offerId, paymentIntentId);
      }

      return false;
    } catch (error) {
      console.error("Error processing payment:", error);
      return false;
    }
  }
}
