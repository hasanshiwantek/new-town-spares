"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import styles from "@/styles/auth/Auth.module.css";
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
  const { loginLoading  } = useAppSelector((state: RootState) => state?.auth);
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
    } catch (err: any) {
      console.error("🚨 Unexpected error during onSubmit:", err);
    }
  };

  return (
    <section
      className={`!min-h-screen !w-full relative flex items-center justify-center !bg-cover !bg-center p-8 ${styles.signUpBG}`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Grid Layout */}
      <div className="relative z-10 w-full max-w-8xl bg-transparent  grid grid-cols-1 md:grid-cols-2 overflow-hidden 2xl:ms-20">
        {/* Left Section */}
        <div className="flex flex-col items-center lg:items-start justify-center p-6 sm:p-10">
          <h1 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] 2xl:text-[60px] font-extrabold mb-4 text-white leading-tight">
            Lorem ipsum dolor sit amet
          </h1>
          <h2 className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] 2xl:text-[32px] font-extrabold mb-6 text-white leading-snug">
            Sed ut perspiciatis, unde omnis iste natus error
          </h2>
          <Button
            asChild
            className="btn-primary w-[60%] sm:w-[240px] !py-6 sm:!py-8 2xl:w-[214px] 2xl:!py-9 rounded 2xl:text-[22px] xl:text-[16.5] text-[14px] "
          >
            <Link href="/auth/signup">Call to Action</Link>
          </Button>
        </div>

        {/* Right Section (Form) */}
        <div className="flex justify-center w-full">
          <div className="p-6 sm:p-8 lg:p-10 bg-white w-full sm:w-11/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-[650px] rounded-lg shadow-md 2xl:px-[40px]">
            {/* Header */}
            <h2 className="h2-medium text-center">Welcome back</h2>
            <p className="h5-regular text-center mb-12">
              Login to your account
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <Label className="h5-regular" htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="!w-full !max-w-full h-[50px] sm:h-[55px] 2xl:h-[60px]"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">Required</p>
                )}
              </div>

              {/* Password */}
              <div className="relative w-full">
                <Label className="h5-regular" htmlFor="password">
                  Password <span className="text-red-600">*</span>
                </Label>

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="!w-full !max-w-full h-[50px] sm:h-[55px] 2xl:h-[60px] pr-12"
                  {...register("password", { required: true })}
                />

                {/* Eye icon */}
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-[52px] 2xl:top-20 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">Required</p>
                )}
              </div>

              {/* Forgot password */}
              <p className="text-[14px] sm:text-[16px] font-semibold text-[#F15939] text-end">
                Forgot password?
              </p>

              {/* Submit */}
              {loginLoading  ? (
                <div className="flex justify-center items-center py-9">
                  <div className="w-8 h-8 border-4 border-t-transparent border-[#F15939] rounded-full animate-spin"></div>
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full !py-6 sm:!py-7 2xl:!py-9 !rounded-full btn-primary  2xl:text-[22px] xl:text-[16.5] text-[14px] text-[#FFFFFF]"
                >
                  {loginLoading  ? "Logging in..." : "Login"}
                </Button>
              )}
            </form>

            {/* Divider */}
            <div className="flex items-center my-8 sm:my-12">
              <div className="flex-grow border-t border-gray-300" />
              <span className="px-3 text-gray-500 h5-regular">
                or continue with
              </span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            {/* Social Logins */}
            <div className="flex flex-col lg:flex-row justify-center gap-4">
              <Button
                variant="outline"
                className="w-full lg:w-[45%] xl:w-[55%] 2xl:w-[279.9px] h-[50px] sm:h-[55px] rounded-xl lg:text-sm xl:text-lg 2xl:text-[18px] font-normal flex items-center justify-center gap-3"
              >
                <FcGoogle className="w-6 h-6" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full lg:w-[45%] xl:w-[55%] 2xl:w-[279.9px] h-[50px] sm:h-[55px] rounded-xl lg:text-sm xl:text-lg 2xl:text-[18px] font-normal flex items-center justify-center gap-3"
              >
                <FaFacebook className="w-6 h-6 text-blue-600" />
                Continue with Facebook
              </Button>
            </div>

            {/* Bottom Text */}
            <p className="h6-medium text-center !text-[#4A4A4A] mt-10">
              Don’t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-red-500 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninPage;
