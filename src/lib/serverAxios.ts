// lib/serverAxios.ts
import axios from "axios";
import { baseURL, storeId } from "./axiosInstance";

const serverAxios = axios.create({
  baseURL: baseURL,
  headers: {
    storeId: storeId, // Replace with dynamic storeId if needed
  },
});

export default serverAxios;
