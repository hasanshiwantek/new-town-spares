"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { bulkInquiry } from "@/redux/slices/homeSlice";
import { Label } from "@/components/ui/label";
interface AddReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: {
        name: string;
        image?: string;
        sku?: string;
    };
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
    isOpen,
    onClose,
    product,
}) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        reviewSubject: "",
        comments: "",
    });
    const dispatch = useAppDispatch();
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            sku: product?.sku ?? "",
            ...formData,
        };
        const result = await dispatch(bulkInquiry(payload))
        try {
            if (bulkInquiry.fulfilled.match(result)) {
                console.log("Request for quote send✅", result?.payload);
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                console.log("Error Sending Quote: ", result?.payload);
            }
        } catch (err) {
            console.log("Something went wrong: ", err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[70rem] w-full max-h-[90vh] overflow-y-auto p-0 rounded-lg shadow-sm">
                {/* <DialogTitle className="text-3xl font-semibold text-gray-800 mt-2.5 ml-2.5">
                    Write a Review
                </DialogTitle> */
                }
                {/* ✅ Sticky Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#ddd] bg-white">
                    <DialogTitle className="text-[22px] font-normal text-[#333333]">
                        Write a Review
                    </DialogTitle>
                    <button
                        onClick={onClose}
                        className="text-[#333333] hover:text-black transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex flex-col md:flex-row">
                    {/* Left Side - Product Image */}
                    <div className="md:w-3/5 bg-white p-5 flex flex-col items-center justify-center">
                        {product?.image ? (
                            <Image
                                src={product.image}
                                alt={product.name || "Product"}
                                width={300}
                                height={300}
                                className="object-contain"
                            />
                        ) : (
                            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                            </div>
                        )}
                        {product?.name && (
                            <p className="mt-4 text-base text-gray-700 text-center font-medium">
                                {product.name}
                            </p>
                        )}
                    </div>

                    {/* Right Side - Form */}
                    <div className="md:w-3/5 p-5 ">


                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Rating */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <Label
                                        htmlFor="email"
                                        className="text-[#999] text-[14px] font-medium block mb-2"
                                    >Rating:</Label>
                                    <span className="text-[11px] text-[#999] uppercase tracking-wider">Required</span>

                                </div>
                                <div className="relative">
                                    <select
                                        name="rating"
                                        // value={formData.rating}
                                        // onChange={handleChange}
                                        required
                                        className="w-full h-[46px] px-3 border border-[#ccc] bg-white text-[14px] text-[#333] rounded-md appearance-none focus:outline-none focus:border-[#F15939]"
                                    >
                                        <option value="">Select Rating</option>
                                        <option value="1">1 star (worst)</option>
                                        <option value="2">2 stars</option>
                                        <option value="3">3 stars (average)</option>
                                        <option value="4">4 stars</option>
                                        <option value="5">5 stars (best)</option>
                                    </select>
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#555] text-[12px]">▾</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">

                                    <Label
                                        htmlFor="fullName"
                                        className="text-[#999] text-[14px] font-medium block mb-2"
                                    >Name</Label>
                                </div>
                                <Input
                                    type="text"
                                    name="fullName"
                                    placeholder="Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-[46px] !max-w-full px-4 py-3 border border-gray-300 bg-white rounded-md  focus:outline-none focus:ring-2 focus:ring-[#F15939]"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">

                                    <Label
                                        htmlFor="email"
                                        className="text-[#999] text-[14px] font-medium block mb-2"
                                    >Email</Label>
                                    <span className="text-[11px] text-[#999] uppercase tracking-wider">Required</span>
                                </div>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-[46px] !max-w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F15939]"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">

                                    <Label
                                        htmlFor="reviewSubject"
                                        className="text-[#999] text-[14px] font-medium block mb-2"
                                    >Review Subject</Label>
                                    <span className="text-[11px] text-[#999] uppercase tracking-wider">Required</span>

                                </div>
                                <Input
                                    type="text"
                                    name="reviewSubject"
                                    placeholder="Review Subject"
                                    value={formData.reviewSubject}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-[46px] !max-w-full px-4 py-3 border border-gray-300 bg-white rounded-md  focus:outline-none focus:ring-2 focus:ring-[#F15939]"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <Label
                                        htmlFor="comments"
                                        className="text-[#999] text-[14px] font-medium block mb-2"
                                    >Comments</Label>
                                    <span className="text-[11px] text-[#999] uppercase tracking-wider">Required</span>
                                </div>
                                <Textarea
                                    name="comments"
                                    placeholder="Comments"
                                    value={formData.comments}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full h-[100px] px-4 py-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F15939] resize-none"
                                />
                            </div>
                            <Button
                                type="submit"
                                className=" bg-[#F15939] h-[40px] text-white !p-5 !text-lg rounded-md font-medium hover:bg-[#d94d30] transition-colors duration-200"
                            >
                                Submit Review
                            </Button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddReviewModal;
