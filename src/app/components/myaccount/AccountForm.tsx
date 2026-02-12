"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { postAccountDetails } from "@/redux/slices/myaccountSlice";

interface AccountFormValues {
  firstName: string;
  lastName: string;
  companyName?: string;
  phone?: string;
  email: string;
  password: string;
  password_confirmation: string;
  currentPassword?: string;
}

const AccountForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const auth = useAppSelector((state: RootState) => state?.auth);
  const {  loading, error } = useAppSelector((state: RootState) => state?.myaccount);
    const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AccountFormValues>({
  defaultValues: {
    email: auth?.user?.email || "",
  },
});

  const password = watch("password");

  const onSubmit =async (data: AccountFormValues) => {
    

    try {
       const result = await dispatch(postAccountDetails(data)); 
        if (postAccountDetails.fulfilled.match(result)) {
                reset();
              } else {
                const errorMessage =
                  result.error?.message || "update info failed. Please try again.";
                console.error("update info failed:", errorMessage);
              }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const inputClass = "!w-full h-[50px] !max-w-full";

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Account Form</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name <span className="text-red-600">*</span></Label>
            <Input
              id="firstName"
              {...register("firstName", { required: "First Name is required" })}
              className={inputClass}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name <span className="text-red-600">*</span></Label>
            <Input
              id="lastName"
              {...register("lastName", { required: "Last Name is required" })}
              className={inputClass}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Company & Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company</Label>
            <Input
              id="companyName"
              {...register("companyName")}
              className={inputClass}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register("phone")}
              className={inputClass}
            />
          </div>
        </div>

        {/* Email & Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address <span className="text-red-600">*</span></Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className={inputClass}
               disabled
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <Label htmlFor="password">Password <span className="text-red-600">*</span></Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-[65%] -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
        </div>

        {/* Confirm Password & Current Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="password_confirmation">Confirm Password <span className="text-red-600">*</span></Label>
            <Input
              id="password_confirmation"
              type={showConfirmPassword ? "text" : "password"}
              {...register("password_confirmation", {
                required: "Confirm password is required",
                validate: (value) => value === password || "Passwords do not match"
              })}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-3 top-[65%] -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>}
          </div>

          <div className="relative">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              {...register("currentPassword")}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(prev => !prev)}
              className="absolute right-3 top-[65%] -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full py-6 rounded-full bg-[#F15939] text-white text-lg font-semibold">
         {loading ? "Loading..." : "Update Account"}
        </Button>
      </form>
    </div>
  );
};

export default AccountForm;
