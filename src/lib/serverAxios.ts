// lib/serverAxios.ts
import axios from "axios";
import { ENV_CONFIG } from "@/config/envConfig";

const serverAxios = axios.create({
  baseURL: ENV_CONFIG.baseURL,
  headers: {
    storeId: ENV_CONFIG.storeId, // Replace with dynamic storeId if needed
  },
});

export default serverAxios;
