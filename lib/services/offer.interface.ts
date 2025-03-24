export interface TransactionHistory {
  readonly timestamp: string;
  readonly event: string;
  readonly data?: Record<string, unknown>;
}

export type OfferType = "buy" | "sell";
export type OfferStatus = "active" | "completed" | "canceled" | "expired";
export type Currency = "BRL" | "USD" | "EUR";

export interface Offer {
  readonly id: string;
  readonly user_id: string;
  readonly type: OfferType;
  readonly quantity: number;
  readonly price_per_coin: number;
  readonly currency: Currency;
  readonly payment_method?: string;
  readonly counterparty_id?: string;
  readonly status: OfferStatus;
  readonly history: readonly TransactionHistory[];
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CreateOfferDto {
  readonly user_id: string;
  readonly type: OfferType;
  readonly quantity: number;
  readonly price_per_coin: number;
  readonly currency: Currency;
  readonly payment_method?: string;
}

export interface UpdateOfferDto {
  readonly quantity?: number;
  readonly price_per_coin?: number;
  readonly currency?: Currency;
  readonly payment_method?: string;
  readonly status?: OfferStatus;
}

export interface AcceptOfferDto {
  readonly counterparty_id: string;
  readonly payment_intent_id?: string;
}

export interface PaymentIntent {
  readonly id: string;
  readonly amount: number;
  readonly currency: Currency;
  readonly status: string;
  readonly client_secret: string;
}