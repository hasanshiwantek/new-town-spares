"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import LoginForm from "./LoginForm";
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
  const auth = useAppSelector((state: RootState) => state?.auth);
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useAppDispatch();
  const isLoggedIn = Boolean(auth?.isAuthenticated);
  const handleSignOut = () => {
    dispatch(logout());
    window.location.reload()
  };
  useEffect(() => {
    if (auth?.isAuthenticated) {
      onContinue()
    }
  }, [auth?.isAuthenticated])
  return (
    <>
      {isCompleted && !isActive ? (
        // Show completed state with email and edit button
        <div className="flex items-start justify-between gap-4">
          <span className="text-[13px] leading-[19.5px] text-[#333333]">
            {emailValue}
          </span>
          {
            auth?.isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="text-[13px] text-[#333333] hover:text-[#FF482E] shrink-0"
              >
                SIGN OUT
              </button>
            ) : (
              <button
                type="button"
                onClick={onEdit}
                className="text-[13px] text-[#333333] hover:text-[#FF482E] shrink-0"
              >
                Edit
              </button>
            )
          }

        </div>
      ) : isActive ? (
        // Show active form
        <div className="space-y-4">
          {!showLogin ? (
            <>
              <div className="flex flex-col">

                <label
                  htmlFor="email"
                  className="text-[13px] font-medium mb-2 text-[#333333]"
                >
                  Email Address
                </label>
                <div className="flex gap-6">
                  <Input
                    id="email"
                    type="email"
                    className={`flex-1 h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.email ? "border-red-500" : ""
                      }`}
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={onContinue}
                    className="h-[45px] w-1/3 bg-[#FD5430] text-[13px] text-white rounded-sm px-[6.5px]"
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  {...register("newsletter")}
                  className="w-4 h-4 accent-[#FF482E]"
                />
                <label htmlFor="newsletter" className="text-[13px] text-[#333333]">
                  Subscribe to our newsletter.
                </label>
              </div>

              {!isLoggedIn && (
                <div className="text-[13px] text-[#333333]">
                  Already have an account?{" "}
                  {/* <Link
                href="/auth/login"
                className="hover:text-[var(--primary-color)]"
              >
                Sign in now
              </Link> */}
                  <button
                    type="button"
                    onClick={() => setShowLogin(true)}
                    className="text-[var(--primary-color)]  "

                  >
                    Sign in now
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full">
              <LoginForm onCancel={() => setShowLogin(false)} />
            </div>
          )
          }

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
