"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import countries from "world-countries";
import { Country, State, City } from "country-state-city";

import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { registerUser } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { baseURL, sitekey, storeId } from "@/lib/axiosInstance";
import { fetchCartList } from "@/redux/slices/cartSlice";
import { addCustomerAddress } from "@/redux/slices/myaccountSlice";

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
  useRole: 2;
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
    <div className="flex items-center justify-between gap-2 mb-[7px]">
      <Label
        htmlFor={htmlFor}
        className="text-[14px] text-[#333333] font-light leading-none"
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
const inputClass =
  "w-full h-[42px] !max-w-full !text-[14px] bg-white border border-[#ebebeb] rounded-[4px] px-[14px] text-[#333333] focus:ring-2 focus:ring-[#FF482E] focus:border-[#FF482E]";
const rowClass = "grid grid-cols-1 min-[551px]:grid-cols-2 gap-7 min-[551px]:gap-5";

const SignupPage = () => {
  const countryList = Country.getAllCountries().map((c) => ({
    name: c.name,
    code: c.isoCode,
  }));
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const password = watch("password");
  const watchedCountry = watch("country");
  const watchedState = watch("state");
  const dispatch = useAppDispatch();
  const { registerLoading } = useAppSelector((state: RootState) => state?.auth);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const stateList = useMemo(() => {
    if (!watchedCountry) return [];
    return State.getStatesOfCountry(watchedCountry).map((s) => ({
      name: s.name,
      code: s.isoCode,
    }));
  }, [watchedCountry]);
  const onSubmit = async (data: SignupFormValues) => {
    //   if (!captchaToken) {
    //   toast("Please verify the captcha.");
    //   return;
    // }
    try {
      const payload = {
        userRole: 2,
        ...data,
      };
      const result = await dispatch(registerUser(payload));
      if (registerUser.fulfilled.match(result)) {
        const token = result.payload.token;
        const sessionId = localStorage.getItem("sessionId");

        await fetch(`${baseURL}web/cart/transfer`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            storeId: storeId,
            "X-Session-ID": sessionId || "",
            "Content-Type": "application/json",
          },
        });
        const {
          email,
          userRole,
          password,
          password_confirmation,
          suburb,
          ...body
        } = payload;

        const addressPayload = {
          ...body,
          city: suburb,
        };
        dispatch(
          addCustomerAddress({
            id: result?.payload?.user?.id,
            data: addressPayload,
          }),
        );

        await dispatch(fetchCartList());

        reset();
        toast.success("Account created successfully!");
        router.push("/action");
      }
      else {
        const errorMessage =
          (result.payload as string) || "Registration failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch("/api/detect-country"); // apna Next.js route
        const data = await res.json();

        if (data.country_code) {
          setValue("country", data.country_code);
          // setValue("state", data.state);
        }
      } catch {
        setValue("country", "US");
      }
    };

    detectCountry();
  }, [setValue]);

  return (
    <section className="w-full mt-[9px] mb-20">
      {/* Breadcrumb (live hides it below 551px) */}
      <div className="hidden min-[551px]:block mb-0 text-sm">
        <Link href="/" className="text-[#333333] text-[13px] underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#333333] text-[13px]">Create Account</span>
      </div>
      <div className="max-w-full mx-auto w-full">

        <h1 className="text-[28px] leading-[34px] tracking-[0.25px] text-[#333333] mt-[26.25px] mb-[26.25px]">
          New Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
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
                className="absolute right-3 top-[45px] text-gray-500 hover:text-gray-700"
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
                className="absolute right-3 top-[45px] text-gray-500 hover:text-gray-700"
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
                <option value="">Choose a Country</option>
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
              {/* <Input
                id="state"
                className={inputClass}
                {...register("state", { required: true })}
              /> */}
              <select
                id="state"
                className={`${inputClass} cursor-pointer`}
                {...register("state", { required: true })}
              >
                <option value="">Choose a State</option>
                {stateList.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-[10px] text-red-500 mt-0.5">Required</p>
              )}
            </div>
          </div>

          {/* Row 7: Zip (single field row) */}
          <div className="w-full min-[551px]:w-[49.3%]">
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
          <div className="flex flex-col min-[551px]:flex-row justify-between items-center pt-4 gap-4">
            <p className="text-[14px] text-gray-600 mb-0">
              {/* Already have an account?{" "}
              <Link href="/auth/login" className="text-[#FD5430] hover:underline">
                Sign in
              </Link> */}
            </p>
            {registerLoading ? (
              <div className="flex justify-center min-[551px]:justify-end w-full min-[551px]:w-[174px]">
                <div className="w-8 h-8 border-4 border-t-transparent border-[#FF482E] rounded-full animate-spin" />
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full min-[551px]:w-[174px] bg-[#FF482E] hover:bg-[#e04a2a] text-white font-light h-[40px] rounded-[4px] text-[14px]"
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
