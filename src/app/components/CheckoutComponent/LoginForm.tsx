"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { loginUser } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignupForm from "./SignupForm";
import { baseURL, storeId } from "@/lib/axiosInstance";

interface SigninFormValues {
  email: string;
  password: string;
}
interface LoginFormProps {
  onCancel?: () => void;
}

const LoginForm = ({ onCancel }: LoginFormProps) => {
  const [showSignup, setShowSignup] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninFormValues>();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loginloading } = useAppSelector((state: RootState) => state.auth);
  const onSubmit = async () => {
    try {
      const result = await dispatch(loginUser(state));
      if (loginUser.fulfilled.match(result)) {
        const token = result?.payload?.token
        const fetchCartListInner = async () => {
          const sessionId = localStorage.getItem("sessionId")
          const res = await fetch(`${baseURL}web/cart/transfer`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "storeId": storeId,
              "X-Session-ID": sessionId || "",
              "Content-Type": "application/json",
            },
          });
          window.location.reload();
        };
        fetchCartListInner()
        setState({
          email: "",
          password: "",
        });
      } else {
        const errorMessage =
          typeof result?.payload === "string"
            ? result.payload
            : "Login failed. Please try again.";

        toast.error(errorMessage);
       
      }
    } catch (err) {
     
    }
  };

  return (
    <div className="max-full">
      {!showSignup ? (
        <div className="space-y-6">
          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-[14px]  font-normal text-[#545454]  mb-2"
            >
              Email Address:
            </label>
            <Input
              id="email"
              type="email"
              className="w-full h-15 max-w-full py-[15px] "
              value={state.email}
              onChange={(e) =>
                setState({
                  ...state,
                  email: e.target.value,
                })
              }
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-[14px]  font-normal text-[#545454] mb-2"
            >
              Password:
            </label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"} // toggle type
              className="w-full h-15 max-w-full py-[15px] pr-10" // add padding for icon
              value={state.password}
              onChange={(e) =>
                setState({
                  ...state,
                  password: e.target.value,
                })
              }
            />
            {/* Eye Icon */}
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-[#545454]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>

            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mt-3 text-[13px] flex items-center justify-between w-full">
            <Link
              href="/auth/forgot-password"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D42020] underline"
            >
              Forgot password?
            </Link>

            <p className="text-[#545454]">
              Don’t have an account?
              <button
                type="button"
                className="text-[#D42020]  mx-[3px]"
                onClick={() => setShowSignup(true)}
              >
                Create an account
              </button>
              to continue.
            </p>
          </div>

          {/* Login Button and Forgot Password */}
          <div className="flex flex-col sm:flex-row gap-4 ">
            {loginloading ? (
              <div className="flex justify-center items-center py-3">
                <div className="w-6 h-6 border-4 border-t-transparent border-red-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={onSubmit}
                  className="btn-primary w-full sm:w-auto !mb-[15px] sm:!mb-0"
                >
                  {loginloading ? "Loading..." : "SiGN IN"}
                </button>
                <button
                  type="button"
                  className="btn-primary w-full sm:w-auto"
                  onClick={() => onCancel?.()}
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full">
          <SignupForm onCancel={() => setShowSignup(false)} />
        </div>
      )}
    </div>
  );
};

export default LoginForm;
