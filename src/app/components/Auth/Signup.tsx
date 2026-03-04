"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import countries from "world-countries";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { registerUser } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  password_confirmation: string;
  companyName: string;
  addressLine1: string;
  addressLine2?: string;
  suburb: string;
  country: string;
  state: string;
  zip: string;
}

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 mb-1">
      <Label
        htmlFor={htmlFor}
        className="text-[14px] text-[#333333] font-normal leading-none"
      >
        {children}
      </Label>
      {required && (
        <span className="text-[10px] text-[#333333] uppercase shrink-0">
          REQUIRED
        </span>
      )}
    </div>
  );
}

const SignupPage = () => {
  const countryList = countries
    .map((country) => ({
      name: country.name.common,
      code: country.cca2,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SignupFormValues>();
  const dispatch = useAppDispatch();
  const { registerLoading } = useAppSelector((state: RootState) => state?.auth);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const result = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(result)) {
        reset();
        toast.success("Account created successfully!");
        router.push("/auth/login");
      } else {
        const errorMessage =
          (result.payload as string) || "Registration failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  const password = watch("password");

  const inputClass =
    "w-full h-[42px] max-w-full bg-white border border-gray-300 rounded text-gray-800 text-[14px] focus:ring-2 focus:ring-[#FD5430] focus:border-[#FD5430]";
  const rowClass = "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6";

  return (
    <section className="min-h-screen w-full py-8">
       <div className="mb-6 text-sm md:text-base">
          <Link href="/" className="hover:text-[#F15939] transition-colors mx-1 text-[#333333] text-[13px]">
            Home
          </Link>{" "}
          / <span className="mx-1 text-[#333333] text-[13px]">Create Accont</span>
        </div>
      <div className="max-w-full mx-auto w-full">

        <h1 className="text-2xl sm:text-4xl text-gray-800 my-8">
          New Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          {/* Row 1: Email | Password */}
          <div className={rowClass}>
            <div>
              <FieldLabel htmlFor="email" required>
                Email Address
              </FieldLabel>
              <Input
                id="email"
                type="email"
                className={inputClass}
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 mt-0.5">Required</p>
              )}
            </div>
            <div className="relative">
              <FieldLabel htmlFor="password" required>
                Password
              </FieldLabel>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`${inputClass} pr-10`}
                {...register("password", { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-2 top-13 text-gray-500 hover:text-gray-700"
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-[10px] text-red-500 mt-0.5">Required</p>
              )}
            </div>
          </div>

          {/* Row 2: Confirm Password | First Name */}
          <div className={rowClass}>
            <div className="relative">
              <FieldLabel htmlFor="confirmPassword" required>
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`${inputClass} pr-10`}
                {...register("password_confirmation", {
                  required: true,
                  validate: (v) => v === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-2 top-13 text-gray-500 hover:text-gray-700"
                aria-label="Toggle password"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
              {errors.password_confirmation && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  {errors.password_confirmation.message || "Required"}
                </p>
              )}
            </div>
            <div>
              <FieldLabel htmlFor="firstName" required>
                First Name
              </FieldLabel>
              <Input
                id="firstName"
                className={inputClass}
                {...register("firstName", { required: true })}
              />
              {errors.firstName && (
                <p className="text-[10px] text-red-500 mt-0.5">Required</p>
              )}
            </div>
          </div>

          {/* Row 3: Last Name | Company Name */}
          <div className={rowClass}>
            <div>
              <FieldLabel htmlFor="lastName" required>
                Last Name
              </FieldLabel>
              <Input
                id="lastName"
                className={inputClass}
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <p className="text-[10px] text-red-500 mt-0.5">Required</p>
              )}
            </div>
            <div>
              <FieldLabel htmlFor="company">Company Name</FieldLabel>
              <Input
                id="company"
                className={inputClass}
                {...register("companyName")}
              />
            </div>
          </div>

          {/* Row 4: Phone Number | Address Line 1 */}
          <div className={rowClass}>
            <div>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                type="tel"
                className={inputClass}
                {...register("phoneNumber")}
              />
            </div>
            <div>
              <FieldLabel htmlFor="address1" required>
                Address Line 1
              </FieldLabel>
              <Input
                id="address1"
                className={inputClass}
                {...register("addressLine1", { required: true })}
              />
              {errors.addressLine1 && (
                <p className="text-[10px] text-red-500 mt-0.5">Required</p>
              )}
            </div>
          </div>

          {/* Row 5: Address Line 2 | Suburb/City */}
          <div className={rowClass}>
            <div>
              <FieldLabel htmlFor="address2">Address Line 2</FieldLabel>
              <Input
                id="address2"
                className={inputClass}
                {...register("addressLine2")}
              />
            </div>
            <div>
              <FieldLabel htmlFor="city" required>
                Suburb/City
              </FieldLabel>
              <Input
                id="city"
                className={inputClass}
                {...register("suburb", { required: true })}
              />
              {errors.suburb && (
                <p className="text-[10px] text-red-500 mt-0.5">Required</p>
              )}
            </div>
          </div>

          {/* Row 6: Country | State */}
          <div className={rowClass}>
            <div>
              <FieldLabel htmlFor="country" required>
                Country
              </FieldLabel>
              <select
                id="country"
                className={`${inputClass} cursor-pointer`}
                {...register("country", { required: true })}
              >
                <option value="">Select Country</option>
                {countryList.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-[10px] text-red-500 mt-0.5">Required</p>
              )}
            </div>
            <div>
              <FieldLabel htmlFor="state" required>
                State/Province
              </FieldLabel>
              <Input
                id="state"
                className={inputClass}
                {...register("state", { required: true })}
              />
              {errors.state && (
                <p className="text-[10px] text-red-500 mt-0.5">Required</p>
              )}
            </div>
          </div>

          {/* Row 7: Zip (single field row) */}
          <div className="w-full sm:w-[49.3%]">
            <FieldLabel htmlFor="zip" required>
              Zip/Postcode
            </FieldLabel>
            <Input
              id="zip"
              className={inputClass}
              {...register("zip", { required: true })}
            />
            {errors.zip && (
              <p className="text-[10px] text-red-500 mt-0.5">Required</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
            <p className="text-[14px] text-gray-600 mb-0">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#FD5430] hover:underline">
                Sign in
              </Link>
            </p>
            {registerLoading ? (
              <div className="flex justify-center sm:justify-end w-full sm:w-[173px]">
                <div className="w-8 h-8 border-4 border-t-transparent border-[#FD5430] rounded-full animate-spin" />
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full md:w-[173px] bg-[#FD5430] hover:bg-[#e04a2a] text-white font-medium h-[42px] rounded text-[12px]"
              >
                Create Account
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignupPage;
