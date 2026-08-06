"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronDown } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { sitekey } from "@/lib/axiosInstance";
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
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { addReview } from "@/redux/slices/homeSlice";
import { toast } from "react-toastify";
import { RootState } from "@/redux/store";
interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    name: string;
    image?: string;
    sku?: string;
    id?: string | number;
  };
}

type FormData = {
  name: string;
  email: string;
  subject: string;
  comment: string;
  rating: number | string;
};

type FormErrors = Partial<
  Record<"rating" | "email" | "subject" | "comment", string>
>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (data: FormData): FormErrors => {
  const errors: FormErrors = {};
  if (!data.rating) {
    errors.rating = "The 'Rating' field cannot be blank.";
  }
  if (!EMAIL_REGEX.test(String(data.email).trim())) {
    errors.email =
      "Please use a valid email address, such as user@example.com.";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    comment: "",
    rating: 0,
  });
  const dispatch = useAppDispatch();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const auth = useAppSelector((state: RootState) => state?.auth);
  console.log(auth, "ya auth hy");
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please verify the captcha.");
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
      name: auth?.user
        ? `${auth.user.firstName ?? ""} ${auth.user.lastName ?? ""}`.trim()
        : "",
      email: auth?.user?.email || "",
      subject: "",
      comment: "",
      rating: 0,
    });
    setCaptchaToken(null);
    recaptchaRef.current?.reset();
  }, [isOpen]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-[900px] w-[92vw] max-h-[90vh] p-0 gap-0 rounded-none! border-0 flex flex-col overflow-hidden"
      >
        <div className="shrink-0 flex items-center justify-between px-[32px] py-[14px] border-b-[0.667px] border-[#ebebeb] bg-white">
          <DialogTitle className="text-[25px] leading-[30px] font-normal text-[#333333]">
            Write a Review
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-[#1a1a1a] hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <X className="w-[22px] h-[22px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-[31.5px]">
          <div className="flex flex-col md:flex-row md:-mx-[10.5px]">
            <div className="md:w-1/2 md:px-[10.5px]">
              {product?.image ? (
                <div className="relative w-full aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name || "Product"}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              {product?.name && (
                <p className="mt-[11px] text-[15px] leading-[18px] text-[#333333]">
                  {product.name}
                </p>
              )}
            </div>

            <div className="md:w-1/2 md:px-[10.5px] mt-[28px] md:mt-0">
              <form onSubmit={handleSubmit}>
                <div className="mb-[28px]">
                  <label
                    htmlFor="rating"
                    className="flex items-baseline justify-between mb-[5px]"
                  >
                    <span className="text-[14px] leading-[21px] font-light text-[#333333]">
                      Rating
                    </span>
                    <span className="text-[10px] leading-[15px] font-light uppercase text-[#333333]">
                      Required
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      required
                      className="w-full h-[42px] pl-[14px] pr-[42px] border-[0.667px] border-[#ebebeb] bg-white !text-[14px] text-[#333333] rounded-[4px] appearance-none focus:outline-none focus:ring-1 focus:ring-[#ff482e]"
                    >
                      <option value="">Select Rating</option>
                      <option value="1">1 star (worst)</option>
                      <option value="2">2 stars</option>
                      <option value="3">3 stars (average)</option>
                      <option value="4">4 stars</option>
                      <option value="5">5 stars (best)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#333333]" />
                  </div>
                </div>

                <div className="mb-[28px]">
                  <label
                    htmlFor="name"
                    className="block text-[14px] leading-[21px] font-light text-[#333333] mb-[5px]"
                  >
                    Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="!h-[42px] !max-w-full px-[14px] py-[10.5px] border-[0.667px] border-[#ebebeb] bg-white rounded-[4px] !text-[14px] text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#ff482e]"
                  />
                </div>

                <div className="mb-[28px]">
                  <label
                    htmlFor="email"
                    className="flex items-baseline justify-between mb-[5px]"
                  >
                    <span className="text-[14px] leading-[21px] font-light text-[#333333]">
                      Email
                    </span>
                    <span className="text-[10px] leading-[15px] font-light uppercase text-[#333333]">
                      Required
                    </span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="!h-[42px] !max-w-full px-[14px] py-[10.5px] border-[0.667px] border-[#ebebeb] bg-white rounded-[4px] !text-[14px] text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#ff482e]"
                  />
                </div>

                <div className="mb-[28px]">
                  <label
                    htmlFor="subject"
                    className="flex items-baseline justify-between mb-[5px]"
                  >
                    <span className="text-[14px] leading-[21px] font-light text-[#333333]">
                      Review Subject
                    </span>
                    <span className="text-[10px] leading-[15px] font-light uppercase text-[#333333]">
                      Required
                    </span>
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    placeholder="Review Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="!h-[42px] !max-w-full px-[14px] py-[10.5px] border-[0.667px] border-[#ebebeb] bg-white rounded-[4px] !text-[14px] text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#ff482e]"
                  />
                </div>

                <div className="mb-[28px]">
                  <label
                    htmlFor="comment"
                    className="flex items-baseline justify-between mb-[5px]"
                  >
                    <span className="text-[14px] leading-[21px] font-light text-[#333333]">
                      Comments
                    </span>
                    <span className="text-[10px] leading-[15px] font-light uppercase text-[#333333]">
                      Required
                    </span>
                  </label>
                  <Textarea
                    name="comment"
                    placeholder="Comments"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={4}
                    className="w-full min-h-[50px] px-[14px] py-[10.5px] border-[0.667px] border-[#ebebeb] bg-white rounded-[4px] !text-[14px] text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#ff482e] resize-y"
                  />
                </div>

                <div className="mb-[28px]">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={sitekey}
                    onChange={(token) => setCaptchaToken(token)}
                    onExpired={() => setCaptchaToken(null)}
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-[#ff482e] hover:bg-[#e63e26] h-[39px] px-[32px] text-white !text-[14px] font-light rounded-[4px] transition-colors duration-200"
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewModal;
