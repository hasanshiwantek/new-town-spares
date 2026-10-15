// lib/axiosInstance.ts
import { errorMessage } from "@/utils/message";
import {
  getFromStorage,
  getPersistedAuth,
  getSessionId,
  removeFromStorage,
} from "@/utils/storage";
import axios from "axios";
import { ENV_CONFIG } from "@/config/envConfig";

// Several requests can 401 at once; log out only once.
let isLoggingOut = false;

// Same as the navbar Sign out: logout() + replace to the login page.
const handleUnauthenticated = async () => {
  if (typeof window === "undefined" || isLoggingOut) return;
  isLoggingOut = true;

  // Lazy imports: the store/auth slice import this file (circular otherwise)
  const [{ store, persistor }, { logout }] = await Promise.all([
    import("@/redux/store"),
    import("@/redux/slices/authSlice"),
  ]);

  store.dispatch(logout());
  // redux-persist writes lazily; flush before navigating, and drop the legacy
  // token keys, or the next page load picks the dead token back up and loops.
  await persistor.flush();
  removeFromStorage("token");
  removeFromStorage("tokenExpiry");
  removeFromStorage("user");
  // Not in a component, so no router here; replace() keeps history the same.
  // Skip when already there, or a 401 on the login page would reload forever.
  if (!window.location.pathname.startsWith("/auth/login")) {
    window.location.replace("/auth/login");
  }
};

const axiosInstance = axios.create({
  baseURL: ENV_CONFIG.baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const auth = getPersistedAuth();
    const sessionId = getSessionId();
    const token = auth?.token ?? getFromStorage("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (ENV_CONFIG.storeId) {
      config.headers["storeId"] = Number(ENV_CONFIG.storeId);
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

    // Token expired/invalid: only when we actually sent one, so a failed
    // login (no token yet) doesn't trigger a logout.
    if (
      error.response?.status === 401 &&
      error.config?.headers?.Authorization
    ) {
      handleUnauthenticated();
      return Promise.reject(error);
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
