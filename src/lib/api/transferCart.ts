import { apiFetch } from "@/lib/apiFetch";
interface TransferCartProps {
  token: string;
}
export const transferCart = async ({ token }: TransferCartProps) => {
  const response = await apiFetch("web/cart/transfer", {
    method: "POST",
    token,
  });

  if (!response.ok) {
    throw new Error("Failed to transfer cart");
  }

  return response;
};
