"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Link from "next/link";
interface CustomerStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onContinue: () => void;
  walletSupport: {
    applePay: boolean;
    googlePay: boolean;
  };
  onWalletClick: (method: string) => void;
  isActive: boolean;
  isCompleted: boolean;
  onEdit?: () => void;
  emailValue?: string;
}

const CustomerStep: React.FC<CustomerStepProps> = ({
  register,
  errors,
  onContinue,
  walletSupport,
  onWalletClick,
  isActive,
  isCompleted,
  onEdit,
  emailValue,
}) => {
  return (
    <>
      {isCompleted && !isActive ? (
        // Show completed state with email and edit button
        <div className="flex items-center justify-between">
          <span className="text-base text-gray-600">{emailValue}</span>
          <button
            type="button"
            onClick={onEdit}
            className="btn-primary"
          >
            EDIT
          </button>
        </div>
      ) : isActive ? (
        // Show active form
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm mb-2 text-gray-700">
              Email Address
            </label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                className={`flex-1 h-[40px] ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <button
                type="button"
                onClick={onContinue}
                className="btn-primary"
              >
                CONTINUE
              </button>
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="newsletter"
              {...register("newsletter")}
              className="w-4 h-4"
            />
            <label htmlFor="newsletter" className="text-base text-gray-700">
              Subscribe to our newsletter.
            </label>
          </div> */}

          <div className="text-base text-gray-700">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[var(--primary-color)]">
              Sign in now
            </Link>
          </div>

          <div className="text-base text-gray-600">Or continue with</div>

          {/* Apple Pay Button */}
 
          {/* Apple Pay Button */}
          <button
            type="button"
            onClick={() => onWalletClick("apple_pay")}
            className={`w-full h-[48px] bg-white border text-white rounded flex items-center justify-center transition ${!walletSupport.applePay ? "hidden" : ""}`}
          >
            <Image
              src="/checkouticon/Apple-icon.svg"
              alt="Apple Pay"
              className=""
              width={30}
              height={30}
            />
          </button>

          {/* Google Pay Button */}
     <button
            type="button"
            onClick={() => onWalletClick("google_pay")}
            className={`w-full h-[48px] bg-black text-white rounded flex items-center justify-center hover:bg-gray-900 transition ${!walletSupport.googlePay ? "hidden" : ""}`}
          >
            <Image
              src="/checkouticon/googlepay.png"
              alt="Google Pay"
              width={80}
              height={30}
            />
          </button>
          
        </div>
      ) : null}
    </>
  );
};

export default CustomerStep;