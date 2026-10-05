// lib/axiosInstance.ts
import axios from "axios";
import { errorMessage } from "@/utils/message";
import {
  getFromStorage,
  getPersistedAuth,
  getSessionId,
} from "@/utils/storage";

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend.sparemicro.com/api/";
export const siteURL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://new-town-spares.vercel.app";
export const storeId = "10";
// export const storeId = process.env.NEXT_PUBLIC_STORE_ID || "4";
export const sitekey =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LdD8CgtAAAAADZaKjM6MRA6nQ6VppSfiu2vspFr";
export const secretkey =
  process.env.RECAPTCHA_SECRET_KEY ||
  "6LdD8CgtAAAAAInOe8Ey4_ByJ8u5KNiVpSJo-C0Q";
export const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51TTnoo8vkezGA3pyz8ekc5xIQNyhweCnxiumTB1si5Dejq5YWPGHDJIJPpBHMLw9hYRkbSkOGpdCzPrlW8g59HZ600cueNQymh";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const auth = getPersistedAuth();
    const sessionId = getSessionId();
    const token = auth?.token ?? getFromStorage("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (storeId) {
      config.headers["storeId"] = Number(storeId);
      config.headers["X-Session-ID"] = sessionId;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.message) {
    }
    return response;
  },
  (error) => {
    if (error.response?.data?.message) {
    }

    const errors = error.response?.data.errors;
    if (errors && typeof errors === "object") {
      Object.values(errors).forEach((fieldErrors) => {
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach((err) => errorMessage(err));
        }
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
