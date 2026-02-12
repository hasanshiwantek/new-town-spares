const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchOrderDetails = async (orderId: string) => {
  try {
    const res = await fetch(`${baseURL}web/orders/order-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        storeId: "4",
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
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