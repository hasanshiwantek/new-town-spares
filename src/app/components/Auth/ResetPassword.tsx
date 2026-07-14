"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ResetPasswordValues {
    password: string;
    password_confirmation: string;
}

const ResetPassword = () => {
       const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ResetPasswordValues>();

  
    const [loading, setLoading] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const passwordValue = watch("password");

    const onSubmit = async (data: ResetPasswordValues) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post("user/reset-password", {
                email: email ,
                password: data.password,
                token:token,
                password_confirmation: data.password_confirmation,
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
                setSuccessMessage(body.message || "Password reset successfully.");
                router.push("/auth/login")
                reset();
            } else {
                toast.error(body?.message || "Something went wrong. Please try again.");
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                "Unable to reset password. Please try again later.";
            toast.error(typeof msg === "string" ? msg : "Request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full mb-20">
            {/* Breadcrumb */}
            <div className="mb-7 text-sm">
                <Link
                    href="/"
                    className="hover:text-[#F15939] transition-colors text-[#333333] text-[13px] underline"
                >
                    Home
                </Link>{" "}
                /{" "}
                <span className="text-[#333333] text-[13px] ml-1">
                    Reset Password
                </span>
            </div>

            {/* Title */}
            <h1 className="text-[28px] font-normal text-[#333333] mb-4">
                Change Password
            </h1>

            {/* Description */}
            <p className="text-[#333333] text-[14px] mb-8">
                Passwords must be at least 7 characters and contain both alphabetic and numeric characters.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full ">

                {/* New Password Field */}
                <div className="mb-6 ">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[#333333] text-[14px] font-normal">
                            New Password
                        </label>
                        <span className="text-[#999999] text-[12px] uppercase tracking-wide">
                            REQUIRED
                        </span>
                    </div>
                    <input
                        id="password"
                        type="password"
                        placeholder=""
                        className={`w-full h-[50px] bg-white border rounded-sm px-3 focus:ring-2 focus:ring-[#FD5430] focus:border-[#FD5430] !ring-offset-0 ${
                            errors.password
                                ? "border-[#FD5430] border-2"
                                : "border-gray-300"
                        }`}
                        {...register("password", {
                            required: "You must enter a password.",
                            minLength: {
                                value: 7,
                                message: "Password must be at least 7 characters.",
                            },
                            pattern: {
                                value: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
                                message: "Password must contain both alphabetic and numeric characters.",
                            },
                        })}
                    />
                    {errors.password && (
                        <p className="text-[13px] text-[#FD5430] mt-1 flex items-center gap-1">
                            <span>✕</span> {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[#333333] text-[14px] font-normal">
                            Confirm Password
                        </label>
                        <span className="text-[#999999] text-[12px] uppercase tracking-wide">
                            REQUIRED
                        </span>
                    </div>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder=""
                        className={`w-full h-[50px] bg-white border rounded-sm px-3 focus:ring-2 focus:ring-[#FD5430] focus:border-[#FD5430] !ring-offset-0 ${
                            errors.password_confirmation
                                ? "border-[#FD5430] border-2"
                                : "border-gray-300"
                        }`}
                        {...register("password_confirmation", {
                            required: "You must confirm your password.",
                            validate: (value) =>
                                value === passwordValue || "Passwords do not match.",
                        })}
                    />
                    {errors.password_confirmation && (
                        <p className="text-[13px] text-[#FD5430] mt-1 flex items-center gap-1">
                            <span>✕</span> {errors.password_confirmation.message}
                        </p>
                    )}
                </div>

                {/* Continue Button — bottom right */}
                <div className="flex justify-end">
                    {loading ? (
                        <div className="flex items-center justify-center w-[140px] h-[46px] bg-[#FD5430] rounded-md">
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        </div>
                    ) : (
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-[140px] h-[46px] bg-[#FD5430] hover:bg-[#e04a2a] text-white font-medium rounded-md text-[14px]"
                        >
                            Continue
                        </Button>
                    )}
                </div>
            </form>

            {/* Success Dialog */}
            <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
                <DialogContent
                    showCloseButton={true}
                    className="max-w-[420px] border border-gray-200 bg-white sm:max-w-[440px]"
                >
                    <DialogHeader className="text-center sm:text-center">
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                            Password Updated
                        </DialogTitle>
                        <DialogDescription className="text-base text-gray-600">
                            {successMessage || "Your password has been reset successfully."}
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

export default ResetPassword;