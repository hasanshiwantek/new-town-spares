"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface PaymentStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  watchedPaymentMethod: string;
  handlePaymentSelection: (method: string) => void;
  cardCompletion: {
    number: boolean;
    expiry: boolean;
    cvc: boolean;
  };
  setCardCompletion: React.Dispatch<
    React.SetStateAction<{
      number: boolean;
      expiry: boolean;
      cvc: boolean;
    }>
  >;
  cardError: string | null;
  setCardError: React.Dispatch<React.SetStateAction<string | null>>;
  walletSupport: {
    applePay: boolean;
    googlePay: boolean;
  };
  isProcessing: boolean;
  stripe: any;
  isActive: boolean;
  isCompleted: boolean;
  onEdit?: () => void;
  paymentMethodLabel?: string;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  register,
  errors,
  watchedPaymentMethod,
  handlePaymentSelection,
  cardCompletion,
  setCardCompletion,
  cardError,
  setCardError,
  walletSupport,
  isProcessing,
  stripe,
  isActive,
  isCompleted,
  onEdit,
  paymentMethodLabel,
}) => {
  const stripeCardMethods = ["credit_card"];

  if (isCompleted && !isActive) {
    // Show completed state with payment method and edit button
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{paymentMethodLabel || "Credit Card"}</span>
        <button
          type="button"
          onClick={onEdit}
          className="btn-primary"
        >
          EDIT
        </button>
      </div>
    );
  }

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      {/* Stripe Credit Card */}
      <label className="flex flex-col bg-white border rounded-lg p-4 cursor-pointer has-[:checked]:border-red-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              value="credit_card"
              {...register("paymentMethod", {
                required: "Please select a payment method",
              })}
              checked={watchedPaymentMethod === "credit_card"}
              onChange={() => handlePaymentSelection("credit_card")}
            />
            <span className="font-semibold text-gray-800">Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/checkouticon/card.png"
              alt="Cards"
              width={120}
              height={30}
            />
          </div>
        </div>

        {stripeCardMethods.includes(watchedPaymentMethod) && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-base mb-2 block text-gray-700">
                Card number
              </label>
              <div className="border border-gray-400 rounded-md p-3  hover:border-gray-400 focus-within:border-red-600">
                <CardNumberElement
                  onChange={(event) => {
                    setCardCompletion((prev) => ({
                      ...prev,
                      number: event.complete,
                    }));
                    setCardError(event.error?.message || null);
                  }}
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#333",
                        "::placeholder": {
                          color: "#aaa",
                        },
                      },
                      invalid: {
                        color: "#fa755a",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-base mb-2 block text-gray-700">
                  Expiration date
                </label>
                <div className="border  border-gray-400 rounded-md p-3 hover:border-gray-400 focus-within:border-red-600">
                  <CardExpiryElement
                    onChange={(event) => {
                      setCardCompletion((prev) => ({
                        ...prev,
                        expiry: event.complete,
                      }));
                      setCardError(event.error?.message || null);
                    }}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#333",
                          "::placeholder": {
                            color: "#aaa",
                          },
                        },
                        invalid: {
                          color: "#fa755a",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-base mb-2 block text-gray-700">
                  Security code
                </label>
                <div className="border  border-gray-400 rounded-md p-3 hover:border-gray-400 focus-within:border-red-600">
                  <CardCvcElement
                    onChange={(event) => {
                      setCardCompletion((prev) => ({
                        ...prev,
                        cvc: event.complete,
                      }));
                      setCardError(event.error?.message || null);
                    }}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#333",
                          "::placeholder": {
                            color: "#aaa",
                          },
                        },
                        invalid: {
                          color: "#fa755a",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {cardError && (
              <p className="text-sm text-red-500">{cardError}</p>
            )}
          </div>
        )}
      </label>

      {/* Apple Pay */}
      <label
        className={`flex items-center justify-between border-[1px] border-gray-400 rounded-lg p-4 cursor-pointer bg-white hover:border-red-600 transition-colors ${!walletSupport.applePay ? "hidden" : ""}`}
      >
        <div className="flex items-center gap-3">
          <input
            type="radio"
            value="apple_pay"
            {...register("paymentMethod")}
            checked={watchedPaymentMethod === "apple_pay"}
            onChange={() => handlePaymentSelection("apple_pay")}
          />
          <Image
            src="/checkouticon/Apple-icon.svg"
            alt="Apple Pay"
            width={30}
            height={30}
          />
        </div>
        <Image
          src="/checkouticon/card.png"
          alt="Cards"
          width={100}
          height={30}
        />
      </label>

      {/* Google Pay */}

      <label
        className={`flex items-center justify-between border-[1px] border-gray-400 rounded-lg p-4 cursor-pointer bg-white hover:border-red-600 transition-colors ${!walletSupport.googlePay ? "hidden" : ""}`}
      >
        <div className="flex items-center gap-3">
          <input
            type="radio"
            value="google_pay"
            {...register("paymentMethod")}
            checked={watchedPaymentMethod === "google_pay"}
            onChange={() => handlePaymentSelection("google_pay")}
          />
          <Image
            src="/checkouticon/googlepay.png"
            alt="Google Pay"
            width={60}
            height={30}
          />
        </div>
        <Image
          src="/checkouticon/card.png"
          alt="Cards"
          width={100}
          height={30}
        />
      </label>

      {errors.paymentMethod && (
        <p className="text-sm text-red-500 mt-2">
          {errors.paymentMethod.message as string}
        </p>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="btn-primary"
      >
        {isProcessing ? "Processing..." : "PLACE ORDER"}
      </button>
    </div>
  );
};

export default PaymentStep;