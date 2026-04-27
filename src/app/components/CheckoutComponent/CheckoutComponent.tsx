"use client";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import {
  decreaseQty,
  increaseQty,
  removeFromCart,
  clearCart,
} from "@/redux/slices/cartSlice";
import { applyCoupon, removeCoupon } from "@/redux/slices/couponSlice"; // ADD THIS
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import countries from "world-countries";
import { useForm } from "react-hook-form";
import { loadStripe } from "@stripe/stripe-js";
import type { PaymentRequest as StripePaymentRequest } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { setLastOrder } from "@/redux/slices/orderslice";

// Import step components
import CustomerStep from "./CustomerStep";
import ShippingStep from "./Shippingstep";
import BillingStep from "./Billingstep";
import PaymentStep from "./Paymentstep";
import CheckoutOrderSummary from "./CheckoutOrderSummary";

// Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51Q84ITDXm8Pt3arOOI28hj5W9JPohSimaAfVeGxCPCf9N86B5rK1POKOhQpOsNmeaid1cbRAU06yzV8eienwD10B00KDT12v4S"
);

// Pre-compute country list at module level
const countryList = countries
  .map((country) => ({
    name: country.name.common,
    code: country.cca2,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

interface CheckoutFormValues {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  shippingMethod: string;
  orderComment: string;
  paymentMethod: string;
  paymentIntentId?: string | null;
  billingSame: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingCompany: string;
  billingPhone: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingCountry: string;
  billingState: string;
  billingZip: string;
}

// Inner component that uses Stripe hooks
const CheckoutForm = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const auth = useAppSelector((state: RootState) => state?.auth);

  // ADD COUPON STATE FROM REDUX
  const { appliedCoupon, discountAmount } = useAppSelector(
    (state: RootState) => state.coupon
  );

  const [promoCode, setPromoCode] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardCompletion, setCardCompletion] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });
  const [cardError, setCardError] = useState<string | null>(null);
  const [paymentRequest, setPaymentRequest] =
    useState<StripePaymentRequest | null>(null);
  const [walletSupport, setWalletSupport] = useState<{
    applePay: boolean;
    googlePay: boolean;
  }>({ applePay: false, googlePay: false });
  const [pendingWalletForm, setPendingWalletForm] =
    useState<CheckoutFormValues | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const emptyCartWarningShownRef = useRef(false);
  const skipEmptyCartCheckRef = useRef(false);

  useEffect(() => {
    if (cart.length === 0) {
      if (skipEmptyCartCheckRef.current) {
        return;
      }

      if (!emptyCartWarningShownRef.current) {
        emptyCartWarningShownRef.current = true;
        toast.error("Please add something");
        router.push("/cart");
      }
    } else {
      emptyCartWarningShownRef.current = false;
    }
  }, [cart.length, router]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      paymentMethod: "credit_card",
      billingSame: false,
      email: auth?.user?.email || "",
      firstName: auth?.user?.firstName || "",
      lastName: auth?.user?.lastName || "",
      company: auth?.user?.companyName || "",
      phone: auth?.user?.phone || "",
      state: auth?.user?.state || "",
      country: "US",
      billingCountry: "US",
    },
  });

  const watchedPaymentMethod = watch("paymentMethod") || "credit_card";
  const watchedBillingSame = watch("billingSame");
  const stripeCardMethods = ["credit_card"];
  const walletMethods = ["google_pay", "apple_pay"];
  const { shippingRates } = useAppSelector((state) => state.shippingZone);
  // 2. watchedShippingMethod add 
  const watchedShippingMethod = watch("shippingMethod");
  // Memoized calculations
  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + Number(item.price) * (item.quantity || 1),
      0
    );
  }, [cart]);

  const shipping = watchedShippingMethod ? useMemo(() => {
    if (!watchedShippingMethod || !shippingRates?.length) return 0;
    const selected = shippingRates.find((rate) =>
      rate.service_type === watchedShippingMethod
    );
    return selected ? Number(selected?.total_charge) : 0;
  }, [watchedShippingMethod, shippingRates]) : useMemo(() => {
    if (cart.length === 0) return 0;

    return cart.reduce((sum, item) => {
      const cost = Number(item.fixedShippingCost || 0);
      return sum + cost;
    }, 0);
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

  // Memoized handlers
  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      dispatch(removeFromCart(itemToDelete.id));
      setItemToDelete(null);
    }
    setIsDialogOpen(false);
  }, [itemToDelete, dispatch]);

  const handleIncreaseQty = useCallback(
    (itemId: string | number) => {
      dispatch(increaseQty(itemId));
    },
    [dispatch]
  );

  const handleDecreaseQty = useCallback(
    (itemId: string | number) => {
      dispatch(decreaseQty(itemId));
    },
    [dispatch]
  );

  const handleDeleteClick = useCallback((item: any) => {
    setItemToDelete(item);
    setIsDialogOpen(true);
  }, []);

  const handlePaymentSelection = useCallback(
    (method: CheckoutFormValues["paymentMethod"]) => {
      setValue("paymentMethod", method);
      setCardError(null);
      setCardCompletion({
        number: false,
        expiry: false,
        cvc: false,
      });
    },
    [setValue, setCardCompletion, setCardError]
  );

  useEffect(() => {
    if (!stripe || cart.length === 0) {
      setPaymentRequest(null);
      setWalletSupport({ applePay: false, googlePay: false });
      return;
    }

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Order Total",
        amount: Math.max(0, Math.round(finalTotal * 100)), // USE finalTotal
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    });

    let isMounted = true;

    pr.canMakePayment()
      .then((result) => {
        if (!isMounted) return;
        if (result) {
          setPaymentRequest(pr);
          setWalletSupport({
            applePay: Boolean(result.applePay),
            googlePay: Boolean(result.googlePay || result.browserPay),
          });
        } else {
          setPaymentRequest(null);
          setWalletSupport({ applePay: false, googlePay: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [stripe, cart, finalTotal]); // DEPENDENCY: finalTotal instead of total

  const buildOrderPayload = useCallback(
    (data: CheckoutFormValues & { paymentIntentId?: string | null }) => ({
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.company || "",
      email: data.email,
      phone: data.phone || "",
      addressLine1: data.address1,
      addressLine2: data.address2 || "",
      city: data.city,
      state: data.state || "",
      zip: data.zip,
      country: data.country,
      paymentMethod: data.paymentMethod,
      shippingMethod: data.shippingMethod,
      discountAmount: discountAmount ? finalTotal : 0,
      shippingCost: shipping,
      comments: data.orderComment || "",
      paymentIntentId: data.paymentIntentId ?? "",
      products: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity || 1,
      })),
    }),
    [cart, shipping]
  );

  const placeOrder = useCallback(
    async (data: CheckoutFormValues) => {
      const orderPayload = buildOrderPayload(data);
      const orderResponse = await axiosInstance.post(
        "web/orders/place-order",
        orderPayload
      );
      const orderData = orderResponse.data?.data || orderResponse.data;

      return orderData || null;
    },
    [buildOrderPayload]
  );

  const handleStripeCharge = useCallback(
    async (paymentMethodId: string) => {
      const stripePayload = {
        payment_method_id: paymentMethodId,
        amount: Math.round(finalTotal * 100), // USE finalTotal for Stripe
        products: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity || 1,
        })),
      };

      const response = await axiosInstance.post(
        "web/stripe/pay",
        stripePayload
      );
      return response.data?.payment_intent_id || null;
    },
    [cart, finalTotal] // ADD finalTotal as dependency
  );

  useEffect(() => {
    if (!paymentRequest) {
      return;
    }

    const handlePaymentMethod = async (event: any) => {
      if (!pendingWalletForm) {
        event.complete("fail");
        toast.error("Unable to process wallet payment. Please try again.");
        setIsProcessing(false);
        return;
      }

      try {
        const paymentIntentId = await handleStripeCharge(
          event.paymentMethod.id
        );

        if (!paymentIntentId) {
          event.complete("fail");
          toast.error("Failed to generate payment intent.");
          setIsProcessing(false);
          return;
        }

        const orderData = await placeOrder({
          ...pendingWalletForm,
          paymentIntentId,
        });

        event.complete("success");

        skipEmptyCartCheckRef.current = true;
        dispatch(setLastOrder(orderData));
        dispatch(clearCart());
        dispatch(removeCoupon());
        router.push("/order-success");
      } catch (err: any) {
        console.error("❌ Wallet payment failed:", err);
        event.complete("fail");

        const errorMessage =
          err?.response?.data?.message || err?.message || "Payment failed.";

        toast.error(errorMessage);
        setIsProcessing(false);
      } finally {
        setPendingWalletForm(null);
      }
    };

    const handleCancel = () => {
      setIsProcessing(false);
      setPendingWalletForm(null);
    };

    paymentRequest.on("paymentmethod", handlePaymentMethod);
    paymentRequest.on("cancel", handleCancel);

    return () => {
      paymentRequest.off("paymentmethod", handlePaymentMethod);
      paymentRequest.off("cancel", handleCancel);
    };
  }, [
    paymentRequest,
    pendingWalletForm,
    handleStripeCharge,
    placeOrder,
    dispatch,
    router,
  ]);

  // Step navigation handlers
  const handleContinueToShipping = async () => {
    const isValid = await trigger(["email"]);
    if (isValid) {
      setCompletedSteps((prev) => [...new Set([...prev, 1])]);
      setCurrentStep(2);
    }
  };

  const handleContinueToBilling = async () => {
    const isValid = await trigger([
      "firstName",
      "lastName",
      "address1",
      "city",
      "country",
      "zip",
      "shippingMethod",
    ]);
    if (isValid) {
      setCompletedSteps((prev) => [...new Set([...prev, 2])]);
      if (watchedBillingSame) {
        setCurrentStep(4);
      } else {
        setCurrentStep(3);
      }
    }
  };

  const handleContinueToPayment = async () => {
    if (!watchedBillingSame) {
      const isValid = await trigger([
        "billingFirstName",
        "billingLastName",
        "billingAddress1",
        "billingCity",
        "billingCountry",
        "billingZip",
      ]);
      if (isValid) {
        setCompletedSteps((prev) => [...new Set([...prev, 3])]);
        setCurrentStep(4);
      }
    } else {
      setCurrentStep(4);
    }
  };

  // Edit handlers
  const handleEditCustomer = () => {
    setCurrentStep(1);
  };

  const handleEditShipping = () => {
    setCurrentStep(2);
  };

  const handleEditBilling = () => {
    setCurrentStep(3);
  };

  const handleEditPayment = () => {
    setCurrentStep(4);
  };

  const handleWalletClick = (method: string) => {
    handlePaymentSelection(method);

    if (!paymentRequest) {
      const methodName = method === "apple_pay" ? "Apple Pay" : "Google Pay";
      toast.error(
        `${methodName} is not available. Please use a supported device/browser or try credit card payment.`
      );
      return;
    }

    const formData = watch();
    setPendingWalletForm(formData as CheckoutFormValues);
    setIsProcessing(true);

    try {
      paymentRequest.show();
    } catch (err: any) {
      console.error("❌ Unable to launch wallet:", err);
      const methodName = method === "apple_pay" ? "Apple Pay" : "Google Pay";
      toast.error(
        `Could not open ${methodName}. Please ensure you have a card set up in your wallet or try credit card payment.`
      );
      setIsProcessing(false);
      setPendingWalletForm(null);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    const selectedPaymentMethod = data.paymentMethod || "credit_card";

    const requiresStripeCard = stripeCardMethods.includes(
      selectedPaymentMethod
    );
    const isWalletMethod = walletMethods.includes(selectedPaymentMethod);

    if (requiresStripeCard) {
      if (
        !cardCompletion.number ||
        !cardCompletion.expiry ||
        !cardCompletion.cvc
      ) {
        const message =
          "Please complete your card details before placing the order.";
        setCardError(message);
        toast.error(message);
        return;
      }

      if (cardError) {
        toast.error(cardError);
        return;
      }
    }

    if (isWalletMethod) {
      const walletAvailable =
        selectedPaymentMethod === "apple_pay"
          ? walletSupport.applePay
          : walletSupport.googlePay;

      if (!paymentRequest || !walletAvailable) {
        toast.error("This wallet is not available on your device.");
        return;
      }

      setPendingWalletForm(data);
      setIsProcessing(true);

      try {
        paymentRequest.show();
      } catch (err: any) {
        console.error("❌ Unable to launch wallet:", err);
        toast.error("Could not open the wallet sheet. Please try again.");
        setIsProcessing(false);
        setPendingWalletForm(null);
      }

      return;
    }

    setIsProcessing(true);

    try {
      let paymentIntentId: string | null = null;

      if (requiresStripeCard) {
        if (!stripe || !elements) {
          toast.error("Payment service is not ready yet. Please try again.");
          setIsProcessing(false);
          return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);

        if (!cardNumberElement) {
          toast.error(
            "Payment form is not ready. Please refresh and try again."
          );
          setIsProcessing(false);
          return;
        }

        const { error: pmError, paymentMethod } =
          await stripe.createPaymentMethod({
            type: "card",
            card: cardNumberElement,
            billing_details: {
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
              phone: data.phone,
              address: {
                line1: data.address1,
                line2: data.address2,
                city: data.city,
                state: data.state,
                postal_code: data.zip,
                country: data.country,
              },
            },
          });

        if (pmError) {
          console.error("Payment method error:", pmError);
          toast.error(pmError.message || "Unable to create payment method.");
          setIsProcessing(false);
          return;
        }

        if (paymentMethod) {
          paymentIntentId = await handleStripeCharge(paymentMethod.id);

          if (!paymentIntentId) {
            toast.error("Failed to generate payment intent.");
            setIsProcessing(false);
            return;
          }
        }
      }

      const orderData = await placeOrder({ ...data, paymentIntentId });
      skipEmptyCartCheckRef.current = true;
      dispatch(setLastOrder(orderData));
      dispatch(clearCart());
      dispatch(removeCoupon());
      router.push("/order-success");
    } catch (err: any) {
      console.error("❌ Error processing order:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while processing your order.";

      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-10md:px-[6%]  xl:px-0 2xl:px-0   w-full max-w-[1170px] mx-auto px-4 lg:px-0 ">
      {paymentRequest && (
        <div className="hidden">
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION - Multi-step form */}
          <div className="lg:col-span-2 space-y-0">
            {/* STEP 1: Customer */}
            <div className="p-6 border-b-[1px] border-b-[#8b8b8b]">
              <h2 className="text-[2.1rem] font-normal mb-4 text-[#545454]">
                Customer
              </h2>
              <CustomerStep
                register={register}
                errors={errors}
                onContinue={handleContinueToShipping}
                walletSupport={walletSupport}
                onWalletClick={handleWalletClick}
                isActive={currentStep === 1}
                isCompleted={completedSteps.includes(1)}
                onEdit={handleEditCustomer}
                emailValue={watch("email")}
              />
            </div>

            {/* STEP 2: Shipping */}
            <div className="p-6  border-b-[1px] border-b-[#8b8b8b]">
              <h2 className="text-[2.1rem] font-normal mb-4 text-[#545454]">
                Shipping
              </h2>
              <ShippingStep
                register={register}
                errors={errors}
                control={control}
                onContinue={handleContinueToBilling}
                countryList={countryList}
                isActive={currentStep === 2}
                isCompleted={completedSteps.includes(2)}
                onEdit={handleEditShipping}
                shippingInfo={{
                  firstName: watch("firstName"),
                  lastName: watch("lastName"),
                  address: watch("address1"),
                  city: watch("city"),
                  state: watch("state"),
                  country: watch("country"),
                  zip: watch("zip"),
                }}
                watchedShippingMethod={watchedShippingMethod}
              />
            </div>

            {/* STEP 3: Billing */}
            <div className="p-6  border-b-[1px] border-b-[#8b8b8b]">
              <h2 className="text-[2.1rem] font-normal mb-4 text-[#545454]">
                Billing
              </h2>
              {!watchedBillingSame && (
                <BillingStep
                  register={register}
                  errors={errors}
                  control={control}
                  onContinue={handleContinueToPayment}
                  countryList={countryList}
                  isActive={currentStep === 3}
                  isCompleted={completedSteps.includes(3)}
                  onEdit={handleEditBilling}
                  billingInfo={{
                    firstName: watch("billingFirstName"),
                    lastName: watch("billingLastName"),
                    address: watch("billingAddress1"),
                    city: watch("billingCity"),
                    state: watch("billingState"),
                    country: watch("billingCountry"),
                    zip: watch("billingZip"),
                  }}
                />
              )}
            </div>

            {/* STEP 4: Payment */}
            <div className="p-6  border-b-[1px] border-b-[#8b8b8b]">
              <h2 className="text-[2.1rem] font-normal mb-4 text-[#545454]">
                Payment
              </h2>
              <PaymentStep
                register={register}
                errors={errors}
                watchedPaymentMethod={watchedPaymentMethod}
                handlePaymentSelection={handlePaymentSelection}
                cardCompletion={cardCompletion}
                setCardCompletion={setCardCompletion}
                cardError={cardError}
                setCardError={setCardError}
                walletSupport={walletSupport}
                isProcessing={isProcessing}
                stripe={stripe}
                isActive={currentStep === 4}
                isCompleted={completedSteps.includes(4)}
                onEdit={handleEditPayment}
                paymentMethodLabel={
                  watchedPaymentMethod === "credit_card"
                    ? "Credit Card"
                    : watchedPaymentMethod === "apple_pay"
                      ? "Apple Pay"
                      : watchedPaymentMethod === "google_pay"
                        ? "Google Pay"
                        : "Credit Card"
                }
              />
            </div>
          </div>

          {/* RIGHT SECTION - Order Summary */}
          <CheckoutOrderSummary
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
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <strong>{itemToDelete?.name}</strong> from your cart? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="!p-4 !text-lg"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="!p-4 !text-lg"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main component with Stripe Elements provider
const CheckoutComponent = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutComponent;