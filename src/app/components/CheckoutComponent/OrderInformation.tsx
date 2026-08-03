"use client";

import React, {
  useState,
  useMemo,
  useEffect,
} from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { applyCoupon, removeCoupon } from "@/redux/slices/couponSlice"; // ADD THIS
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import LoadTrustpilotScript from "./TrustpilotWidget";
import OrderInformationSummary from "./OrderInformationSummary";
import { orderDetailById } from "@/redux/slices/OrderMessage";
// Inner component that uses Stripe hooks
const CheckoutForm = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const orderId = params.orderId;
  const router = useRouter();
  const customerOrderDetail = useAppSelector((state: RootState) => state?.customerMessage?.orderDetail);
  const orderCustomer = customerOrderDetail?.customer ? customerOrderDetail : null;
  const cart: any = customerOrderDetail?.products
    ? customerOrderDetail.products.map((product: any) => ({
      ...product,
      quantity: product.quantity || 1,
    }))
    : [];
  // ADD COUPON STATE FROM REDUX
  const { appliedCoupon, discountAmount } = useAppSelector(
    (state: RootState) => state.coupon
  );

  const [promoCode, setPromoCode] = useState("");

  // Memoized calculations
  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc: any, item: any) => acc + Number(item.price) * (item.quantity || 1),
      0
    );
  }, [cart]);

  const shipping = useMemo(() => {

    // ✅ Cart page se localStorage mein saved cost
    if (typeof window !== "undefined") {
      const savedCost = customerOrderDetail?.shippingCost;
      if (savedCost) return Number(savedCost);
    }

    if (cart.length === 0) return 0;
    return cart.reduce((sum: any, item: any) => sum + Number(item.fixedShippingCost || 0), 0);
  }, [cart]);

  const tax = 0;

  // Total before discount
  const totalBeforeDiscount = useMemo(() => subtotal + shipping + tax, [subtotal, shipping]);

  // Final total after discount
  const finalTotal = useMemo(() =>
    Math.max(totalBeforeDiscount - discountAmount, 0),
    [totalBeforeDiscount, discountAmount]
  );

  // ADD COUPON HANDLERS
  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      await dispatch(
        applyCoupon({ couponCode: promoCode, total: totalBeforeDiscount })
      ).unwrap();
      toast.success("Promo code applied successfully!");
      setPromoCode("");
    } catch (err: any) {
      toast.error(err || "Failed to apply coupon");
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setPromoCode("");
    toast.info("Coupon removed");
  };

  useEffect(() => {
    if (!orderId) return;
    dispatch(orderDetailById({ orderId }));
  }, [orderId]);

  return (
    <div className="min-h-screen py-10md:px-[6%]  xl:px-0 2xl:px-0   w-full max-w-[1170px] mx-auto px-4 lg:px-0 ">

      <form>
        <div className="flex justify-center mb-8">
          <LoadTrustpilotScript />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start ">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 mt-[18px] roboto-font" >
            <div className="mt-[1px]">
              <h2 className="text-4xl font-normal text-[#545454] mb-8">
                Thank You {orderCustomer?.customer?.firstName} {orderCustomer?.customer?.lastName}!
              </h2>

              <h6 className="text-lg font-medium mb-6 text-[#545454]">
                Your order number is{" "}
                <span className="font-bold text-[#545454]">
                  #{orderCustomer?.id}
                </span>
              </h6>

              <p className="text-[#545454] leading-7 mb-8">
                An email will be sent containing information about your purchase.
                If you have any questions about your purchase, email us at{" "}
                <span className="font-semibold text-[#fd5430]">
                  orders@newtownspares.com
                </span>{" "}
                or call us at{" "}
                <span className="font-semibold text-[#fd5430]">
                  {/* +44 123 456 7890 */}
                  (209) 651-6864
                </span>.
              </p>

              <hr className="my-8 border-0 h-[0.5px] bg-[#545454]" />

              <button
                type="button"
                onClick={() => router.push("/")}
                className="btn-primary !px-6 !py-3 h-[44px] !text-lg"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-1 lg:sticky lg:top-6">
            <OrderInformationSummary
              cart={cart}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={totalBeforeDiscount}
              finalTotal={finalTotal}
              discountAmount={discountAmount}
              appliedCoupon={appliedCoupon}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
          </div>

        </div>
      </form>


    </div>
  );
};

// Main component with Stripe Elements provider
const OrderInformation = () => {
  return (
    <CheckoutForm />
  );
};

export default OrderInformation;
