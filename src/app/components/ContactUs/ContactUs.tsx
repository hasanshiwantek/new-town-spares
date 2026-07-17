"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { contactRequests } from "@/redux/slices/contactSlice";
import { Divide } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type ContactFormData = {
  full_name: string;
  phone_number: string;
  email: string;
  order_number?: string;
  company_name?: string;
  rma_number?: string;
  comments: string;
};

const AOSWrapper = dynamic(
  () => import("../../components/animation/AOSWrapper"),
);

// Live form tokens (measured on newtownspares.com/contact-us/).
// globals.css has an unlayered `input { font-size: 1.1rem }` rule that beats
// Tailwind utilities, so the font-size here has to be forced.
const labelClass =
  "block text-[14px] leading-[21px] font-light text-[#333333] mb-[7px]";
const requiredClass =
  "text-[10px] leading-[15px] font-light uppercase text-[#333333]";
const inputClass =
  "w-full h-[42px] px-[14px] py-[10.5px] border border-[#ebebeb] rounded-[4px] bg-white !text-[14px] text-[#333333] focus:outline-none focus:border-[#FF482E]";
const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: any) => state.contact);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);
  const onSubmit = (data: ContactFormData) => {
    // You can also log it in a more formatted way
    dispatch(contactRequests(data))
      .unwrap()
      .then(() => {
        reset();
         setShowSuccess(true);
      });
  };
  return (
    <div className="w-full">
      <div className="hidden min-[551px]:block mt-[9px] mb-[21px] text-[13px] leading-[19.5px] text-[#333333]">
        <Link href="/" className="underline">
          Home
        </Link>
        <span className="mx-[10.5px]">/</span>
        <span>Contact Us</span>
      </div>
      {
        !showSuccess ? (
      
       <div>

      <div className="max-w-[800px] mx-auto flow-root">
        <h1 className="text-3xl md:text-[28px] leading-[33.6px] text-[#333333] mt-[26.25px] mb-10 text-center">
          Contact Us
        </h1>
        <div className="mt-10 space-y-6">
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="text-[14px]">
              <span className="font-semibold text-[14px] block">
                Corporate Mailing Address:
              </span>
              1032 E BRANDON BLVD <br />
              Suite 1124 <br />
              BRANDON, FL 33511
            </p>

            <p className="text-[14px]">
              <span className="font-semibold text-[14px]">Email:</span>{" "}
              orders@newtownspares.com
              <br /> info@newtownspares.com
            </p>

            <p className="text-[14px]">
              <span className="font-semibold text-[14px]">PH:</span> <br />{" "}
              (209) 651-6864
            </p>
          </div>
        </div>

        {/* SMS Disclaimer */}
        <div className="mt-10 space-y-3">
          <h2 className="text-lg md:text-[10px] font-bold">SMS Disclaimer</h2>

          <div className="space-y-3 text-lg leading-relaxed">
            <p className="text-[10px] pr-2">
              By providing your phone number, you agree to receive SMS messages
              from New Town Spares regarding important updates, promotions, and
              offers. Message frequency may vary. Message and data rates may
              apply. Reply STOP to unsubscribe at any time. For help, reply HELP
              or contact us at (209) 651-6864 - info@newtownspares.com
            </p>
          </div>
        </div>

        {/* Support Message */}
        <div className="mt-10 space-y-4 text-lg leading-relaxed">
          <p className="text-[14px]">
            We're happy to answer questions or help you with returns.
          </p>
        </div>

        <div className="w-full py-8">
          <div className="max-w-6xl mx-auto">
            {/* Top Text */}
            <p className="text-[14px] leading-[21px] text-[#333333] mb-[21px]">
              Please fill out the form below if you need assistance.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 min-[551px]:grid-cols-2 gap-x-[21px] gap-y-[28px]">
                <div>
                  <label htmlFor="full_name" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    {...register("full_name")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className={labelClass}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    {...register("phone_number")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`${labelClass} flex justify-between items-baseline`}
                  >
                    Email Address
                    <small className={requiredClass}>Required</small>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="order_number" className={labelClass}>
                    Order Number
                  </label>
                  <input
                    type="text"
                    id="order_number"
                    {...register("order_number")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="company_name" className={labelClass}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    {...register("company_name")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="rma_number" className={labelClass}>
                    RMA Number
                  </label>
                  <input
                    type="text"
                    id="rma_number"
                    {...register("rma_number")}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Comments */}
              <div className="mt-[28px]">
                <label
                  htmlFor="comments"
                  className={`${labelClass} flex justify-between items-baseline`}
                >
                  Comments/Questions
                  <small className={requiredClass}>Required</small>
                </label>
                <textarea
                  id="comments"
                  {...register("comments", {
                    required: "Message is required",
                  })}
                  rows={5}
                  className="w-full px-[14px] py-[10.5px] border border-[#ebebeb] rounded-[4px] bg-white text-[14px]! leading-[21px] text-[#333333] focus:outline-none focus:border-[#FF482E]"
                ></textarea>
              </div>

              <div className="mt-[28px] min-[551px]:text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-[551px]:w-auto h-[39px] px-[32px] bg-[#FF482E] text-white text-[14px]! font-light rounded-[4px] hover:bg-[#e03d25] transition-colors disabled:opacity-70"
                >
                  {loading ? "Loading..." : "Submit Form"}
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      </div>
      ):(<div>
        <div className="w-full flex justify-center py-10">
  <div className="text-center">
    <h1 className="text-[35px] font-light text-[#3F3F3F] mb-8 roboto-only-font">
      Contact Us
    </h1>

    <p className="text-[14px] text-[#545454] roboto-font">
      We've received your feedback and will respond shortly if required.{" "}
      <Link
        href="/"
        className="underline hover:text-[#FF482E]"
      >
        Continue.
      </Link>
    </p>
  </div>
</div>
      </div>)}
    </div>
  );
};

export default ContactUs;
