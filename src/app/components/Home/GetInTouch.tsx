"use client";
import React from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { contactUs } from "@/redux/slices/homeSlice";
type GetInTouchFormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  partNumber?: string;
  requiredQty: number | string;
};

const errorSpaceClass = "min-h-[20px] mt-2 text-sm text-red-500";

const GetInTouch: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GetInTouchFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      company: "",
      partNumber: "",
      requiredQty: "",
    },
  });

  const dispatch = useAppDispatch();

  const onSubmit = async (values: GetInTouchFormValues) => {
    const result = await dispatch(contactUs(values));
    try {
      if (contactUs.fulfilled.match(result)) {
        console.log("Contact us response✅", result?.payload);
        setTimeout(() => {
          reset();
        }, 2000);
      } else {
        console.log("Error Sending Contact info: ", result?.payload);
      }
    } catch (err) {
      console.log("Something went wrong: ", err);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto py-16 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%] bg-[#FAFAFA]">
      <div className="flex flex-col lg:flex-row gap-10 bg-[#FAFAFA] rounded-lg overflow-hidden">
        <div className="w-full 2xl:w-[54.7%] relative">
          <div className="relative z-10">
            <h1 className="h1-lg mb-4">
              Let's Get In Touch{" "}
              <span className="!text-[#F15939]">with Us</span>
            </h1>
            <p className="h3-regular !text-[#666666] mb-8 max-w-3xl">
              Have questions about our products, need expert advice, or want a
              custom IT hardware solution?
            </p>

            <form
              className="space-y-8"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label htmlFor="fullName" className="block h5-regular">
                  Full Name <span className="text-[#F15939]">*</span>
                </label>
                <Input
                  id="fullName"
                  className={`mt-3 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                />
                <p className={errorSpaceClass}>{errors.fullName?.message}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block h5-regular">
                    Email <span className="text-[#F15939]">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    className={`mt-3 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <p className={errorSpaceClass}>{errors.email?.message}</p>
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block h5-regular">
                    Phone Number
                  </label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="phoneNumber"
                        inputMode="numeric"
                        value={field.value}
                        onChange={(event) => {
                          const numericValue = event.target.value.replace(
                            /\D/g,
                            ""
                          );
                          field.onChange(numericValue);
                        }}
                        className="mt-3 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      />
                    )}
                  />
                  <p className="min-h-[20px] mt-2 text-sm text-transparent">
                    placeholder
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="company" className="block h5-regular">
                    Company <span className="text-[#F15939]">*</span>
                  </label>
                  <Input
                    id="company"
                    className={`mt-3 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                      errors.company ? "border-red-500" : ""
                    }`}
                    {...register("company", {
                      required: "Company name is required",
                    })}
                  />
                  <p className={errorSpaceClass}>{errors.company?.message}</p>
                </div>
                <div>
                  <label htmlFor="partNumber" className="block h5-regular">
                    Part number
                  </label>
                  <Input
                    id="partNumber"
                    className="mt-3 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    {...register("partNumber")}
                  />
                  <p className="min-h-[20px] mt-2 text-sm text-transparent">
                    placeholder
                  </p>
                </div>
                <div>
                  <label htmlFor="requiredQty" className="block h5-regular">
                    Required QTY <span className="text-[#F15939]">*</span>
                  </label>
                  <Input
                    id="requiredQty"
                    type="number"
                    min={1}
                    className={`mt-3 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                      errors.requiredQty ? "border-red-500" : ""
                    }`}
                    {...register("requiredQty", {
                      required: "Required quantity is required",
                      min: {
                        value: 1,
                        message: "Quantity must be at least 1",
                      },
                    })}
                  />
                  <p className={errorSpaceClass}>
                    {errors.requiredQty?.message}
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full lg:w-64 xl:w-[21.6%] px-6 py-5 rounded-full h4-medium !text-white bg-[#F15939] border border-transparent hover:!border-[#F15939] hover:!bg-white hover:!text-[#F15939] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden md:block w-full 2xl:w-[43.9%] h-[380px] sm:h-[520px] md:h-[550px] lg:h-[555px] relative min-h-[380px]">
          <Image
            src="/form-image.png"
            alt="Customer support representative with headset smiling"
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;
