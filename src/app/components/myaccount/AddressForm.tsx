"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updatecustomer } from "@/redux/slices/myaccountSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";

interface AddressFormValues {
  address1?: string;
  address2?: string;
  suburb: string;
  country: string;
  state: string;
  postcode: string;
}

const AddressForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>();
  const { loading, error } = useAppSelector(
    (state: RootState) => state.myaccount,
  );
  const auth = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const poppinsFont = "Poppins, sans-serif";
  const onSubmit = async (data: AddressFormValues) => {
    try {
      // Only addresses in payload
      const mergedData = {
        addresses: [
          {
            addressLine1: data.address1 || "",
            addressLine2: data.address2 || "",
            city: data.suburb,
            state: data.state,
            zip: data.postcode,
            country: data.country,
          },
        ],
      };

      const result = await dispatch(
        updatecustomer({ id: auth?.user?.id, data: mergedData }),
      );

      if (updatecustomer.fulfilled.match(result)) {
        reset();
      } else {
        const errorMessage =
          result.error?.message || "Update address failed. Please try again.";
        console.error("Update address failed:", errorMessage);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const inputClass =
    "!w-full h-[38px] md:h-[36px] !max-w-full border border-[#ebebeb] !font-normal !text-[12px]";

  return (
    <div className="max-w-4xl mx-auto">
      {/* <h2 className="text-2xl font-semibold mb-6 text-center">New Address</h2> */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Address Line 1 & Address Line 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* <Label htmlFor="address1">Address Line 1 <span className="text-red-600">*</span></Label> */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <Label
                htmlFor="address1"
                className="text-[12px] text-[#333333] !font-normal leading-none"
                style={{ fontFamily: poppinsFont }}
              >
                Address Line 1
              </Label>

              <span className="text-[10px] text-[#333333] !font-normal uppercase shrink-0">
                REQUIRED
              </span>
            </div>
            <Input
              id="address1"
              {...register("address1", {
                required: "Address Line 1 is required",
              })}
              className={inputClass}
            />
            {errors.address1 && (
              <p className="text-sm text-red-500">{errors.address1.message}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor="address2"
              className="text-[12px] text-[#333333] !font-normal leading-none"
            >
              Address Line 2
            </Label>
            <Input
              id="address2"
              {...register("address2")}
              className={inputClass}
            />
          </div>
        </div>

        {/* Row 2: Suburb/City & Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* <Label htmlFor="suburb">Suburb / City <span className="text-red-600">*</span></Label> */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <Label
                htmlFor="suburb"
                className="text-[12px] text-[#333333] !font-normal leading-none"
                style={{ fontFamily: poppinsFont }}
              >
                Suburb / City
              </Label>

              <span className="text-[10px] text-[#333333] !font-normal uppercase shrink-0">
                REQUIRED
              </span>
            </div>
            <Input
              id="suburb"
              {...register("suburb", { required: "Suburb/City is required" })}
              className={inputClass}
            />
            {errors.suburb && (
              <p className="text-sm text-red-500">{errors.suburb.message}</p>
            )}
          </div>
          <div>
            {/* <Label htmlFor="country">Country <span className="text-red-600">*</span></Label> */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <Label
                htmlFor="country"
                className="text-[12px] text-[#333333] !font-normal leading-none"
                style={{ fontFamily: poppinsFont }}
              >
                Country
              </Label>

              <span className="text-[10px] text-[#333333] !font-normal uppercase shrink-0">
                REQUIRED
              </span>
            </div>
            <select
              id="country"
              {...register("country", { required: "Country is required" })}
              className={`${inputClass} border border-gray-300 rounded`}
            >
              <option value="">Select Country</option>
              <option value="Pakistan">Pakistan</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>
        </div>

        {/* Row 3: State/Province & Zip/Postcode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* <Label htmlFor="state">State / Province <span className="text-red-600">*</span></Label> */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <Label
                htmlFor="state"
                className="text-[12px] text-[#333333] !font-normal leading-none"
                style={{ fontFamily: poppinsFont }}
              >
                State / Province
              </Label>

              <span className="text-[10px] text-[#333333] !font-normal uppercase shrink-0">
                REQUIRED
              </span>
            </div>
            <Input
              id="state"
              {...register("state", {
                required: "State/Province is required",
              })}
              className={inputClass}
            />
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>
          <div>
            {/* <Label htmlFor="postcode">Zip / Postcode <span className="text-red-600">*</span></Label> */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <Label
                htmlFor="postcode"
                className="text-[12px] text-[#333333] !font-normal leading-none"
                style={{ fontFamily: poppinsFont }}
              >
                Zip / Postcode
              </Label>

              <span className="text-[10px] text-[#333333] !font-normal uppercase shrink-0">
                REQUIRED
              </span>
            </div>
            <Input
              id="postcode"
              {...register("postcode", {
                required: "Zip/Postcode is required",
              })}
              className={inputClass}
            />
            {errors.postcode && (
              <p className="text-sm text-red-500">{errors.postcode.message}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row md:justify-end gap-4 mt-4">
          <Button
            type="submit"
            className="w-full py-7 md:w-[130px] md:py-[17px]  bg-[#FF482E] rounded-sm hover:bg-[#FF482E] text-white font-normal"
          >
            {loading ? "Saving..." : "Save Address"}
          </Button>
          <Button
            onClick={() => router.back()}
            type="button"
            className="w-full py-7 md:w-[100px] md:py-5 bg-white text-black border border-[#ebebeb] rounded-sm font-normal hover:border-[#FF482E] hover:bg-white "
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
