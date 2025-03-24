"use client";

import { completePayment } from "@/app/actions/payments";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentCompletePage() {
  const t = useTranslations("Payment");
  const apiErrorsT = useTranslations("ApiErrors");
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get the payment intent ID and offer ID from the URL
        const paymentIntentId = searchParams.get("payment_intent");
        const offerId = searchParams.get("offerId");

        if (!paymentIntentId || !offerId) {
          setStatus("error");
          setErrorId("MISSING_PARAMETERS");
          return;
        }

        // Call the server action to complete the offer
        const result = await completePayment(offerId, paymentIntentId);

        if (!result.success) {
          throw new Error(result.errorId || "ERROR_PROCESSING_PAYMENT");
        }

        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorId((error as Error).message || "ERROR_PROCESSING_PAYMENT");
      }
    };

    checkPaymentStatus();
  }, [searchParams, t]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6">{t("paymentStatus")}</h1>

      {status === "loading" && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {status === "success" && (
        <div className="mb-6">
          <div className="p-4 bg-green-100 text-green-700 rounded mb-4">
            {t("paymentSuccessful")}
          </div>
          <p className="mb-4">{t("thankYou")}</p>
          <Link
            href="/offers"
            className="inline-block py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t("backToOffers")}
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6">
          <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
            {errorId ? apiErrorsT(errorId) : t("errorProcessingPayment")}
          </div>
          <p className="mb-4">{t("tryAgain")}</p>
          <Link
            href="/offers"
            className="inline-block py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t("backToOffers")}
          </Link>
        </div>
      )}
    </div>
  );
}
