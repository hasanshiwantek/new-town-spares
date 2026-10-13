import { getSessionId } from "./storage";
import { baseURL, storeId } from "@/lib/axiosInstance";
interface TransferCartProps {
  token: string;
}
export const transferCart = async ({ token }: TransferCartProps) => {
  const sessionId = getSessionId();

  const response = await fetch(`${baseURL}web/cart/transfer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      storeId,
      "X-Session-ID": sessionId || "",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to transfer cart");
  }

  return response;
};
