import { getSessionId } from "./storage";
import { ENV_CONFIG } from "@/config/envConfig";
interface TransferCartProps {
  token: string;
}
export const transferCart = async ({ token }: TransferCartProps) => {
  const sessionId = getSessionId();

  const response = await fetch(`${ENV_CONFIG.baseURL}web/cart/transfer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      storeId: ENV_CONFIG.storeId,
      "X-Session-ID": sessionId || "",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to transfer cart");
  }

  return response;
};
