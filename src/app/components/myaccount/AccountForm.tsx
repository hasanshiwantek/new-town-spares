"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { postAccountDetails } from "@/redux/slices/myaccountSlice";
import { RootState } from "@/redux/store";
import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
  const { loading, error } = useAppSelector(
    (state: RootState) => state?.myaccount,
  );
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

  const onSubmit = async (data: AccountFormValues) => {
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

  const inputClass =
    "!w-full !max-w-full h-[42px] !text-[14px] border-[#ebebeb] rounded-[4px] bg-white text-[#333333] px-[14px]";
  const labelClass =
    "flex items-center justify-between !text-[14px] !font-light !text-[#333333] mb-[7px]";
  const RequiredTag = () => (
    <span className="text-[10px] font-light uppercase tracking-[0.5px] text-[#333333]">
      Required
    </span>
  );

  return (
    <div className="max-w-[800px] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 min-[551px]:grid-cols-2 gap-x-[21px] gap-y-[28px]">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName" className={labelClass}>
              First Name <RequiredTag />
            </Label>
            <Input
              id="firstName"
              {...register("firstName", {
                required: "You must enter a first name.",
              })}
              className={inputClass}
            />
            {errors.firstName && (
              <span className="text-[14px] font-normal text-red-500 mt-1 flex items-center gap-2">
                <X size={14} />
                <p>{errors.firstName.message}</p>
              </span>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName" className={labelClass}>
              Last Name <RequiredTag />
            </Label>
            <Input
              id="lastName"
              {...register("lastName", {
                required: "You must enter a last name.",
              })}
              className={inputClass}
            />
            {errors.lastName && (
              <span className="text-[14px] font-normal text-red-500 mt-1 flex items-center gap-2">
                <X size={14} />
                <p>{errors.lastName.message}</p>
              </span>
            )}
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="companyName" className={labelClass}>
              Company
            </Label>
            <Input
              id="companyName"
              {...register("companyName")}
              className={inputClass}
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone" className={labelClass}>
              Phone Number
            </Label>
            <Input id="phone" {...register("phone")} className={inputClass} />
          </div>

          {/* Email Address */}
          <div>
            <Label htmlFor="email" className={labelClass}>
              Email Address <RequiredTag />
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className={inputClass}
              disabled
            />
            {errors.email && (
              <p className="text-[12px] text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Label htmlFor="password" className={labelClass}>
              Password
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[calc(28px+21px)] -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Label htmlFor="password_confirmation" className={labelClass}>
              Confirm Password
            </Label>
            <Input
              id="password_confirmation"
              type={showConfirmPassword ? "text" : "password"}
              {...register("password_confirmation", {
                validate: (value) =>
                  !password ||
                  value === password ||
                  "Your passwords do not match.",
              })}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[calc(28px+21px)] -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password_confirmation && (
              <span className="text-[14px] font-normal text-red-500 mt-1 flex items-center gap-2">
                <X size={14} />
                <p>{errors.password_confirmation.message}</p>
              </span>
            )}
          </div>

          {/* Current Password */}
          <div className="relative">
            <Label htmlFor="currentPassword" className={labelClass}>
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              {...register("currentPassword")}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-3 top-[calc(28px+21px)] -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-[28px]">
          <button
            type="submit"
            className="h-[39px] px-[32px] rounded-[4px] bg-[#FF482E] text-white text-[14px] font-light"
          >
            {loading ? "Loading..." : "Update Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
