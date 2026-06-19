"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ForgotPasswordValues {
  email: string;
}

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordValues>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const FontPoppins = "Poppins, sans-serif";

  const onSubmit = async (data: ForgotPasswordValues) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("user/forgot-password", {
        email: data.email,
      });
      const body = res?.data as {
        status?: boolean | string;
        message?: string;
      };
      const ok =
        body?.status === true ||
        body?.status === "true" ||
        String(body?.status).toLowerCase() === "true";
      if (ok) {
        setSuccessMessage(body.message || "Reset link sent to your email.");
        setSuccessOpen(true);
        reset();
      } else {
        toast.error(body?.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Unable to send reset email. Please try again later.";
      toast.error(typeof msg === "string" ? msg : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full mb-20" style={{ fontFamily: FontPoppins }}>
      {/* Breadcrumb */}
      <div className="hidden md:flex gap-2 items-center mb-7 text-sm">
        <Link
          href="/"
          className="hover:text-[#F15939] transition-colors text-[#333333] text-[13px] underline"
        >
          Home
        </Link>{"   "}
        /{" "}
        <span className="text-[#333333] text-[13px] ml-1">Forgot Password</span>
      </div>

      {/* Title */}
      <h1 className="text-[25px] !font-normal text-[#333333] mb-4 mt-3">
        Reset Password
      </h1>

      {/* Description */}
      <p className="text-[#333333] !font-normal text-[12px] mb-6 ">
        Fill in your email below to request a new password. An email will be
        sent to the address below containing a link to verify your email
        address.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label
          htmlFor="email"
          className="text-[#333333] !text-[13px] font-normal block mb-2"
        >
          Email Address
        </Label>

        {/* Inline input + button */}
        <div className="flex flex-col md:flex-row items-stretch max-w-[670px] w-full">
          <Input
            id="email"
            type="email"
            placeholder=""
            className=" max-w-full md:w-[460px] md:h-12 bg-white border border-gray-300 rounded-l-sm rounded-r-none px-3 focus:ring-2 focus:ring-[#FD5430] focus:border-[#FD5430] !ring-offset-0"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message:
                  "Please use a valid email address, such as user@example.com.",
              },
            })}
          />
          {loading ? (
            <div className="flex items-center justify-center w-full md:w-[160px] bg-[#FD5430] rounded-sm md:rounded-r-md">
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            </div>
          ) : (
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-[150px] bg-[#FF482E] hover:bg-[#e04a2a] text-white h-14 sm:h-12 rounded-sm md:rounded-l-none md:rounded-r-sm text-[14px] shrink-0"
            >
              {loading ? "Loading..." : "Reset Password"}
            </Button>
          )}
        </div>

        {/* Error message */}
        {errors.email && (
          <p className="text-[13px] text-[#FD5430] mt-2 flex items-center gap-1">
            <span>✕</span> {errors.email.message}
          </p>
        )}
      </form>
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent
          showCloseButton={true}
          className="max-w-[420px] border border-gray-200 bg-white sm:max-w-[440px]"
        >
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Email sent
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              {successMessage ||
                "Reset link sent to your email. Please check your inbox."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="btn-primary w-full sm:w-auto sm:min-w-[200px]"
              onClick={() => {
                setSuccessOpen(false);
                router.push("/auth/login");
              }}
            >
              GO TO LOGIN
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ForgotPasswordPage;
