"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { addReview } from "@/redux/slices/homeSlice";
import { toast } from "react-toastify";
interface AddReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: {
        name: string;
        image?: string;
        sku?: string;
        id?: string | number;
        brand?: string;
    };
}

type FormData = {
    name: string;
    email: string;
    subject: string;
    comment: string;
    rating: number | string;
};

type FormErrors = Partial<Record<"rating" | "email" | "subject" | "comment", string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (data: FormData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.rating) {
        errors.rating = "The 'Rating' field cannot be blank.";
    }
    if (!EMAIL_REGEX.test(String(data.email).trim())) {
        errors.email = "Please use a valid email address, such as user@example.com.";
    }
    if (!String(data.subject).trim()) {
        errors.subject = "The 'Review Subject' field cannot be blank.";
    }
    if (!String(data.comment).trim()) {
        errors.comment = "The 'Comments' field cannot be blank.";
    }
    return errors;
};

const AddReviewModal: React.FC<AddReviewModalProps> = ({
    isOpen,
    onClose,
    product,
}) => {
    const [loading, setLoading] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        subject: "",
        comment: "",
        rating: 0,
    });
    const dispatch = useAppDispatch();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const next = { ...formData, [e.target.name]: e.target.value };
        setFormData(next);
        if (hasSubmitted) {
            setErrors(validate(next));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setHasSubmitted(true);
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }
        setLoading(true);
        const payload = {
            productId: product?.id,
            ...formData,
        };
        const result = await dispatch(addReview(payload));
        try {
            if (addReview.fulfilled.match(result)) {
                onClose();
                toast.success("Review submitted successfully!");
            } else {
                console.log("Error Sending Quote: ", result?.payload);
            }
        } catch (err) {
            console.log("Something went wrong: ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFormData({
            name: "",
            email: "",
            subject: "",
            comment: "",
            rating: 0,
        });
        setErrors({});
        setHasSubmitted(false);
    }, [isOpen]);

    const baseField =
        "w-full h-[42px] !max-w-full px-[14px] py-[10.5px] border-[0.667px] bg-white !text-[14px] text-[#333333] rounded-[4px] focus:outline-none";
    const fieldBorder = (hasError?: boolean) =>
        hasError
            ? "border-[#CC4749] focus:border-[#CC4749]"
            : "border-[#ebebeb] focus:border-[#FF482E]";
    const labelClass = "text-[14px] font-light leading-[21px] text-[#333333]";
    const requiredClass =
        "text-[10px] font-light uppercase text-[#333333] mt-[5px]";

    const ErrorMessage = ({ message }: { message?: string }) =>
        message ? (
            <span className="mt-[5px] mb-[-7px] block text-[14px] font-normal leading-[24px] text-[#CC4749]">
                <span aria-hidden className="mr-[6px]">
                    &times;
                </span>
                {message}
            </span>
        ) : null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                showCloseButton={false}
                className="!w-[900px] !max-w-[95%] max-h-[77vh] overflow-y-auto p-0 gap-0 rounded-[6px] border-0 bg-[#FAFAFA] shadow-none rounded-none!"
            >
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-[31.5px] py-[14px] border-b border-[#ebebeb] bg-[#FAFAFA] rounded-t-[6px]">
                    <DialogTitle className="!text-[25px] !font-normal !leading-[30px] tracking-[0.25px] text-[#333333]">
                        Write a Review
                    </DialogTitle>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-[25px] leading-none text-[#1a1a1a] hover:text-black transition-colors -mt-1"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-col md:flex-row p-[31.5px]">
                    {/* Left Side - Product Image & Details */}
                    <div className="md:w-1/2 px-[10.5px] flex flex-col">
                        {product?.image ? (
                            <Image
                                src={product.image}
                                alt={product.name || "Product"}
                                width={389}
                                height={389}
                                className="w-full h-auto object-contain"
                            />
                        ) : (
                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                            </div>
                        )}
                        {product?.brand && (
                            <h6 className="mt-[14px] text-[13px] font-normal uppercase leading-[15.6px] tracking-[0.25px] text-[#959595]">
                                {product.brand}
                            </h6>
                        )}
                        {product?.name && (
                            <h5 className="mb-[11px] text-[15px] font-normal uppercase leading-[18px] tracking-[0.25px] text-[#333333]">
                                {product.name}
                            </h5>
                        )}
                    </div>

                    {/* Right Side - Form */}
                    <div className="md:w-1/2 px-[10.5px]">
                        <form onSubmit={handleSubmit} noValidate className="space-y-[28px]">
                            {/* Rating */}
                            <div>
                                <div className="flex items-start justify-between mb-[7px]">
                                    <label htmlFor="rating" className={labelClass}>
                                        Rating
                                    </label>
                                    <small className={requiredClass}>Required</small>
                                </div>
                                <div className="relative">
                                    <select
                                        id="rating"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        className={`${baseField} ${fieldBorder(!!errors.rating)} pr-[42px] appearance-none`}
                                    >
                                        <option value="">Select Rating</option>
                                        <option value="1">1 star (worst)</option>
                                        <option value="2">2 stars</option>
                                        <option value="3">3 stars (average)</option>
                                        <option value="4">4 stars</option>
                                        <option value="5">5 stars (best)</option>
                                    </select>
                                    <span className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-[#555] text-[12px]">
                                        &#9662;
                                    </span>
                                </div>
                                <ErrorMessage message={errors.rating} />
                            </div>

                            {/* Name */}
                            <div>
                                <div className="flex items-start justify-between mb-[7px]">
                                    <label htmlFor="name" className={labelClass}>
                                        Name
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`${baseField} ${fieldBorder(false)}`}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <div className="flex items-start justify-between mb-[7px]">
                                    <label htmlFor="email" className={labelClass}>
                                        Email
                                    </label>
                                    <small className={requiredClass}>Required</small>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`${baseField} ${fieldBorder(!!errors.email)}`}
                                />
                                <ErrorMessage message={errors.email} />
                            </div>

                            {/* Review Subject */}
                            <div>
                                <div className="flex items-start justify-between mb-[7px]">
                                    <label htmlFor="subject" className={labelClass}>
                                        Review Subject
                                    </label>
                                    <small className={requiredClass}>Required</small>
                                </div>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={`${baseField} ${fieldBorder(!!errors.subject)}`}
                                />
                                <ErrorMessage message={errors.subject} />
                            </div>

                            {/* Comments */}
                            <div>
                                <div className="flex items-start justify-between mb-[7px]">
                                    <label htmlFor="comment" className={labelClass}>
                                        Comments
                                    </label>
                                    <small className={requiredClass}>Required</small>
                                </div>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    rows={2}
                                    className={`w-full px-[14px] py-[10.5px] border-[0.667px] bg-white !text-[14px] leading-[21px] text-[#333333] rounded-[4px] focus:outline-none resize-y ${fieldBorder(!!errors.comment)}`}
                                />
                                <ErrorMessage message={errors.comment} />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mb-[14px] bg-[#FF482E] hover:bg-[#e63e26] text-white text-[14px] font-light rounded-[4px] px-[32px] py-[12px] transition-colors duration-200"
                            >
                                {loading ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddReviewModal;
