// lib/axiosInstance.ts
import axios from "axios";
import { toast } from "react-toastify";

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.sparemicro.com/api/'
export const storeId = process.env.NEXT_PUBLIC_STORE_ID || "4";
export const sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LdD8CgtAAAAADZaKjM6MRA6nQ6VppSfiu2vspFr"
export const secretkey = process.env.RECAPTCHA_SECRET_KEY || "6LdD8CgtAAAAAInOe8Ey4_ByJ8u5KNiVpSJo-C0Q"
export const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51TTnoo8vkezGA3pyz8ekc5xIQNyhweCnxiumTB1si5Dejq5YWPGHDJIJPpBHMLw9hYRkbSkOGpdCzPrlW8g59HZ600cueNQymh";


const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("persist:auth");
    const sessionId = localStorage.getItem("sessionId");
    const user = data ? JSON.parse(data) : null
    const token = user?.token ? JSON.parse(user.token) : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (storeId) {
      config.headers["storeId"] = Number(storeId);
      config.headers["X-Session-ID"] = sessionId
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.message) {
      // toast.success(response.data.message, {
      //   style: {
      //     fontSize: "12px",
      //     fontWeight: "bold",
      //   },
      // });
    }
    return response;
  },
  (error) => {
    if (error.response?.data?.message) {
      // toast.error(error.response.data.message, {
      //   style: {
      //     fontSize: "12px",
      //     fontWeight: "bold",
      //   },
      // });
    }

    const errors = error.response?.data.errors;
    if (errors && typeof errors === "object") {
      Object.values(errors).forEach((fieldErrors) => {
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach((err) =>
            toast.error(err, {
              style: {
                fontSize: "12px",
                fontWeight: "bold",
              },
            })
          );
        }
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
