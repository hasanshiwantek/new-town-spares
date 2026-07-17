"use client";

import React from "react";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { useForm } from "react-hook-form";
import { loginUser } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import Link from "next/link";

interface SigninFormValues {
  email: string;
  password: string;
}

const Banner = () => {
  const auth = useAppSelector((state: RootState) => state?.auth);
  const isLoggedIn = Boolean(auth?.isAuthenticated);
  const dispatch = useAppDispatch();
  const { loginloading } = useAppSelector((state: RootState) => state?.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninFormValues>();

  const onSubmit = async (data: SigninFormValues) => {
    try {
      const result = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(result)) {
        reset();
      } else {
        const errorMessage =
          typeof result?.payload === "string"
            ? result.payload
            : "Login failed. Please try again.";
        toast.error(errorMessage);
        console.error("❌ Login rejected with message:", errorMessage);
      }
    } catch (err: unknown) {
      console.error("🚨 Unexpected error during onSubmit:", err);
    }
  };
  return (
    <div className="w-full flex justify-center items-centenr">
      <div className="flex flex-col min-[801px]:flex-row w-full justify-between min-[801px]:h-[417px] gap-6 min-[801px]:gap-0">

        {/* Left Image Section */}
        <div
          className={`relative w-full aspect-[2/1] min-[801px]:aspect-auto min-[801px]:h-[417px] ${isLoggedIn ? "min-[801px]:w-full" : "min-[801px]:w-[63.7%] min-[1025px]:w-[74.6%]"
            }`}
        >
          <Image
            src="/server-img.svg"
            alt="Server Image"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Sign In Section */}
        {!isLoggedIn && (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full min-[801px]:w-[34.1%] min-[1025px]:w-[23.7%] h-auto py-[30px] min-[801px]:py-0 min-[801px]:h-[417px] bg-[#EBEBEB] flex flex-col justify-center px-[21px]">
            <h2 className="text-[20px] leading-[24px] text-[#333333] mb-[11px] text-center">
              Sign in
            </h2>

            <label className="text-[14px] font-light leading-[21px] text-[#333333] mb-[7px]">
              Email Address:
            </label>
            <input
              type="email"
              className="bg-white border border-gray-300 rounded h-[42px] px-[14px] mb-[21px] focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
              {...register("email", { required: "Email is required" })}
            />

            <label className="text-[14px] font-light leading-[21px] text-[#333333] mb-[7px]">
              Password:
            </label>
            <input
              type="password"
              className="bg-white border border-gray-300 rounded h-[42px] px-[14px] mb-[21px] focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
              {...register("password", { required: "Password is required" })}
            />

            <div className="flex flex-col min-[551px]:flex-row-reverse min-[551px]:items-center min-[551px]:justify-between min-[801px]:flex-col gap-[21px] min-[801px]:gap-0">
              <button disabled={loginloading} type="submit" className="bg-[#FF482E] text-white text-[14px] font-light h-[39px] rounded min-[551px]:w-[230px] min-[801px]:w-full min-[801px]:mb-[21px] hover:bg-orange-700 transition" >
                {loginloading ? "Loading..." : "Sign in"}
              </button>

              <div className="flex flex-row gap-5 min-[801px]:flex-col min-[801px]:items-center min-[801px]:gap-0 min-[801px]:justify-center">
                <Link href="/auth/forgot-password" className="cursor-pointer text-[14px] leading-[21px] text-[#333333] underline">
                  Forgot your password?
                </Link>
                <Link href="/auth/signup" className="cursor-pointer text-[14px] leading-[21px] text-[#333333] underline">
                  Create Account
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Banner;
