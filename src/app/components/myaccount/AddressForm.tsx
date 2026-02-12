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
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddressFormValues>();
  const { loading, error } = useAppSelector((state: RootState) => state.myaccount);
  const auth = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
          }
        ]
      };

      const result = await dispatch(
        updatecustomer({ id: auth?.user?.id, data: mergedData })
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

  const inputClass = "!w-full h-[50px] !max-w-full";

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">New Address</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Address Line 1 & Address Line 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address1">Address Line 1 <span className="text-red-600">*</span></Label>
            <Input
              id="address1"
              {...register("address1", { required: "Address Line 1 is required" })}
              className={inputClass}
            />
            {errors.address1 && <p className="text-sm text-red-500">{errors.address1.message}</p>}
          </div>
          <div>
            <Label htmlFor="address2">Address Line 2</Label>
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
            <Label htmlFor="suburb">Suburb / City <span className="text-red-600">*</span></Label>
            <Input
              id="suburb"
              {...register("suburb", { required: "Suburb/City is required" })}
              className={inputClass}
            />
            {errors.suburb && <p className="text-sm text-red-500">{errors.suburb.message}</p>}
          </div>
          <div>
            <Label htmlFor="country">Country <span className="text-red-600">*</span></Label>
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
            {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
          </div>
        </div>

        {/* Row 3: State/Province & Zip/Postcode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="state">State / Province <span className="text-red-600">*</span></Label>
            <Input
              id="state"
              {...register("state", { required: "State/Province is required" })}
              className={inputClass}
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
          </div>
          <div>
            <Label htmlFor="postcode">Zip / Postcode <span className="text-red-600">*</span></Label>
            <Input
              id="postcode"
              {...register("postcode", { required: "Zip/Postcode is required" })}
              className={inputClass}
            />
            {errors.postcode && <p className="text-sm text-red-500">{errors.postcode.message}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 mt-4">
          <Button type="submit" className="w-full py-6 rounded-full bg-[#F15939] text-white font-bold">
            {loading ? "Saving..." : "Save Address"}
          </Button>
          <Button 
            onClick={() => router.back()}
            type="button" 
            className="w-full py-6 rounded-full border border-[#F15939] text-[#F15939] font-bold hover:bg-[#F15939] hover:text-white transition"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
