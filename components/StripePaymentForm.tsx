"use client";

import { createPaymentIntent } from "@/app/actions/payments";
import { Button } from "@/components/ui/button";
import { config } from "@/config.font";
import { PaymentIntent } from "@/lib/services/offer.interface";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface StripePaymentFormProps {
  offerId: string;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function StripePaymentForm({
  offerId,
  userId,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const t = useTranslations("ApiErrors");
  const paymentT = useTranslations("Payment");
  const [loading, setLoading] = useState(false);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Create a payment intent when the component mounts
    const fetchPaymentIntent = async () => {
      setLoading(true);
      setErrorId(null);

      try {
        const result = await createPaymentIntent(offerId, userId);

        if (!result.success) {
          throw new Error(result.errorId || "ERROR_CREATING_PAYMENT_INTENT");
        }

        const paymentIntent = result.data as PaymentIntent;
        setClientSecret(paymentIntent.client_secret);
      } catch (err) {
        const errorMessage = (err as Error).message;
        setErrorId(errorMessage);
        if (onError) onError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [offerId, userId, onError]);

  useEffect(() => {
    // Initialize Stripe when the client secret is available
    if (!clientSecret) return;

    const initializeStripe = async () => {
      const stripe = await loadStripe(config.stripe.publicKey);
      const elements = stripe!.elements({
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      });

      const paymentElement = elements.create("payment");
      paymentElement.mount("#payment-element");

      // Handle form submission
      const form = document.getElementById("payment-form") as HTMLFormElement;
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        setLoading(true);

        const { error: submitError } = await stripe!.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/offers/complete?offerId=${offerId}`,
          },
        });

        if (submitError) {
          setErrorId("ERROR_PROCESSING_PAYMENT");
          setLoading(false);
          if (onError)
            onError(
              new Error(submitError.message || "ERROR_PROCESSING_PAYMENT")
            );
        } else {
          // Payment succeeded, will redirect to return_url
          onSuccess?.();
        }
      });
    };

    initializeStripe();
  }, [clientSecret, offerId, onSuccess, onError]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{paymentT("paymentStatus")}</h2>

      {errorId && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {t(errorId)}
        </div>
      )}

      {loading && !clientSecret && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {clientSecret && (
        <form id="payment-form" className="space-y-4">
          <div id="payment-element" className="mb-6"></div>
          <Button type="submit" disabled={loading}>
            {paymentT("pay")}
          </Button>
        </form>
      )}
    </div>
  );
}

// Helper function to load Stripe
async function loadStripe(key: string) {
  const { loadStripe } = await import("@stripe/stripe-js");
  return loadStripe(key);
}
