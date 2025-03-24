"use client";

import { cancel, create, list } from "@/app/actions/offers";
import StripePaymentForm from "@/components/StripePaymentForm";
import { Offer } from "@/lib/services/offer.interface";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

// Mock user ID for demo purposes
// const MOCK_USER_ID = "44444444-4444-4444-4444-444444444444";
const MOCK_USER_ID = "55555555-5555-5555-5555-555555555555";

export default function OffersPage() {
  const t = useTranslations("Offers");
  const apiErrorsT = useTranslations("ApiErrors");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "view">("view");
  const [newOffer, setNewOffer] = useState({
    type: "sell" as "buy" | "sell",
    quantity: 100,
    price_per_coin: 10,
    currency: "BRL" as "BRL" | "USD" | "EUR",
  });

  // Fetch offers when the component mounts
  useEffect(() => {
    fetchOffers();
  }, []);

  // Fetch offers using server action
  const fetchOffers = async () => {
    setLoading(true);
    setErrorId(null);

    try {
      const result = await list();
      if (!result.success) {
        throw new Error(result.errorId || "ERROR_LISTING_OFFERS");
      }

      setOffers(result.data as Offer[]);
    } catch (err) {
      setErrorId((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new offer using server action
  const handleCreateOffer = async () => {
    setLoading(true);
    setErrorId(null);

    try {
      const result = await create({
        ...newOffer,
        user_id: MOCK_USER_ID,
      });

      if (!result.success) {
        throw new Error(result.errorId || "ERROR_CREATING_OFFER");
      }

      // Reset form and fetch updated offers
      setNewOffer({
        type: "sell",
        quantity: 100,
        price_per_coin: 10,
        currency: "BRL",
      });
      setFormMode("view");
      fetchOffers();
    } catch (err) {
      setErrorId((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Accept an offer
  const acceptOffer = async (offer: Offer) => {
    setSelectedOffer(offer);
    setShowPaymentForm(true);
  };

  // Cancel an offer using server action
  const handleCancelOffer = async (offerId: string) => {
    setLoading(true);
    setErrorId(null);

    try {
      const result = await cancel(offerId, "Canceled by user");

      if (!result.success) {
        throw new Error(result.errorId || "ERROR_CANCELING_OFFER");
      }

      fetchOffers();
    } catch (err) {
      setErrorId((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setSelectedOffer(null);
    fetchOffers();
  };

  // Handle payment error
  const handlePaymentError = (error: Error) => {
    setErrorId(error.message);
  };

  // Calculate total price
  const calculateTotalPrice = (quantity: number, pricePerCoin: number) => {
    return quantity * pricePerCoin;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      {errorId && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          {apiErrorsT(errorId)}
        </div>
      )}

      {/* Create Offer Form */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {formMode === "create" ? t("createOffer") : t("offerDetails")}
          </h2>
          {formMode === "view" ? (
            <button
              onClick={() => setFormMode("create")}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t("createOffer")}
            </button>
          ) : (
            <button
              onClick={() => setFormMode("view")}
              className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>

        {formMode === "create" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateOffer();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-2 font-medium">{t("type")}</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="buy"
                    checked={newOffer.type === "buy"}
                    onChange={() => setNewOffer({ ...newOffer, type: "buy" })}
                    className="mr-2"
                  />
                  {t("buy")}
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="sell"
                    checked={newOffer.type === "sell"}
                    onChange={() => setNewOffer({ ...newOffer, type: "sell" })}
                    className="mr-2"
                  />
                  {t("sell")}
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">{t("quantity")}</label>
              <input
                type="number"
                value={newOffer.quantity}
                onChange={(e) =>
                  setNewOffer({
                    ...newOffer,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                {t("pricePerCoin")}
              </label>
              <input
                type="number"
                value={newOffer.price_per_coin}
                onChange={(e) =>
                  setNewOffer({
                    ...newOffer,
                    price_per_coin: parseInt(e.target.value) || 0,
                  })
                }
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">{t("currency")}</label>
              <select
                value={newOffer.currency}
                onChange={(e) =>
                  setNewOffer({
                    ...newOffer,
                    currency: e.target.value as "BRL" | "USD" | "EUR",
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="BRL">BRL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                {t("totalPrice")}
              </label>
              <div className="p-2 bg-gray-100 rounded">
                {calculateTotalPrice(
                  newOffer.quantity,
                  newOffer.price_per_coin
                )}{" "}
                {newOffer.currency}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Loading..." : t("createOffer")}
            </button>
          </form>
        )}
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">{t("title")}</h2>

        {loading && !offers.length ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : !offers.length ? (
          <div className="p-6 text-center text-gray-500">{t("noOffers")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("type")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("quantity")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("pricePerCoin")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("totalPrice")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("status")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          offer.type === "buy"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {t(offer.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {offer.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {offer.price_per_coin} {offer.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {calculateTotalPrice(
                        offer.quantity,
                        offer.price_per_coin
                      )}{" "}
                      {offer.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          offer.status === "active"
                            ? "bg-green-100 text-green-800"
                            : offer.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {t(offer.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {offer.status === "active" && (
                        <>
                          {offer.user_id !== MOCK_USER_ID ? (
                            <button
                              onClick={() => acceptOffer(offer)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              {t("acceptOffer")}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCancelOffer(offer.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              {t("cancelOffer")}
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("acceptOffer")}</h2>
              <button
                onClick={() => {
                  setShowPaymentForm(false);
                  setSelectedOffer(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-2">
                <strong>{t("type")}:</strong> {t(selectedOffer.type)}
              </p>
              <p className="mb-2">
                <strong>{t("quantity")}:</strong> {selectedOffer.quantity}
              </p>
              <p className="mb-2">
                <strong>{t("pricePerCoin")}:</strong>{" "}
                {selectedOffer.price_per_coin} {selectedOffer.currency}
              </p>
              <p className="mb-4">
                <strong>{t("totalPrice")}:</strong>{" "}
                {calculateTotalPrice(
                  selectedOffer.quantity,
                  selectedOffer.price_per_coin
                )}{" "}
                {selectedOffer.currency}
              </p>
            </div>

            <StripePaymentForm
              offerId={selectedOffer.id}
              userId={MOCK_USER_ID}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      )}
    </div>
  );
}
