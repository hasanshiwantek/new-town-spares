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
import { Eye, EyeOff } from "lucide-react";
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
  const { loginLoading } = useAppSelector((state: RootState) => state?.auth);

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
    <section className=" w-full mb-20">
         <div className="mb-7 text-sm md:text-base">
          <Link href="/" className="hover:text-[#F15939] transition-colors mx-1 text-[#333333] text-[13px]">
            Home
          </Link>{" "}
          / <span className="mx-1 text-[#333333] text-[13px]">Login</span>
        </div>
      <div className="max-w-[800px] mx-auto">
        {/* Breadcrumb */}
      

        {/* Main Title */}
        <h1 className="text-3xl md:text-[28px] text-[#333333] text-center mb-8">
          Sign in
        </h1>

        {/* Two Cards */}
        <div className="flex flex-col md:flex-row gap-8 md:max-h-[332.56px] mb-5">
          {/* Left Card - New Customer */}
          <div className="w-full md:w-[254px] rounded-lg border p-4 sm:p-6 flex flex-col order-2 md:order-1">
            <h2 className="text-xl md:text-[20px] text-[#333333] mb-4">
              New Customer?
            </h2>
            <p className="text-[#333333] text-[14px] mb-4">
              Create an account with us and you&apos;ll be able to:
            </p>
            <ul className="text-[#333333] text-[14px] space-y-1 mb-8 flex-1">
              <li className="flex items-center gap-6">
                <span className="text-[#333333]">•</span>
                Check out faster
              </li>
              <li className="flex items-center gap-6">
                <span className="text-[#333333]">•</span>
                Save multiple shipping addresses
              </li>
              <li className="flex items-center gap-6">
                <span className="text-[#333333]">•</span>
                Access your order history
              </li>
              <li className="flex items-center gap-6">
                <span className="text-[#333333]">•</span>
                Track new orders
              </li>
              <li className="flex items-center gap-6">
                <span className="text-[#333333]">•</span>
                Save items to your lists
              </li>
            </ul>
            <Button
              asChild
              className="w-full md:w-[173px] bg-[#FD5430] hover:bg-[#e04a2a] text-white font-medium h-[39.58px] rounded-md text-[14px]"
            >
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>

          {/* Right Card - Sign in */}
          <div className="bg-[#EFEFEF] w-full md:w-[523px] rounded-lg p-4 sm:p-6 order-1 md:order-2">
            <h2 className="text-xl md:text-[20px] text-[#333333] text-center mb-6">Sign in</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <Label
                  htmlFor="email"
                  className="text-[#333333] text-[14px] font-medium block mb-2"
                >
                  Email Address:
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder=""
                  className="w-full h-14 !max-w-full bg-white border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-[#FD5430] focus:border-[#FD5430]"
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
                  className="text-[#333333] text-[14px] font-medium block mb-2"
                >
                  Password:
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  className="w-full h-14 !max-w-full bg-white border border-gray-300 rounded-md px-3 pr-12 focus:ring-2 focus:ring-[#FD5430] focus:border-[#FD5430]"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-12 text-[#333333] text-[14px] hover:text-[#333333]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors.password && (
                  <p className="text-[14px] text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  href="/auth/forgot-password"
                  className="text-[#333333] text-[14px] underline hover:text-[#FD5430]"
                >
                  Forgot your password?
                </Link>
                {loginLoading ? (
                  <div className="w-8 h-8 border-4 border-t-transparent border-[#FD5430] rounded-full animate-spin" />
                ) : (
                  <Button
                    type="submit"
                    className="w-full md:w-[114px] bg-[#FD5430] hover:bg-[#e04a2a] text-white font-medium h-[39.58px] rounded-md text-[14px]"
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
