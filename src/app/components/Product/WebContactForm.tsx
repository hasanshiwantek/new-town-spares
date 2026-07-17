"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { contactRequests } from "@/redux/slices/contactSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { sitekey } from "@/lib/axiosInstance";
import { toast } from "react-toastify";
type WebContactFormData = {
    full_name: string;
    phone_number: string;
    email: string;
    order_number?: string;
    company_name?: string;
    rma_number?: string;
    comments: string;
};

const FORM_FIELDS = [
    { id: "full_name", label: "Full Name", type: "text", required: false },
    { id: "phone_number", label: "Phone Number", type: "tel", required: false },
    { id: "email", label: "Email Address", type: "email", required: true },
    { id: "order_number", label: "Order Number", type: "text", required: false },
    { id: "company_name", label: "Company Name", type: "text", required: false },
    { id: "rma_number", label: "RMA Number", type: "text", required: false },
];

const WebContactForm = ({ showTheseFields }: { showTheseFields: string[] }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<WebContactFormData>();
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const dispatch = useAppDispatch()
    const { loading } = useAppSelector((state: any) => state.contact);

    const showField = (id: string) => showTheseFields?.includes(id);

    const onSubmit = (data: WebContactFormData) => {
        if (!captchaToken && showField("spamProtection")) {
            toast("Please verify the captcha.");
            return;
        }
        dispatch(contactRequests(data)).unwrap().then(() => {
            reset();
        })
    };


    // Filter visible input fields (excluding comments & spamProtection)
    const visibleFields = FORM_FIELDS.filter((f) => showField(f.id));

    // Pair them into rows of 2
    const rows: (typeof FORM_FIELDS)[] = [];
    for (let i = 0; i < visibleFields.length; i += 2) {
        rows.push(visibleFields.slice(i, i + 2));
    }

    return (
        <div className="w-full  max-w-full lg:max-w-[1170px]  mx-0 lg:mx-auto my-8  lg:px-[0%] px-[7%] ">
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Dynamic Input Fields - Paired in rows of 2 */}
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {row.map((field) => (
                            <div key={field.id}>
                                <label
                                    htmlFor={field.id}
                                    className={`mb-2 text-[14px] font-normal text-[#545454] ${field.required
                                        ? "flex items-baseline justify-between gap-2"
                                        : "block"
                                        }`}
                                >
                                    <span>{field.label}</span>
                                    {field.required && (
                                        <span className="shrink-0 text-[#545454]" aria-hidden="true">
                                            *
                                        </span>
                                    )}
                                </label>
                                <Input
                                    type={field.type}
                                    id={field.id}
                                    {...register(field.id as keyof WebContactFormData, {
                                        ...(field.id === "email" && {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address",
                                            },
                                        }),
                                    })}
                                    className="mt-1 block w-full max-w-full h-[40px] px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-red-500 focus:border-red-500"
                                />
                                {field.id === "email" && errors.email && (
                                    <div
                                        className="mt-1 text-red-600"
                                        role="alert"
                                        aria-label={String(errors.email.message)}
                                    >
                                        <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}

                {/* Comments/Questions */}
                {showField("comments") && (
                    <div>
                        <label
                            htmlFor="comments"
                            className="mb-2 flex items-baseline justify-between gap-2 text-[14px] font-normal text-[#545454]"
                        >
                            <span>Comments/Questions</span>
                            <span className="shrink-0 text-[#545454]" aria-hidden="true">
                                *
                            </span>
                        </label>
                        <Textarea
                            id="comments"
                            {...register("comments", {
                                required: "Message is required",
                            })}
                            rows={6}
                            className="mt-1 block  max-w-full h-50 px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-red-500 focus:border-red-500 resize-none"
                        />
                        {errors.comments && (
                            <div
                                className="mt-1 text-red-600"
                                role="alert"
                                aria-label={String(errors.comments.message)}
                            >
                                <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                            </div>
                        )}
                    </div>
                )}

                {/* Spam Protection */}
                {showField("spamProtection") && (
                    <div>
                        <ReCAPTCHA
                            sitekey={sitekey}
                            onChange={(token: any) => {
                                setCaptchaToken(token);
                            }}
                        />
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                    <button disabled={loading} type="submit" className="btn-primary">
                        {loading ? "LOADING..." : "SUBMIT FORM"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WebContactForm;