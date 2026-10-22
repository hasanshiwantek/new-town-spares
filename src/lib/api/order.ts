import { apiFetch } from "@/lib/apiFetch";

export const fetchOrderDetails = async (orderId: string) => {
  try {
    const res = await apiFetch("web/orders/order-details", {
      method: "POST",
      json: { orderId },
    });

    if (!res.ok) throw new Error("Failed to fetch order details");
    const data = await res.json();
    console.log("Order details: ", data?.order);

    return data?.order || [];
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw new Error("Failed to fetch order details");
  }
};