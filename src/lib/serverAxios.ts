// lib/serverAxios.ts
import axios from "axios";
import { ENV_CONFIG } from "@/config/envConfig";
import { getStoreHeaders } from "@/lib/apiFetch";

const serverAxios = axios.create({
  baseURL: ENV_CONFIG.baseURL,
  headers: getStoreHeaders(),
});

export default serverAxios;
