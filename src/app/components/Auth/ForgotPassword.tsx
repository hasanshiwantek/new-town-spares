"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
    <section className="w-full mt-[9px] mb-[21px]">
      {/* Breadcrumb (live hides it below 551px) */}
      <div className="hidden min-[551px]:block mb-0 text-sm">
        <Link
          href="/"
          className="hover:text-[#F15939] transition-colors text-[#333333] text-[13px] underline"
        >
          Home
        </Link>
        <span className="mx-3 text-lg">/</span>
        <span className="text-[#333333] text-[13px] ml-1">Forgot Password</span>
      </div>

      {/* Title */}
      <h1 className="text-[25px] leading-[30px] tracking-[0.25px] font-normal text-[#333333] mt-[26.25px] mb-[26.25px]">
        Reset Password
      </h1>

      {/* Description */}
      <p className="text-[#333333] text-[14px] leading-[21px] mb-[21px]">
        Fill in your email below to request a new password. An email will be
        sent to the address below containing a link to verify your email
        address.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label
          htmlFor="email"
          className="text-[#333333] text-[14px] font-light block mb-[7px]"
        >
          Email Address
        </Label>

        {/* Inline input + button (live stacks them below 801px) */}
        <div className="flex flex-col min-[801px]:flex-row items-stretch w-full min-[801px]:w-1/2">
          <Input
            id="email"
            type="email"
            placeholder=""
            className="flex-1 max-w-none !text-[14px] h-[42px] bg-white border border-[#ebebeb] rounded-[4px] min-[801px]:rounded-r-none px-[14px] focus:ring-2 focus:ring-[#FF482E] focus:border-[#FF482E] !ring-offset-0"
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
            <div className="flex items-center justify-center w-full min-[801px]:w-[176px] h-[42px] bg-[#FF482E] rounded-[4px] min-[801px]:rounded-l-none min-[801px]:rounded-r-[4px] shrink-0">
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            </div>
          ) : (
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-8 min-[801px]:mt-0 min-[801px]:w-[176px] bg-[#FF482E] hover:bg-[#e04a2a] text-white font-light h-[42px] rounded-[4px] min-[801px]:rounded-l-none min-[801px]:rounded-r-[4px] text-[14px] shrink-0"
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
