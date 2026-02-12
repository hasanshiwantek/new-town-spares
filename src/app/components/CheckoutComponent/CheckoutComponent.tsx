"use client";
import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useEffect,
  useRef,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import {
  decreaseQty,
  increaseQty,
  removeFromCart,
  clearCart,
} from "@/redux/slices/cartSlice";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import countries from "world-countries";
import { useForm, Controller } from "react-hook-form";
import { loadStripe } from "@stripe/stripe-js";
import type { PaymentRequest as StripePaymentRequest } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { setLastOrder } from "@/redux/slices/orderslice";
// Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51Q84ITDXm8Pt3arOOI28hj5W9JPohSimaAfVeGxCPCf9N86B5rK1POKOhQpOsNmeaid1cbRAU06yzV8eienwD10B00KDT12v4S"
);

// ✅ Pre-compute country list at module level (only once when module loads)
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
}

// ✅ Memoized Cart Item Component to prevent unnecessary re-renders
interface CartItemProps {
  item: any;
  onIncrease: (id: string | number) => void;
  onDecrease: (id: string | number) => void;
  onDelete: (item: any) => void;
}

const CartItem = memo(({ 
  item, 
  onIncrease, 
  onDecrease, 
  onDelete 
}: CartItemProps) => {
  return (
    <div className="relative flex flex-col sm:flex-row items-center gap-3 p-3 border">
      <Image
        src={item.image?.[0]?.path || "/checkouticon/orderimg.png"}
        alt={item.name}
        width={116}
        height={35}
        className="object-cover"
      />
      <div className="flex-1">
        <p className="h6-medium !text-[#333333] line-clamp-2">
          {item.name}
        </p>
        <p className="h6-regular !text-[#4A4A4A]">
          ${Number(item.price).toFixed(2)}
        </p>
        <div className="flex w-[120.39999389648438px] sm:w-[146.39999389648438px] h-[48px] items-center justify-center border border-gray-300 rounded-full">
          {/* Decrease Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDecrease(item.id);
            }}
            className="flex items-center justify-center w-16 h-10 h5-medium"
          >
            <Minus className="w-5 h-5" />
          </button>
          {/* Quantity Display */}
          <span className="h5-medium border-x h-[48px] border-gray-300 px-6 flex items-center justify-center select-none">
            {item.quantity}
          </span>
          {/* Increase Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onIncrease(item.id);
            }}
            className="flex items-center justify-center w-16 h-10 h5-medium"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(item);
          }}
          className="absolute right-6 bottom-9 ml-auto text-gray-500 hover:text-red-700 transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

CartItem.displayName = "CartItem";

// Inner component that uses Stripe hooks
const CheckoutForm = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.cart.items);
   const auth = useAppSelector((state: RootState) => state?.auth);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  // const [latestOrderId, setLatestOrderId] = useState<string | null>(null);
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
  // const [latestOrder, setLatestOrder] = useState<any | null>(null);

  // const handleSuccessModalChange = useCallback(
  //   (open: boolean) => {
  //     setIsSuccessModalOpen(open);
  //     if (!open) {
  //       router.push(`/my-account/orders`);
  //     }
  //   },
  //   [router]
  // );

  // useEffect(() => {
  //   if (!isSuccessModalOpen) {
  //     return;
  //   }
  //   const timeoutId = setTimeout(() => {
  //     handleSuccessModalChange(false);
  //   }, 4000);

  //   return () => clearTimeout(timeoutId);
  // }, [isSuccessModalOpen, handleSuccessModalChange]);

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

  // const handleSuccessRedirect = useCallback(() => {
  //   handleSuccessModalChange(false);
  // }, [handleSuccessModalChange]);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      paymentMethod: "credit_card",
      billingSame: true,
      email: auth?.user?.email || "",
      firstName: auth?.user?.firstName || "",
      lastName: auth?.user?.lastName || "", 
      company: auth?.user?.companyName || "",
      phone: auth?.user?.phone || "",
      state: auth?.user?.state || "",
    },
  });

  const watchedPaymentMethod = watch("paymentMethod") || "credit_card";
  const stripeCardMethods = ["credit_card"];
  const walletMethods = ["google_pay", "apple_pay"];

  // ✅ Memoized calculations to prevent recalculation on every render
  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + Number(item.price) * (item.quantity || 1),
      0
    );
  }, [cart]);

  const shipping = useMemo(() => {
  if (cart.length === 0) return 0;

  return cart.reduce((sum, item) => {
    const cost = Number(item.fixedShippingCost || 0);
    return sum + cost;
  }, 0);
}, [cart]);
  const tax = 0; // static example
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping]);

  // ✅ Memoized handlers to prevent form re-renders
  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      dispatch(removeFromCart(itemToDelete.id));
      setItemToDelete(null);
    }
    setIsDialogOpen(false);
  }, [itemToDelete, dispatch]);

  const handleIncreaseQty = useCallback((itemId: string | number) => {
    dispatch(increaseQty(itemId));
  }, [dispatch]);

  const handleDecreaseQty = useCallback((itemId: string | number) => {
    dispatch(decreaseQty(itemId));
  }, [dispatch]);

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
        amount: Math.max(0, Math.round(total * 100)),
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    });

    let isMounted = true;

    pr.canMakePayment().then((result) => {
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
  }, [stripe, cart, total]);

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
    // setLatestOrder(orderData); // <-- save full response

    return orderData || null;
    },
    [buildOrderPayload]
  );

  // const handleOrderSuccess = useCallback(
  //   (orderId?: string | number | null) => {
  //     skipEmptyCartCheckRef.current = true;
  //     // console.log("Clearing cart after order successs" , orderId);
  //     // setLatestOrderId(orderId ? String(orderId) : null);
  //     dispatch(clearCart());
  //     setIsSuccessModalOpen(true);
  //     setIsProcessing(false);
  //   },
  //   [dispatch]
  // );

  const handleStripeCharge = useCallback(
    async (paymentMethodId: string) => {
      const stripePayload = {
        payment_method_id: paymentMethodId,
        products: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity || 1,
        })),
      };

        const response = await axiosInstance.post("web/stripe/pay", stripePayload);
        return response.data?.payment_intent_id || null;
    },
    [cart]
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
    const paymentIntentId = await handleStripeCharge(event.paymentMethod.id);

    if (!paymentIntentId) {
      event.complete("fail");
      toast.error("Failed to generate payment intent.");
      setIsProcessing(false);
      return;
    }

    const orderData = await placeOrder({
      ...pendingWalletForm,
      paymentIntentId
    });

    event.complete("success");

    // ✅ Save in Redux (lastOrder) and clear cart
    skipEmptyCartCheckRef.current = true; // agar aapka cart empty check logic hai
    dispatch(setLastOrder(orderData));
    dispatch(clearCart());

    // ✅ Redirect to order success
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
  }, [paymentRequest, pendingWalletForm, handleStripeCharge, placeOrder]);

  const onSubmit = async (data: CheckoutFormValues) => {
  const selectedPaymentMethod = data.paymentMethod || "credit_card";

  const requiresStripeCard = stripeCardMethods.includes(selectedPaymentMethod);
  const isWalletMethod = walletMethods.includes(selectedPaymentMethod);

  if (requiresStripeCard) {
    if (!cardCompletion.number || !cardCompletion.expiry || !cardCompletion.cvc) {
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
      toast.error("This wallet is not available on your devicesss.");
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

    // Stripe card flow
    if (requiresStripeCard) {
      if (!stripe || !elements) {
        toast.error("Payment service is not ready yet. Please try again.");
        setIsProcessing(false);
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        toast.error("Payment form is not ready. Please refresh and try again.");
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

    // Place order
    const orderData = await placeOrder({ ...data, paymentIntentId });
   skipEmptyCartCheckRef.current = true;
    // Save to Redux
    dispatch(setLastOrder(orderData));
    dispatch(clearCart());
    // Redirect
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
    <div className="min-h-screen py-10 px-[5%] md:px-[6%] lg:px-[7%] xl:px-0 2xl:px-0 xl:max-w-[1290px] 2xl:max-w-[1720px] mx-auto">
      {/* Heading + Subheading */}
      <div className="mb-8 text-center lg:text-left">
        <h1 className="h1-secondary-medium">Checkout</h1>
        <p className="h5-regular mt-2">
          Please enter your details below to complete your purchase
        </p>
      </div>

      {/* Payment Request Button (hidden, used for Apple/Google Pay) */}
      {paymentRequest && (
        <div className="hidden">
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* LEFT SECTION (Shipping Address) */}
          <div className="w-full xl:w-[100.1%] 2xl:w-[100%] mx-auto space-y-6">
            <div className="bg-white border rounded-md shadow-sm p-6">
              <h2 className="h3-secondary flex items-center gap-2 mb-4">
                <span className="w-[36px] h-[36px] flex items-center justify-center rounded-full border bg-[#F15939] border-red-600 text-white text-sm">
                  1
                </span>
                Shipping Address
              </h2>

              <div className="space-y-6">
              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="email" className="h5-regular mb-2">
                  Email <span className="text-[#F15939]">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  className={`w-full h-[60px] !max-w-full ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="firstName" className="h5-regular mb-2">
                    First Name <span className="text-[#F15939]">*</span>
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    className={`w-full h-[60px] !max-w-full ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="lastName" className="h5-regular mb-2">
                    Last Name <span className="text-[#F15939]">*</span>
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    className={`w-full h-[60px] !max-w-full ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Other Fields */}
              <div className="flex flex-col">
                <label htmlFor="company" className="h5-regular mb-2">
                  Company
                </label>
                <Input
                  id="company"
                  type="text"
                  className="w-full h-[60px] !max-w-full"
                  {...register("company")}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="h5-regular mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="text"
                  className="w-full h-[60px] !max-w-full"
                  {...register("phone")}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="address1" className="h5-regular mb-2">
                  Address Line 1 <span className="text-[#F15939]">*</span>
                </label>
                <Input
                  id="address1"
                  type="text"
                  className={`w-full h-[60px] !max-w-full ${
                    errors.address1 ? "border-red-500" : ""
                  }`}
                  {...register("address1", {
                    required: "Address Line 1 is required",
                  })}
                />
                {errors.address1 && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.address1.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="address2" className="h5-regular mb-2">
                  Address Line 2
                </label>
                <Input
                  id="address2"
                  type="text"
                  className="w-full h-[60px] !max-w-full"
                  {...register("address2")}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="city" className="h5-regular mb-2">
                  City <span className="text-[#F15939]">*</span>
                </label>
                <Input
                  id="city"
                  type="text"
                  className={`w-full h-[60px] !max-w-full ${
                    errors.city ? "border-red-500" : ""
                  }`}
                  {...register("city", {
                    required: "City is required",
                  })}
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Country */}
              <div className="flex flex-col">
                <label htmlFor="country" className="h5-regular mb-2">
                  Country <span className="text-[#F15939]">*</span>
                </label>
                <Controller
                  name="country"
                  defaultValue="US"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        className={`!w-full !h-[60px] !max-w-full ${
                          errors.country ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select your country *" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryList.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="state" className="h5-regular mb-2">
                  State/Province
                </label>
                <Input
                  id="state"
                  type="text"
                  className="w-full h-[60px] !max-w-full"
                  {...register("state")}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="zip" className="h5-regular mb-2">
                  Zip/Postcode <span className="text-[#F15939]">*</span>
                </label>
                <Input
                  id="zip"
                  type="text"
                  className={`w-full h-[60px] !max-w-full ${
                    errors.zip ? "border-red-500" : ""
                  }`}
                  {...register("zip", {
                    required: "Zip/Postcode is required",
                  })}
                />
                {errors.zip && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.zip.message}
                  </p>
                )}
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="billingSame"
                  {...register("billingSame")}
                  defaultChecked
                />
                <label
                  htmlFor="billingSame"
                  className="h6-regular !text-[#4A4A4A]"
                >
                  My Billing address is the same as my Shipping address
                </label>
              </div>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION (Shipping + Payment) */}
          <div className="w-full xl:w-[100.1%] 2xl:w-[100%] mx-auto space-y-6">
            {/* Shipping Method */}
            <div className="bg-white border rounded-md shadow-sm p-6">
              <h2 className="h3-secondary flex items-center gap-2 mb-4">
              <span className="w-[36px] h-[36px] flex items-center justify-center rounded-full border bg-[#F15939] text-white border-red-600 text-sm">
                2
              </span>
              Shipping Method
            </h2>

            <div className="space-y-3 py-3">
              <label className="flex flex-col gap-3 border rounded px-3 py-2 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    value="own_account"
                    {...register("shippingMethod", {
                      required: "Please select a shipping method",
                    })}
                    className="text-red-600"
                  />
                  <span className="h3-secondary">$00</span>
                </div>
                <div className="h5-regular">
                  Ship on my Company/Own shipping account (Add shipping account
                  in the comments box)
                </div>
              </label>

              <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4">
                <label className="flex flex-col items-center border rounded px-4 py-3 cursor-pointer flex-1 has-[:checked]:border-orange-500">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="fedex_economy"
                      {...register("shippingMethod", {
                        required: "Please select a shipping method",
                      })}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <Image
                      src="/checkouticon/fedex.png"
                      alt="FedEx"
                      width={74}
                      height={25}
                      className="object-contain"
                    />
                  </div>
                  <span className="mt-2 h3-secondary text-center">
                    $199.48 <br />
                    <span className="h5-regular">(International Economy)</span>
                  </span>
                </label>

                <label className="flex flex-col items-center border rounded px-4 py-3 cursor-pointer flex-1 has-[:checked]:border-orange-500">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="fedex_priority"
                      {...register("shippingMethod", {
                        required: "Please select a shipping method",
                      })}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <Image
                      src="/checkouticon/fedex.png"
                      alt="FedEx"
                      width={74}
                      height={25}
                      className="object-contain"
                    />
                  </div>
                  <span className="mt-2 h3-secondary text-center">
                    $239.91 <br />
                    <span className="h5-regular">(International Priority)</span>
                  </span>
                </label>
              </div>
              {errors.shippingMethod && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.shippingMethod.message}
                </p>
              )}

              <div className="mt-4">
                <label htmlFor="orderComment" className="h5-regular mb-4">
                  Order Comment
                </label>
                <Input
                  id="orderComment"
                  type="text"
                  className="w-full h-[60px] !max-w-full"
                  {...register("orderComment")}
                />
              </div>
            </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border rounded-md shadow-sm p-6">
              <h2 className="h3-secondary flex items-center gap-2 mb-4">
              <span className="w-[36px] h-[36px] flex items-center justify-center rounded-full border bg-[#F15939] border-red-600 text-white text-sm">
                3
              </span>
              Payment Method
            </h2>

            {/* Credit Card */}
            <label className="flex flex-col border rounded px-3 py-4 has-[:checked]:border-orange-500">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-2 py-3">
                  <input
                    type="radio"
                    value="credit_card"
                    {...register("paymentMethod", {
                      required: "Please select a payment method",
                    })}
                    checked={watchedPaymentMethod === "credit_card"}
                    onChange={() => handlePaymentSelection("credit_card")}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className="h3-secondary">Credit Card</span>
                </div>
                <Image
                  src="/checkouticon/card.png"
                  alt="Card"
                  width={207}
                  height={35}
                  className="object-contain"
                />
              </div>

              {stripeCardMethods.includes(watchedPaymentMethod) && (
                <div className="space-y-6 py-3">
                  {/* Card Number */}
                  <div>
                    <label className="h5-regular mb-4 block">
                      Credit Card Number <span className="text-[#F15939]">*</span>
                    </label>
                    <div className="border border-[#d1d0d4] rounded-md p-4 mt-3 hover:border-[#86848c] focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-300">
                      <CardNumberElement
                        onChange={(event) => {
                          setCardCompletion((prev) => ({
                            ...prev,
                            number: event.complete,
                          }));
                          setCardError(event.error?.message || null);
                        }}
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#333333",
                              fontFamily: "inherit",
                              "::placeholder": {
                                color: "#aab7c4",
                              },
                            },
                            invalid: {
                              color: "#fa755a",
                              iconColor: "#fa755a",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Expiration and CVC */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="flex flex-col w-full sm:w-1/2">
                      <label className="h5-regular mb-4 block">
                        Expiration <span className="text-[#F15939]">*</span>
                      </label>
                      <div className="border border-[#d1d0d4] rounded-md p-4 hover:border-[#86848c] focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-300">
                        <CardExpiryElement
                          onChange={(event) => {
                            setCardCompletion((prev) => ({
                              ...prev,
                              expiry: event.complete,
                            }));
                            setCardError(event.error?.message || null);
                          }}
                          options={{
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#333333",
                                fontFamily: "inherit",
                                "::placeholder": {
                                  color: "#aab7c4",
                                },
                              },
                              invalid: {
                                color: "#fa755a",
                                iconColor: "#fa755a",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full sm:w-1/2">
                      <label className="h5-regular mb-4 block">
                        CVC <span className="text-[#F15939]">*</span>
                      </label>
                      <div className="border border-[#d1d0d4] rounded-md p-4 hover:border-[#86848c] focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-300">
                        <CardCvcElement
                          onChange={(event) => {
                            setCardCompletion((prev) => ({
                              ...prev,
                              cvc: event.complete,
                            }));
                            setCardError(event.error?.message || null);
                          }}
                          options={{
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#333333",
                                fontFamily: "inherit",
                                "::placeholder": {
                                  color: "#aab7c4",
                                },
                              },
                              invalid: {
                                color: "#fa755a",
                                iconColor: "#fa755a",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
                  </p>
                  {cardError && (
                    <p className="text-sm text-red-500">{cardError}</p>
                  )}
                </div>
              )}
            </label>

            {/* Google Pay */}
            <label
              className={`flex flex-col mt-4 sm:flex-row items-center justify-between border rounded px-3 py-3 cursor-pointer w-full gap-3 has-[:checked]:border-orange-500 ${
                !walletSupport.googlePay ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  value="google_pay"
                  {...register("paymentMethod", {
                    required: "Please select a payment method",
                  })}
                  checked={watchedPaymentMethod === "google_pay"}
                  onChange={() => handlePaymentSelection("google_pay")}
                  className="text-orange-500 focus:ring-orange-500"
                  disabled={!walletSupport.googlePay}
                />
                <Image
                  src="/checkouticon/googlepay.png"
                  alt="Google Pay"
                  width={80}
                  height={25}
                  className="object-contain my-2"
                />
              </div>
              {walletSupport.googlePay ? (
                <Image
                  src="/checkouticon/card.png"
                  alt="Card"
                  width={133}
                  height={45}
                  className="object-contain"
                />
              ) : (
                <span className="text-xs text-gray-500">
                  Not available on this device
                </span>
              )}
            </label>

            {/* Apple Pay */}
            <label
              className={`flex flex-col mt-4 sm:flex-row items-center justify-between border rounded px-3 py-3 cursor-pointer w-full gap-3 has-[:checked]:border-orange-500 ${
                !walletSupport.applePay ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  value="apple_pay"
                  {...register("paymentMethod", {
                    required: "Please select a payment method",
                  })}
                  checked={watchedPaymentMethod === "apple_pay"}
                  onChange={() => handlePaymentSelection("apple_pay")}
                  className="text-orange-500 focus:ring-orange-500"
                  disabled={!walletSupport.applePay}
                />
                <Image
                  src="/checkouticon/Apple-icon.svg"
                  alt="Apple Pay"
                  width={70}
                  height={25}
                  className="object-contain my-1 h-13 w-16"
                />
              </div>
              {walletSupport.applePay ? (
                <Image
                  src="/checkouticon/card.png"
                  alt="Card"
                  width={133}
                  height={45}
                  className="object-contain"
                />
              ) : (
                <span className="text-xs text-gray-500">
                  Not available on this device
                </span>
              )}
            </label>

            {/* Affirm */}
            {/* <label className="flex flex-col mt-4 sm:flex-row items-center justify-between border rounded px-3 py-3 cursor-pointer w-full gap-3 has-[:checked]:border-orange-500">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  value="affirm"
                  {...register("paymentMethod", {
                    required: "Please select a payment method",
                  })}
                  checked={watchedPaymentMethod === "affirm"}
                  onChange={() => handlePaymentSelection("affirm")}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <Image
                  src="/checkouticon/affirm.png"
                  alt="Affirm"
                  width={80}
                  height={15}
                  className="object-contain mb-3.5"
                />
              </div>
              <span className="h5-regular">(Pay over time)</span>
            </label> */}
            {errors.paymentMethod && (
              <p className="text-sm text-red-500 mt-1">
                {errors.paymentMethod.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isProcessing || !stripe}
              className="!mt-4 w-full h-[57px] btn-primary !rounded-full !font-medium 2xl:text-[20px] xl:text-[15px] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "PLACE YOUR ORDER"}
            </button>
          </div>
        </div>

        {/* RIGHT SECTION (Order Summary) */}
        <div className="bg-white border rounded-md shadow-sm p-6 w-full xl:w-[100.1%] 2xl:w-[100%] mx-auto">
          <h2 className="h3-secondary flex items-center gap-2 mb-4">
            <span className="w-[36px] h-[36px] flex items-center justify-center rounded-full border bg-[#F15939] text-white border-red-600 text-sm">
              {cart.length}
            </span>
            Order Summary
          </h2>
          {/* Cart Items */}
          <div className="space-y-5">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={handleIncreaseQty}
                onDecrease={handleDecreaseQty}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
          {/* Totals */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between h5-regular">
              <span>Cart Subtotal</span> <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between h5-regular">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between h5-regular">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          {/* Discount Code */}
          <div className="mt-4 space-y-2">
            <label htmlFor="discountCode" className="h5-regular">
              Apply Discount Code
            </label>
            <div className="flex gap-2 my-2">
              <Input
                id="discountCode"
                type="text"
                className="h-[60px] !max-w-full "
              />
              <button className="h4-medium border border-black px-4 rounded">
                Apply
              </button>
            </div>
          </div>
          {/* Total */}
          <div className="mt-4 flex justify-between h3-secondary">
            <span>Order total</span> <span>${total.toFixed(2)}</span>{" "}
          </div>
        </div>
        </div>
      </form>
      {/* ShadCN Dialog for Delete Confirmation */}
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

       {/* <OrderSuccessModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
         data={latestOrder}
      /> */}

      {/* <Dialog open={isSuccessModalOpen} onOpenChange={handleSuccessModalChange}>
  <DialogContent className="sm:max-w-[380px] text-center py-8">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
      <svg
        className="h-10 w-10 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-gray-800">
        Thank You!
      </DialogTitle>
      <DialogDescription className="text-gray-600 mt-2">
        Your order has been placed successfully.<br />
        We appreciate your business.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog> */}

      {/* <Dialog open={isSuccessModalOpen} onOpenChange={handleSuccessModalChange}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <DialogHeader>
            <DialogTitle>Order Placed Successfully</DialogTitle>
            <DialogDescription>
              Thank you for your purchase. We&apos;ll take you back to the home page
              in just a moment.
              {latestOrderId && (
                <span className="block mt-3 font-semibold text-gray-800">
                  Order ID: {latestOrderId}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button className="!p-4 !text-lg" onClick={handleSuccessRedirect}>
              Go to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
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
