"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadTrustpilotScript  from "./TrustpilotWidget";

const OrderInformation = () => {
  const router = useRouter();

  // Temporary Data
  const order = {
    id: 810,
    customer: {
      firstName: "Delilah",
      lastName: "Hester",
    },
    items: [
      {
        id: 1,
        name: "HPH823X3F0-New | HP | 73GB SAS 3GB/S 2.5-INCH HARD DRIVE",
        quantity: 1,
        price: 435,
        image:
          "https://via.placeholder.com/60x60?text=HP",
      },
    ],
    shipping: 22.28,
    tax: 0,
  };

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + order.shipping + order.tax;

  return (
    <div className="w-full max-w-[1170px] mx-auto px-4 py-10">

      {/* Trustpilot */}
       <div className="flex justify-center mb-8">
          <LoadTrustpilotScript />
        </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Left */}
        <div className="lg:col-span-2">

          <h1 className="text-[42px] text-[#545454] mb-8 font-normal">
            Thank You {order.customer.firstName}{" "}
            {order.customer.lastName}!
          </h1>

          <h2 className="text-xl text-[#545454] mb-6">
            Your order number is{" "}
            <span className="font-bold">
              #{order.id}
            </span>
          </h2>

          <p className="text-[#545454] leading-8">
            An email will be sent containing information about your purchase.
            If you have any questions about your purchase, email us at{" "}
            <span className="text-[#FF482E] font-semibold">
              info@serverblink.uk
            </span>
            .
          </p>

          <hr className="my-10 border-[#cfcfcf]" />

          <button
            onClick={() => router.push("/")}
            className="bg-[#FF482E] text-white px-8 py-3 uppercase font-semibold hover:bg-red-700"
          >
            Continue Shopping
          </button>
        </div>

        {/* Right */}
        <div>

          <div className="border border-gray-300">

            <div className="px-6 py-5 border-b font-semibold text-[#545454]">
              Order Summary
            </div>

            <div className="px-6 py-5">

              <p className="mb-5 font-medium">
                {order.items.length} Item
              </p>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 mb-6"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 border object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm text-[#545454]">
                      {item.quantity} x {item.name}
                    </p>
                  </div>

                  <div className="font-semibold">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}

            </div>

            <div className="border-t px-6 py-5 space-y-3">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>

            </div>

            <div className="border-t px-6 py-6 flex justify-between font-bold text-lg">
              <span>Total (USD)</span>
              <span>${total.toFixed(2)}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderInformation;