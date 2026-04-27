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
  const { loginLoading } = useAppSelector((state: RootState) => state?.auth);
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
      <div className="flex flex-col md:flex-row w-full justify-between md:h-[400px] lg:h-[460px] gap-6 md:gap-0">

        {/* Left Image Section */}
        <div
          className={`relative w-full h-[260px] md:h-[400px] lg:h-[460px] ${isLoggedIn ? "md:w-full lg:w-full" : "md:w-[64%] lg:w-[74.8%]"
            }`}
        >
          <Image
            src="/server-img.svg"
            alt="Server Image"
            fill
            className="object-center"
            priority
          />
        </div>

        {/* Right Sign In Section */}
        {!isLoggedIn && (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-[35%] lg:w-[23.9%] h-[332px] md:h-[400px] lg:h-[460px] bg-[#EBEBEB] flex flex-col justify-center px-7">
            <h2 className="text-lg xl:text-[20px] text-[#333333] mb-5 text-center">
              Sign In
            </h2>

            <label className="text-sm xl:text-[14px] text-[#333333] mb-2">
              Email Address:
            </label>
            <input
              type="email"
              className="border border-gray-300 rounded px-3 py-3.5 mb-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", { required: "Email is required" })}
            />

            <label className="text-sm xl:text-[14px] text-[#333333] mb-2">
              Password:
            </label>
            <input
              type="password"
              className="border border-gray-300 rounded px-3 py-3.5 mb-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", { required: "Password is required" })}
            />

            <button disabled={loginLoading} type="submit" className="bg-[#FF482E] text-white py-3.5 rounded mb-4 hover:bg-orange-700 transition" >
              {loginLoading ? "Loading..." : "Sign In"}
            </button>

            <div className="flex justify-center gap-4 mt-4">
              <Link href="/auth/forgot-password" className="cursor-pointer text-sm xl:text-[14px] text-[#333333] underline">
                Forgot your password?
              </Link>
              <Link href="/auth/signup" className="cursor-pointer text-sm xl:text-[14px] text-[#333333] underline">
                Create Account
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Banner;
