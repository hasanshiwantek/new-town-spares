"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import ReCAPTCHA from "react-google-recaptcha";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { bulkInquiry } from "@/redux/slices/homeSlice";
import { sitekey } from "@/lib/axiosInstance";
import { toast } from "react-toastify";
interface BulkInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    name: string;
    image?: string;
    sku?: string;
  };
}

const BulkInquiryModal: React.FC<BulkInquiryModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    quantity: "",
    comments: "",
  });
  const dispatch = useAppDispatch();
   const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
  setFormData({
    fullName: "",
    email: "",
    phone: "",
    quantity: "",
    comments: "",
  });

  setCaptchaToken(null);
  recaptchaRef.current?.reset();
}, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      // captcha check
    if (!captchaToken) {
      toast.error("Please verify the captcha.");
      return;
    }
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
      <DialogContent className="!max-w-[780px] w-full max-h-[90vh] overflow-y-auto p-0 rounded-[10px] shadow-none border-none outline-none">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Product Image */}
          <div className="md:w-1/2 bg-white p-[20px] flex flex-col justify-center">
            {product?.image ? (
              <Image
                src={product.image}
                alt={product.name || "Product"}
                width={350}
                height={350}
                className="w-full h-auto max-w-[350px] mx-auto object-contain"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 mx-auto my-[20px] flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            {product?.name && (
              <p className="text-[14px] leading-[21px] font-bold text-[#333333]">
                {product.name}
              </p>
            )}
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-[20px] bg-[#f7f7f7]">
            <DialogTitle className="text-[25px] leading-[30px] font-normal text-[#333333] mt-[32px] mb-[11px]">
              Request A Bulk Quote
            </DialogTitle>

            <form onSubmit={handleSubmit} className="space-y-[10px]">
              <Input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full !max-w-full h-[45px] px-[10px] py-0 border border-[#cccccc] bg-white rounded-[2px] !text-[17px] focus:outline-none focus:ring-2 focus:ring-[#F15939]"
              />

              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full !max-w-full h-[45px] px-[10px] py-0 border border-[#cccccc] bg-white rounded-[2px] !text-[17px] focus:outline-none focus:ring-2 focus:ring-[#F15939]"
              />

              <Input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full !max-w-full h-[45px] px-[10px] py-0 border border-[#cccccc] bg-white rounded-[2px] !text-[17px] focus:outline-none focus:ring-2 focus:ring-[#F15939]"
              />

              <Input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min={1}
                className="w-full !max-w-full h-[45px] px-[10px] py-0 border border-[#cccccc] bg-white rounded-[2px] !text-[17px] focus:outline-none focus:ring-2 focus:ring-[#F15939]"
              />


              <Textarea
                name="comments"
                placeholder="Comments"
                value={formData.comments}
                onChange={handleChange}
                rows={2}
                className="w-full !min-h-0 h-[50px] px-[10px] py-[6px] border border-[#cccccc] bg-white rounded-[2px] !text-[17px] focus:outline-none focus:ring-2 focus:ring-[#F15939] resize-none"
              />

             {/* ✅ ReCAPTCHA */}
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={sitekey}
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
              <Button
                type="submit"
                className="w-full h-[39px] bg-[#FF482E] !text-[14px] font-light text-white rounded-[4px] hover:bg-[#d94d30] transition-colors duration-200 !mt-[30px]"
              >
                Submit Form
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkInquiryModal;







