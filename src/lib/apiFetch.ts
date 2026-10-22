import { ENV_CONFIG } from "@/config/envConfig";
import {
  getFromStorage,
  getPersistedAuth,
  getSessionId,
} from "@/utils/storage";

export const getStoreHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (ENV_CONFIG.storeId) headers["storeId"] = ENV_CONFIG.storeId;
  if (ENV_CONFIG.storeHash) headers["X-Store-Hash"] = ENV_CONFIG.storeHash;
  return headers;
};

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | null;
  json?: unknown;
  token?: string | null;
};

const buildUrl = (path: string) =>
  /^https?:\/\//i.test(path)
    ? path
    : `${ENV_CONFIG.baseURL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

const getStoredToken = () => {
  const token = getPersistedAuth()?.token ?? getFromStorage("token");
  return token ? String(token).replace(/^Bearer\s+/i, "") : null;
};

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const { json, token, headers, ...init } = options;
  const isBrowser = typeof window !== "undefined";

  const finalHeaders = new Headers(getStoreHeaders());

  if (isBrowser) {
    const sessionId = getSessionId();
    if (sessionId) finalHeaders.set("X-Session-ID", sessionId);
  }

  const authToken =
    token === undefined ? (isBrowser ? getStoredToken() : null) : token;
  if (authToken) finalHeaders.set("Authorization", `Bearer ${authToken}`);

  if (json !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
    init.body = JSON.stringify(json);
  }

  new Headers(headers).forEach((value, key) => finalHeaders.set(key, value));

  return fetch(buildUrl(path), { ...init, headers: finalHeaders });
}
