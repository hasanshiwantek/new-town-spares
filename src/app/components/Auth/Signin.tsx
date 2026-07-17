"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { loginUser } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { toast } from "react-toastify";

interface SigninFormValues {
  email: string;
  password: string;
}

const SigninPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninFormValues>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const { loginloading } = useAppSelector((state: RootState) => state?.auth);

  const onSubmit = async (data: SigninFormValues) => {
    try {
      const result = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(result)) {
        reset();
        router.push("/my-account/orders");
      } else {
        const errorMessage =
          typeof result?.payload === "string"
            ? result.payload
            : "Login failed. Please try again.";
        toast.error(errorMessage);
        console.error("❌ Login rejected with message:", errorMessage);
      }
    } catch (err: unknown) {
      console.error("🚨 Unexpected error during onSubmit:", err);
    }
  };

  return (
    <section className="w-full mt-[9px] mb-20">
      {/* Breadcrumb (live hides it below 551px) */}
      <div className="hidden min-[551px]:block mb-0 text-sm">
        <Link
          href="/"
          className="hover:text-[#F15939] transition-colors text-[#333333] text-[13px] underline"
        >
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#333333] text-[13px]">Login</span>
      </div>

      <div className="max-w-[800px] mx-auto">
        {/* Main Title */}
        <h1 className="text-[28px] leading-[34px] text-[#333333] text-center mt-[26.25px] mb-[26.25px]">
          Sign in
        </h1>

        {/* Two Cards */}
        <div className="flex flex-col min-[801px]:flex-row gap-[22px] min-[801px]:max-h-[333px] mb-5">
          {/* Left Card - New Customer */}
          <div className="w-full min-[801px]:w-[254px] shadow-[0_0_1px_0_rgba(0,0,0,0.5)] p-[21px] flex flex-col order-2 min-[801px]:order-1">
            <h2 className="text-[20px] text-[#333333] mb-[11px]">
              New Customer?
            </h2>
            <p className="text-[#333333] text-[14px]">
              Create an account with us and you&apos;ll be able to:
            </p>
            <ul className="list-disc pl-[16px] py-[21px] text-[#333333] text-[14px] leading-[21px] flex-1">
              <li className="pl-[12px]">Check out faster</li>
              <li className="pl-[12px]">Save multiple shipping addresses</li>
              <li className="pl-[12px]">Access your order history</li>
              <li className="pl-[12px]">Track new orders</li>
              <li className="pl-[12px]">Save items to your lists</li>
            </ul>
            <Button
              asChild
              className="w-[174px] bg-[#FF482E] hover:bg-[#e04a2a] text-white font-light h-[40px] rounded-[4px] text-[14px]"
            >
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>

          {/* Right Card - Sign in */}
          <div className="bg-[#ebebeb] w-full min-[801px]:w-[524px] p-[21px] order-1 min-[801px]:order-2">
            <h2 className="text-[20px] text-[#333333] text-center mb-[11px]">
              Sign in
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-[28px]">
              <div>
                <Label
                  htmlFor="email"
                  className="text-[#333333] text-[14px] font-light block my-0! mb-[7px]!"
                >
                  Email Address:
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder=""
                  className="w-full h-[42px] !max-w-full !text-[14px] bg-white border border-[#ebebeb] rounded-[4px] px-[14px] focus:ring-2 focus:ring-[#FF482E] focus:border-[#FF482E]"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-[14px] text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Label
                  htmlFor="password"
                  className="text-[#333333] text-[14px] font-light block my-0! mb-[7px]!"
                >
                  Password:
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  className="w-full h-[42px] !max-w-full !text-[14px] bg-white border border-[#ebebeb] rounded-[4px] px-[14px] pr-12 focus:ring-2 focus:ring-[#FF482E] focus:border-[#FF482E]"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-[40px] text-[#333333] hover:text-[#333333]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <span className="text-[14px] text-red-500 mt-1.6 flex items-center gap-2">
                    <X size={14} />
                    <p>{errors.password.message}</p>
                  </span>
                )}
              </div>

              <div className="flex flex-col xs:flex-row xs:items-start items-center justify-between gap-3">
                <Link
                  href="/auth/forgot-password"
                  className="text-[#333333] text-[14px] underline hover:text-[#FF482E]"
                >
                  Forgot your password?
                </Link>
                {loginloading ? (
                  <div className="w-8 h-8 border-4 border-t-transparent border-[#FF482E] rounded-full animate-spin" />
                ) : (
                  <Button
                    type="submit"
                    className="w-full xs:w-[186px] min-[551px]:w-[114px] bg-[#FF482E] hover:bg-[#e04a2a] text-white font-light h-[40px] rounded-[4px] text-[14px]"
                  >
                    Sign in
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninPage;
