"use client";

import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { baseURL, storeId } from "@/lib/axiosInstance";
import { registerUser } from "@/redux/slices/authSlice";
import { useState } from "react";

interface SignupFormProps {
  onCancel?: () => void;
}

const SignupForm = ({ onCancel }: SignupFormProps) => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const onSubmit = async () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    };

    if (!state.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!state.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!state.email) {
      newErrors.email = "Email is required";
    }

    if (!state.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (
      newErrors.firstName ||
      newErrors.lastName ||
      newErrors.email ||
      newErrors.password
    ) {
      return;
    }

    try {
      const payload = {
        userRole: 2,
        ...state,
      };

      const result = await dispatch(registerUser(payload));

      if (registerUser.fulfilled.match(result)) {
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
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
      } else {
        const errorMessage =
          result.payload || "Registration failed. Please try again.";

     
      }
    } catch (err) {
    
    }
  };
  return (
    <div className="w-full space-y-5">
      {/* First + Last Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="block text-[14px] text-[#545454] mb-2">
            First Name
          </label>

          <Input
            className="w-full h-15 max-w-full py-[15px]"
            placeholder="First Name"
            required
            value={state.firstName}
            onChange={(e) => setState({ ...state, firstName: e.target.value })}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="w-full">
          <label className="block text-[14px] text-[#545454] mb-2">
            Last Name
          </label>

          <Input
            className="w-full h-15 max-w-full py-[15px]"
            placeholder="Last Name"
            required
            value={state.lastName}
            onChange={(e) => setState({ ...state, lastName: e.target.value })}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email Full Width */}
      <div className="w-full block">
        <label className="block text-[14px] text-[#545454] mb-2">
          Email Address
        </label>

        <Input
          type="email"
          className="w-full h-15 max-w-full py-[15px] !foucs:outline-none"
          placeholder="Email Address"
          required
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password Full Width */}
      <div className="!w-full block">
        <label className="block text-[14px] text-[#545454] mb-2">
          Password
        </label>

        <Input
          type="password"
          className="w-full h-15 max-w-full py-[15px] mb-3 rounded-none"
          placeholder="Password"
          required
          value={state.password}
          onChange={(e) => setState({ ...state, password: e.target.value })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          type="button"
          onClick={onSubmit}
          className="btn-primary w-full sm:w-auto !mt-[9px] !mb-[15px] sm:!mb-0 sm:!mt-0"
        >
          CREATE ACCOUNT
        </button>

        <button
          type="button"
          onClick={() => onCancel?.()}
          className="btn-primary w-full sm:w-auto"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
