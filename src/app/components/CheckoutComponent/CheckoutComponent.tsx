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
import axiosInstance, { baseURL } from "@/lib/axiosInstance";
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
import { Country, State, City } from "country-state-city";
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
import {
  resetMultiAddress,
  setIsMultiAddress,
} from "@/redux/slices/multiAddressSlice";
import {
  checkoutFormSave,
  fetchShippingRate,
  fetchShippingRates,
  getCheckoutForm,
  removeShippingRate,
  resetShippingRates,
} from "@/redux/slices/shippingSlice";
// Import step components
import CustomerStep from "./CustomerStep";
import ShippingStep from "./Shippingstep";
import BillingStep from "./Billingstep";
import PaymentStep from "./Paymentstep";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
// import CheckoutMultipleOrderSummary from "./CheckoutMultipleOrderSummary";
import { calculatePackage } from "./Shippingstep";
import {
  addCustomerAddress,
  fetchCustomerAddress,
} from "@/redux/slices/myaccountSlice";
import { fetchCartList, removeProducts } from "@/redux/slices/cartsSlice";
import CheckoutMultipleOrderSummary from "./CheckoutMultipleOrderSummary";

export const CHECKOUT_STORAGE_KEY = "checkoutFormData";
function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);

  return {
    firstName: parts.shift() || "",
    lastName: parts.join(" "),
  };
}
// Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51TTnoo8vkezGA3pyz8ekc5xIQNyhweCnxiumTB1si5Dejq5YWPGHDJIJPpBHMLw9hYRkbSkOGpdCzPrlW8g59HZ600cueNQymh",
);

// Pre-compute country list at module level
// const countryList = countries
//   .map((country) => ({
//     name: country.name.common,
//     code: country.cca2,
//   }))
//   .sort((a, b) => a.name.localeCompare(b.name));
const countryList = Country.getAllCountries().map((c) => ({
  name: c.name,
  code: c.isoCode,
}));

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
  addressLine1: string;
  addressLine2: string;

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
  newsletter?: boolean;

  //
  ipAddress: string;
  isSaveAddressForShipping?: boolean;
  isSaveAddressForBilling?: boolean;
}

// Inner component that uses Stripe hooks
const CheckoutForm = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state?.carts?.items);
  const { loading } = useAppSelector((state: RootState) => state?.carts);
  const auth = useAppSelector((state: RootState) => state?.auth);
  console.log("auth", auth);

  // ADD COUPON STATE FROM REDUX
  const { appliedCoupon, discountAmount } = useAppSelector(
    (state: RootState) => state.coupon,
  );
  const hasRestoredRef = useRef(false); // ✅ Sirf ek baar restore
  const isRestoringRef = useRef(true); // ✅ Initially true — restore chal raha hai

  const [promoCode, setPromoCode] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
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
  const {
    isMultiAddress,
    completedDestinations,
    destinations,
    destShippingRates,
  } = useAppSelector((state) => state.multiAddress);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const emptyCartWarningShownRef = useRef(false);
  const skipEmptyCartCheckRef = useRef(false);
  const user: any = localStorage.getItem("persist:auth");
  const parsedAuth = auth ? JSON.parse(user) : null;
  const token = parsedAuth?.token ? JSON.parse(parsedAuth.token) : null;
  const { shippingDetail, saveDetail } = useAppSelector(
    (state: any) => state.shippingZone,
  );

  useEffect(() => {
    if (!loading) {
      if (cart.length === 0) {
        if (skipEmptyCartCheckRef.current) {
          return;
        }

        if (!emptyCartWarningShownRef.current) {
          emptyCartWarningShownRef.current = true;
          toast.error("Please add something");

          // router.push("/cart");
        }
      } else {
        emptyCartWarningShownRef.current = false;
      }
    }
  }, [cart.length, router]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      paymentMethod: "credit_card",
      billingSame: isMultiAddress ? false : true,
      email: auth?.user?.email || "",
      firstName: auth?.user?.firstName || "",
      lastName: auth?.user?.lastName || "",
      company: auth?.user?.companyName || "",
      phone: auth?.user?.phone || "",
      state: auth?.user?.state || "",
      country: "",
      billingCountry: "",
      newsletter: false,
    },
  });
  const watchedCountry = watch("country");
  const watchedState = watch("state");

  const watchedPaymentMethod = watch("paymentMethod") || "credit_card";
  const watchedBillingSame = watch("billingSame");
  const stripeCardMethods = ["credit_card"];
  const walletMethods = ["google_pay", "apple_pay"];
  const { shippingRates } = useAppSelector((state) => state.shippingZone);
  const stateList = useMemo(() => {
    if (!watchedCountry) return [];
    return State.getStatesOfCountry(watchedCountry).map((s) => ({
      name: s.name,
      code: s.isoCode,
    }));
  }, [watchedCountry]);
  // ✅ State change hone pe cities
  const cityList = useMemo(() => {
    if (!watchedCountry || !watchedState) return [];
    return City.getCitiesOfState(watchedCountry, watchedState).map((c) => ({
      name: c.name,
    }));
  }, [watchedCountry, watchedState]);

  const watchedBillingCountry = watch("billingCountry");
  const watchedBillingState = watch("billingState");
  const watchedFirstName = watch("firstName");
  const watchedLastName = watch("lastName");
  const watchedCompany = watch("company");
  const watchedPhone = watch("phone");
  const watchedAddress1 = watch("address1");
  const watchedAddress2 = watch("address2");
  const watchedCity = watch("city");
  const watchedZip = watch("zip");
  const billingStateList = useMemo(() => {
    if (!watchedBillingCountry) return [];
    return State.getStatesOfCountry(watchedBillingCountry).map((s) => ({
      name: s.name,
      code: s.isoCode,
    }));
  }, [watchedBillingCountry]);

  const billingCityList = useMemo(() => {
    if (!watchedBillingCountry || !watchedBillingState) return [];
    return City.getCitiesOfState(
      watchedBillingCountry,
      watchedBillingState,
    ).map((c) => ({
      name: c.name,
    }));
  }, [watchedBillingCountry, watchedBillingState]);
  // 2. watchedShippingMethod add
  const watchedShippingMethod = watch("shippingMethod");
  // Memoized calculations
  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + Number(item.price) * (item.quantity || 1),
      0,
    );
  }, [cart]);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch("/api/detect-country"); // apna Next.js route
        const data = await res.json();
        if (data.country_code && !hasRestoredRef.current) {
          if (!hasRestoredRef.current) {
            setValue("country", data.country_code);
            setValue("state", data.state);

            setValue("billingCountry", data.country_code);
            setValue("billingState", data.state);
          }
        }
      } catch {
        if (!hasRestoredRef.current) {
          setValue("country", "US");
          setValue("billingCountry", "US");
        }
      }
    };
    const getShippingRates = async () => {
      try {
        await dispatch(fetchShippingRate({})).unwrap();
      } catch (err) {
        detectCountry();
      }
    };
    getShippingRates();
  }, [setValue]);

  useEffect(() => {
    if (shippingDetail?.country && !hasRestoredRef.current) {
      setValue("country", shippingDetail.country);
      setValue("state", shippingDetail.state);
      setValue("city", shippingDetail.city);
      setValue("zip", shippingDetail.zip);
    }
  }, [shippingDetail]);

  const shipping = useMemo(() => {
    if (isMultiAddress) {
      return destinations.reduce((sum, dest) => {
        if (!dest.selectedShippingMethod) return sum;

        // ✅ Per-dest rates check karo
        const destRates = destShippingRates[dest.id] || [];
        const globalRates = shippingRates || [];
        const allRates = destRates.length > 0 ? destRates : globalRates;

        const rate = allRates.find(
          (r: any) => r.service_type === dest.selectedShippingMethod,
        );

        if (!rate) {
          if (dest.selectedShippingMethod === "flat") return sum + 10;
          if (dest.selectedShippingMethod === "own") return sum + 0;
          return sum;
        }

        return sum + Number(rate.total_charge || 0);
      }, 0);
    }

    // Single address — existing logic
    if (watchedShippingMethod) {
      if (!shippingRates?.length) return 0;
      const selected = shippingRates.find(
        (rate: any) => rate.service_type === watchedShippingMethod,
      );
      return selected ? Number(selected.total_charge) : 0;
    }
    // ✅ Cart page se localStorage mein saved cost
    if (typeof window !== "undefined") {
      const savedCost = Number(shippingDetail?.rate?.total_charge);
      if (savedCost) return Number(savedCost);
    }

    if (cart.length === 0) return 0;
    return cart.reduce(
      (sum, item) => sum + Number(item.fixedShippingCost || 0),
      0,
    );
  }, [
    isMultiAddress,
    destinations,
    destShippingRates,
    watchedShippingMethod,
    shippingRates,
    cart,
    shippingDetail,
  ]);

  const tax = 0;

  // Total before discount
  const totalBeforeDiscount = useMemo(
    () => subtotal + shipping + tax,
    [subtotal, shipping],
  );

  // Final total after discount
  const finalTotal = useMemo(
    () => Math.max(totalBeforeDiscount - discountAmount, 0),
    [totalBeforeDiscount, discountAmount],
  );

  // ADD COUPON HANDLERS
  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      await dispatch(
        applyCoupon({ couponCode: promoCode, total: totalBeforeDiscount }),
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
    [dispatch],
  );

  const handleDecreaseQty = useCallback(
    (itemId: string | number) => {
      dispatch(decreaseQty(itemId));
    },
    [dispatch],
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
    [setValue, setCardCompletion, setCardError],
  );

  useEffect(() => {
    if (!stripe || cart.length === 0) {
      setPaymentRequest(null);
      setWalletSupport({ applePay: false, googlePay: false });
      return;
    }

    // const pr = stripe.paymentRequest({
    //   country: "US",
    //   currency: "usd",
    //   total: {
    //     label: "Order Total",
    //     amount: Math.max(0, Math.round(finalTotal * 100)), // USE finalTotal
    //   },
    //   requestPayerName: true,
    //   requestPayerEmail: true,
    //   requestPayerPhone: true,
    // });

    // const pr = stripe.paymentRequest({
    //   country: "US",
    //   currency: "usd",

    //   total: {
    //     label: "Order Total",
    //     amount: Math.max(0, Math.round(finalTotal * 100)),
    //   },

    //   requestPayerName: true,
    //   requestPayerEmail: true,
    //   requestPayerPhone: true,

    //   requestShipping: true,
    // });
    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Test",
        amount: 100,
      },
    });
    pr.on("shippingaddresschange", async (event) => {
      try {
        const response = await fetch(
          `${baseURL}web/checkout/get-shipping-rates`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              destination: {
                state: event.shippingAddress.region,
                country_code: event.shippingAddress.country,
                postal_code: event.shippingAddress.postalCode,
              },

              package: {
                total_weight: calculatePackage(cart).total_weight,
                weight_unit: "LB",
                order_total: finalTotal,
                item_count: calculatePackage(cart).item_count,
                package_value: finalTotal,
              },
            }),
          },
        );

        const data = await response.json();

        if (!data.success || !data.rates?.length) {
          event.updateWith({
            status: "invalid_shipping_address",
          });

          return;
        }

        event.updateWith({
          status: "success",

          shippingOptions: data.rates.map((rate: any) => ({
            id: String(rate.method_id),
            label: rate.display_name,
            detail: rate.display_name,
            amount: Math.round(Number(rate.total_charge) * 100),
          })),
        });
      } catch (err) {
        event.updateWith({
          status: "fail",
        });
      }
    });

    pr.on("shippingoptionchange", (event) => {
      const shippingCost = Number(event.shippingOption.amount || 0);

      event.updateWith({
        status: "success",

        total: {
          label: "Order Total",
          amount: Math.round(finalTotal * 100) + shippingCost,
        },
      });
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
        setWalletSupport({ applePay: true, googlePay: true });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [stripe, cart, finalTotal]); // DEPENDENCY: finalTotal instead of total
  const getDeviceType = () => {
    if (typeof window === "undefined") return "Server Blink (Desktop)";

    const userAgent = navigator.userAgent;

    if (/mobile/i.test(userAgent)) return "Server Blink (Mobile)";
    if (/tablet/i.test(userAgent)) return "Server Blink (Tablet)";

    return "Server Blink (Desktop)";
  };

  // const buildOrderPayload = useCallback(
  //   (data: CheckoutFormValues & { paymentIntentId?: string | null }) => ({
  //     userType: token ? null : "guest",
  //     deviceType: getDeviceType(),
  //     firstName: data.firstName,
  //     lastName: data.lastName,
  //     companyName: data.company || "",
  //     email: data.email,
  //     phone: data.phone || "",
  //     addressLine1: data.address1,
  //     addressLine2: data.address2 || "",
  //     city: data.city,
  //     state: data.state || "",
  //     zip: data.zip,
  //     country: data.country,
  //     paymentMethod: data.paymentMethod,
  //     shippingMethod: data.shippingMethod,
  //     discountAmount: discountAmount ? finalTotal : 0,
  //     shippingCost: shipping,
  //     comments: data.orderComment || "",
  //     paymentIntentId: data.paymentIntentId ?? "",
  //     products: cart.map((item) => ({
  //       product_id: item.id,
  //       quantity: item.quantity || 1,
  //     })),
  //   }),
  //   [cart, shipping]
  // );

  const buildOrderPayload = useCallback(
    (data: CheckoutFormValues & { paymentIntentId?: string | null }) => {
      // ✅ Multi address mode
      if (isMultiAddress && destinations.length > 0) {
        return {
          userType: token ? null : "guest",
          deviceType: getDeviceType(),
          ipAddress: ipAddress,
          email: data.email,
          paymentMethod: data.paymentMethod == "credit_card" ? "Credit Card (Via Stripe)" : data.paymentMethod == "apple_pay" ? "Apple Pay" : "Google Pay",
          discountAmount: discountAmount,
          couponCode: appliedCoupon?.couponCode,
          shippingCost: shipping,
          comments: data.orderComment || "",
          paymentIntentId: data.paymentIntentId ?? "",
          newsletter: data.newsletter || false,
          // ✅ Multi destination array
          isMultiAddress: true,
          destinations: destinations.map((dest) => {
            // Per dest allocated products
            const allocatedProducts: Record<string, number> = {};
            dest.allocatedItems?.forEach((slot) => {
              const itemId = slot.split("-")[0];
              allocatedProducts[itemId] = (allocatedProducts[itemId] || 0) + 1;
            });

            // Per dest shipping rate
            const destRates = destShippingRates[dest.id] || [];
            const allRates =
              destRates.length > 0 ? destRates : shippingRates || [];
            const selectedRate = allRates.find(
              (r: any) => r.service_type === dest.selectedShippingMethod,
            );

            return {
              firstName: dest.address?.firstName || "",
              lastName: dest.address?.lastName || "",
              companyName: dest.address?.company || "",
              phone: dest.address?.phone || "",
              addressLine1: dest.address?.address1 || "",
              addressLine2: dest.address?.address2 || "",
              city: dest.address?.city || "",
              state: dest.address?.state || "",
              zip: dest.address?.zip || "",
              country: dest.address?.country || "",
              shippingMethod: dest.selectedShippingMethod,
              shippingData: shippingRates.find((item) => item?.service_type == dest.selectedShippingMethod),
              shippingCost: selectedRate
                ? Number(selectedRate.total_charge)
                : 0,
              products: Object.entries(allocatedProducts).map(
                ([productId, quantity]) => ({
                  product_id: Number(productId),
                  quantity,
                }),
              ),
            };
          }),
        };
      }

      // ✅ Single address — existing logic
      return {
        userType: token ? null : "guest",
        deviceType: getDeviceType(),
        ipAddress: ipAddress,
        isSaveAddressForShipping: data?.isSaveAddressForShipping,
        isSaveAddressForBilling: data?.isSaveAddressForBilling,
        billingSame: data?.billingSame,
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
        paymentMethod: data.paymentMethod == "credit_card" ? "Credit Card (Via Stripe)" : data.paymentMethod == "apple_pay" ? "Apple Pay" : "Google Pay",
        shippingMethod: data.shippingMethod,
        shippingData: shippingRates.find((item) => item?.service_type == data.shippingMethod),
        discountAmount: discountAmount,
        couponCode: appliedCoupon?.couponCode,
        shippingCost: shipping,
        comments: data.orderComment || "",
        newsletter: data.newsletter || false,
        paymentIntentId: data.paymentIntentId ?? "",
        isMultiAddress: false,
        products: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity || 1,
        })),
      };
    },
    [
      cart,
      shipping,
      isMultiAddress,
      destinations,
      destShippingRates,
      shippingRates,
      discountAmount,
      finalTotal,
      token,
    ],
  );
  const placeOrder = useCallback(
    async (data: CheckoutFormValues) => {
      const orderPayload = buildOrderPayload(data);
      const orderResponse = await axiosInstance.post(
        "web/orders/place-order",
        orderPayload,
      );
      const orderData = orderResponse.data?.data || orderResponse.data;
      dispatch(fetchShippingRate({}));
      // localStorage.removeItem("shippingCost"); // ✅ Clear saved shipping cost after order is placed
      return orderData || null;
    },
    [buildOrderPayload],
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
        stripePayload,
      );
      return response.data?.payment_intent_id || null;
    },
    [cart, finalTotal], // ADD finalTotal as dependency
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
          event.paymentMethod.id,
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
        const orderNumber = orderData?.[0]?.orderNumber;
        const productIds = cart.map((item) => item.id);

        dispatch(
          removeProducts({
            product_ids: productIds,
          }),
        );

        dispatch(removeShippingRate());
        dispatch(fetchShippingRate({}));
        dispatch(setLastOrder(orderData));
        dispatch(clearCart());
        dispatch(removeCoupon());
        dispatch(resetMultiAddress()); // ✅ ADD
        dispatch(resetShippingRates()); // ✅ ADD
        dispatch(setIsMultiAddress(false));
        dispatch(fetchCartList());
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);
        router.push(`/checkout/order-information/${orderNumber}`);
      } catch (err: any) {
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
  // const handleContinueToShipping = async () => {
  //   const isValid = await trigger(["email", "newsletter"]);
  //   if (isValid) {
  //     setCompletedSteps((prev) => [...new Set([...prev, 1])]);
  //     setCurrentStep(2);
  //   }
  // };
  const handleContinueToShipping = async () => {
    const isValid = await trigger(["email", "newsletter"]);
    if (isValid) {
      const email = getValues("email");
      const newsletter = getValues("newsletter");

      // API call - apni endpoint laga lo
      // try {
      //   await fetch("/api/checkout/customer", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ email, newsletter: !!newsletter }),
      //   });
      // } catch (error) {
      //
      // }
      setCompletedSteps((prev) => [...new Set([...prev, 1])]);
      setCurrentStep(2);
    }
  };

  const handleContinueToBilling = async () => {
    if (!shippingRates || shippingRates?.length === 0) {
      setError("shippingMethod", {
        type: "manual",
        message: "Please select a shipping method",
      });

      return;
    }
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
      if (watchedBillingSame && !isMultiAddress) {
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
    // ✅ Rates re-fetch karo current form values se
    const currentCity = getValues("city");
    const currentCountry = getValues("country");
    const currentState = getValues("state");
    const currentZip = getValues("zip");

    if (currentCountry && currentState && currentZip && cart?.length) {
      dispatch(
        fetchShippingRates({
          data: {
            destination: {
              country_code: currentCountry,
              state: currentState,
              postal_code: currentZip,
              ...(currentCity?.trim() && { city: currentCity.trim() }),
            },
            package: calculatePackage(cart),
          },
        }),
      );
    }
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
        `${methodName} is not available. Please use a supported device/browser or try credit card payment.`,
      );
      return;
    }

    const formData = watch();
    setPendingWalletForm(formData as CheckoutFormValues);
    setIsProcessing(true);

    try {
      paymentRequest.show();
    } catch (err: any) {
      const methodName = method === "apple_pay" ? "Apple Pay" : "Google Pay";
      toast.error(
        `Could not open ${methodName}. Please ensure you have a card set up in your wallet or try credit card payment.`,
      );
      setIsProcessing(false);
      setPendingWalletForm(null);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    const selectedPaymentMethod = data.paymentMethod || "credit_card";

    const requiresStripeCard = stripeCardMethods.includes(
      selectedPaymentMethod,
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
            "Payment form is not ready. Please refresh and try again.",
          );
          setIsProcessing(false);
          return;
        }

        const { error: pmError, paymentMethod } =
          await stripe.createPaymentMethod({
            type: "card",
            card: cardNumberElement,
            billing_details: {
              name: `${data.billingFirstName} ${data.billingLastName}`,
              email: data.email,
              phone: data.billingPhone,
              address: {
                line1: data.billingAddress1,
                line2: data.billingAddress2,
                city: data.billingCity,
                state: data.billingState,
                postal_code: data.billingZip,
                country: data.billingCountry,
              },
            },
          });

        if (pmError) {
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
      const orderNumber = orderData?.[0]?.orderNumber;
      const orderDetail = orderData?.[0];
      skipEmptyCartCheckRef.current = true;
      const productIds = cart.map((item) => item.id);

      if (auth?.user?.id) {
        if (orderDetail?.isSaveAddressForBilling) {
          const splitNameRes = splitName(orderDetail?.billingAddress?.name);
          const billingAddress = {
            ...splitNameRes,
            companyName: orderDetail?.billingAddress?.companyName,
            phoneNumber: orderDetail?.billingAddress?.phone,
            addressLine1: orderDetail?.billingAddress?.addressLine1,
            addressLine2: orderDetail?.billingAddress?.addressLine2,
            city: orderDetail?.billingAddress?.city,
            state: orderDetail?.billingAddress?.state,
            zip: orderDetail?.billingAddress?.zip,
            country: orderDetail?.billingAddress?.country,
          };
          dispatch(
            addCustomerAddress({
              id: auth?.user?.id,
              data: billingAddress,
            }),
          );
        }

        if (orderDetail?.isSaveAddressForShipping) {
          const shippingAddress = {
            firstName: orderDetail?.billingInformation?.firstName,
            lastName: orderDetail?.billingInformation?.firstName,
            companyName: orderDetail?.billingInformation?.companyName,
            phoneNumber: orderDetail?.billingInformation?.phone,
            addressLine1: orderDetail?.billingInformation?.addressLine1,
            addressLine2: orderDetail?.billingInformation?.addressLine2,
            city: orderDetail?.billingInformation?.city,
            state: orderDetail?.billingInformation?.state,
            zip: orderDetail?.billingInformation?.zip,
            country: orderDetail?.billingInformation?.country,
          };
          dispatch(
            addCustomerAddress({
              id: auth?.user?.id,
              data: shippingAddress,
            }),
          );
        }
      }

      dispatch(
        removeProducts({
          product_ids: productIds,
        }),
      );
      dispatch(removeShippingRate());
      dispatch(fetchShippingRate({}));
      dispatch(setLastOrder(orderData));
      dispatch(clearCart());
      dispatch(removeCoupon());
      dispatch(resetMultiAddress());
      dispatch(resetShippingRates());
      dispatch(setIsMultiAddress(false));
      dispatch(fetchCartList());
      localStorage.removeItem(CHECKOUT_STORAGE_KEY);
      router.push(`/checkout/order-information/${orderNumber}`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while processing your order.";

      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  // watchedBillingSame ke saath useEffect add karo
  useEffect(() => {
    if (isRestoringRef.current) return;
    if (watchedBillingSame && !isMultiAddress) {
      if (!watchedFirstName && !watchedAddress1) return; // Guard

      setValue("billingFirstName", watchedFirstName);
      setValue("billingLastName", watchedLastName);
      setValue("billingCompany", watchedCompany);
      setValue("billingPhone", watchedPhone);
      setValue("billingAddress1", watchedAddress1);
      setValue("billingAddress2", watchedAddress2);
      setValue("billingCity", watchedCity);
      setValue("billingState", watchedState);
      setValue("billingCountry", watchedCountry);
      setValue("billingZip", watchedZip);
      setCompletedSteps((prev) => [...new Set([...prev, 3])]);
    } else if (!watchedBillingSame) {
      if (isRestoringRef.current) return;
      setValue("billingFirstName", "");
      setValue("billingLastName", "");
      setValue("billingCompany", "");
      setValue("billingPhone", "");
      setValue("billingAddress1", "");
      setValue("billingAddress2", "");
      setValue("billingCity", "");
      setValue("billingZip", "");
      // setCompletedSteps((prev) => prev.filter((s) => s !== 3));
    }
  }, [
    watchedBillingSame,
    watchedState,
    watchedCountry,
    watchedFirstName,
    watchedLastName,
    watchedZip,
    watchedAddress2,
    watchedAddress1,
    watchedCompany,
    watchedPhone,
    watchedCity,
  ]);

  const isInitialLoad = useRef(true);
  const isRestored = useRef(false); // ✅ NEW
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const restoreData = async () => {
      try {
        const result = await dispatch(getCheckoutForm()).unwrap();
        const apiData = result?.data;

        if (apiData?.shipping_form_data) {
          const shipping = apiData.shipping_form_data;
          const billing = apiData.billing_form_data;

          if (
            shipping.city &&
            shipping.country &&
            shipping.zip &&
            shipping.state &&
            cart?.length
          ) {
            dispatch(
              fetchShippingRates({
                data: {
                  destination: {
                    country_code: shipping.country,
                    state: shipping.state,
                    postal_code: shipping.zip,
                    city: shipping.city,
                  },
                  package: calculatePackage(cart),
                },
              }),
            );
          }
          // ✅ Shipping fields restore
          const shippingFields: (keyof CheckoutFormValues)[] = [
            "email",
            "firstName",
            "lastName",
            "company",
            "phone",
            "address1",
            "address2",
            "city",
            "country",
            "state",
            "zip",
            "newsletter",
            "shippingMethod",
            "billingSame",
            "orderComment",
          ];
          shippingFields.forEach((field) => {
            const val = (shipping as any)[field];
            if (val !== undefined && val !== "") {
              setValue(field, val);
            }
          });
          setValue("isSaveAddressForShipping", false);

          // ✅ Billing fields restore
          if (billing) {
            const billingFields: (keyof CheckoutFormValues)[] = [
              "billingFirstName",
              "billingLastName",
              "billingCompany",
              "billingPhone",
              "billingAddress1",
              "billingAddress2",
              "billingCity",
              "billingCountry",
              "billingState",
              "billingZip",
            ];
            billingFields.forEach((field) => {
              const val = (billing as any)[field];
              if (val !== undefined && val !== "") {
                setValue(field, val);
              }
            });
          }

          // ✅ Steps restore — same place mein, data available hai
          if (!hasRestoredRef.current) {
            hasRestoredRef.current = true;

            const customerComplete = !!shipping.email;
            const shippingComplete =
              !!shipping.firstName &&
              !!shipping.lastName &&
              !!shipping.address1 &&
              !!shipping.city &&
              !!shipping.country &&
              !!shipping.zip &&
              !!shipping.shippingMethod;

            const billingComplete =
              !!billing?.billingFirstName &&
              !!billing?.billingLastName &&
              !!billing?.billingAddress1 &&
              !!billing?.billingCity &&
              !!billing?.billingCountry &&
              !!billing?.billingZip;

            // const billingDone =
            //   shipping.billingSame === true ||
            //   shipping.billingSame === "true" ||  // ← string check
            //   billingComplete;

            const billingDone =
              Boolean(shipping?.billingSame) || billingComplete;

            setCompletedSteps([
              ...(customerComplete ? [1] : []),
              ...(shippingComplete ? [2] : []),
              ...(shippingComplete && billingDone ? [3] : []),
            ]);

            setCurrentStep(
              shippingComplete
                ? billingDone
                  ? 4
                  : 3
                : customerComplete
                  ? 2
                  : 1,
            );
          }
        }
      } catch (e) {
      } finally {
        isRestored.current = true;
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 500);
      }
    };

    restoreData();
  }, [dispatch, setValue, cart]);
  // ✅ Save to localStorage on form changes (debounced)
  const watchedValues = watch();
  useEffect(() => {
    // ✅ Restore complete hone tak save mat karo
    if (!isRestored.current) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      const shippingFormData = {
        email: watchedValues.email || "",
        firstName: watchedValues.firstName || "",
        lastName: watchedValues.lastName || "",
        company: watchedValues.company || "",
        phone: watchedValues.phone || "",
        address1: watchedValues.address1 || "",
        address2: watchedValues.address2 || "",
        city: watchedValues.city || "",
        country: watchedValues.country || "",
        state: watchedValues.state || "",
        zip: watchedValues.zip || "",
        newsletter: watchedValues.newsletter || false,
        shippingMethod: watchedValues.shippingMethod || "",
        billingSame: watchedValues.billingSame || false,
        orderComment: watchedValues.orderComment || "",
      };

      // ✅ Shipping guard — pehle check karo
      const hasShippingData = !!(
        watchedValues.firstName &&
        watchedValues.email &&
        watchedValues.address1
      );

      if (!hasShippingData) {
        return;
      }

      // ✅ billingSame true → shipping se copy karo
      // billingSame false → actual billing values use karo (sirf agar filled hain)
      const billingFormData = watchedValues.billingSame
        ? {
          billingFirstName: watchedValues.firstName || "",
          billingLastName: watchedValues.lastName || "",
          billingCompany: watchedValues.company || "",
          billingPhone: watchedValues.phone || "",
          billingAddress1: watchedValues.address1 || "",
          billingAddress2: watchedValues.address2 || "",
          billingCity: watchedValues.city || "",
          billingCountry: watchedValues.country || "",
          billingState: watchedValues.state || "",
          billingZip: watchedValues.zip || "",
        }
        : {
          billingFirstName: watchedValues.billingFirstName || "",
          billingLastName: watchedValues.billingLastName || "",
          billingCompany: watchedValues.billingCompany || "",
          billingPhone: watchedValues.billingPhone || "",
          billingAddress1: watchedValues.billingAddress1 || "",
          billingAddress2: watchedValues.billingAddress2 || "",
          billingCity: watchedValues.billingCity || "",
          billingCountry: watchedValues.billingCountry || "",
          billingState: watchedValues.billingState || "",
          billingZip: watchedValues.billingZip || "",
        };

      dispatch(
        checkoutFormSave({ data: { shippingFormData, billingFormData } }),
      );
    }, 800);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [
    watchedValues,
    completedSteps,
    currentStep,
    isMultiAddress,
    destinations,
    completedDestinations,
    destShippingRates,
    cart,
  ]);
  const handleShippingAddressSelect = useCallback(
    (selected: any) => {
      setValue("firstName", selected.firstName || "");
      setValue("lastName", selected.lastName || "");
      setValue("company", selected.companyName || "");
      setValue("phone", selected.phone || "");
      setValue("address1", selected.addressLine1 || "");
      setValue("address2", selected.addressLine2 || "");
      setValue("city", selected.city || "");
      setValue("country", selected.country || "");
      setValue("state", selected.state || "");
      setValue("zip", selected.zip || "");
    },
    [setValue],
  );
  const handleBillingAddressSelect = useCallback(
    (selected: any) => {
      setValue("billingFirstName", selected.firstName || "");
      setValue("billingLastName", selected.lastName || "");
      setValue("billingCompany", selected.companyName || "");
      setValue("billingPhone", selected.phone || "");
      setValue("billingAddress1", selected.addressLine1 || "");
      setValue("billingAddress2", selected.addressLine2 || "");
      setValue("billingCity", selected.city || "");
      setValue("billingCountry", selected.country || "");
      setValue("billingState", selected.state || "");
      setValue("billingZip", selected.zip || "");
    },
    [setValue],
  );
  const billingInfoMemo = useMemo(
    () => ({
      firstName: watch("billingFirstName"),
      lastName: watch("billingLastName"),
      address: watch("billingAddress1"),
      city: watch("billingCity"),
      state: watch("billingState"),
      country: watch("billingCountry"),
      zip: watch("billingZip"),
      company: watch("billingCompany"),
      address1: watch("billingAddress1"),
      address2: watch("billingAddress2"),
      phone: watch("billingPhone"),
    }),
    [
      watchedValues.billingFirstName,
      watchedValues.billingLastName,
      watchedValues.billingAddress1,
      watchedValues.billingCity,
      watchedValues.billingState,
      watchedValues.billingCountry,
      watchedValues.billingZip,
      watchedValues.billingCompany,
      watchedValues.billingAddress2,
      watchedValues.billingPhone,
    ],
  );
  const shippingInfoMemo = useMemo(
    () => ({
      firstName: watchedValues.firstName,
      lastName: watchedValues.lastName,
      address: watchedValues.address1,
      address1: watchedValues.address1,
      address2: watchedValues.address2,
      city: watchedValues.city,
      state: watchedValues.state,
      country: watchedValues.country,
      zip: watchedValues.zip,
      company: watchedValues.company,
      phone: watchedValues.phone,
    }),
    [
      watchedValues.firstName,
      watchedValues.lastName,
      watchedValues.address1,
      watchedValues.address2,
      watchedValues.city,
      watchedValues.state,
      watchedValues.country,
      watchedValues.zip,
      watchedValues.company,
      watchedValues.phone,
    ],
  );
  //  const auth = useAppSelector((state: RootState) => state?.auth);
  // Pass karo

  useEffect(() => {
    fetch("/api/get-ip")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip));
  }, []);

  useEffect(() => {
    if (auth?.isAuthenticated) {
      dispatch(fetchCustomerAddress());
    }
  }, [auth?.isAuthenticated]);

  return (
    <div className="min-h-screen py-10md:px-[6%]  xl:px-0 2xl:px-0   w-full max-w-[1170px] mx-auto px-4 lg:px-0 ">
      {paymentRequest && (
        <div>
          {paymentRequest && (
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
              }}
            />
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION - Multi-step form */}
          <div className="lg:col-span-2 space-y-0">
            {/* STEP 1: Customer */}
            {/* STEP 1: Customer */}
            <div
              className={`p-6 border-b-[1px]  items-center  border-b-[#8b8b8b] ${currentStep >= 2 ? "flex gap-10" : "block"}`}
            >
              <h2
                className={`hidden md:flex text-[1.92308rem] font-normal mb-2 text-[#545454] `}
              >
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
            <div
              className={`p-6 border-b-[1px]  items-center border-b-[#8b8b8b] ${currentStep >= 3 ? "flex gap-10" : "block"}`}
            >
              <h2 className="hidden md:flex text-[25px] font-normal mt-6 mb-6 text-[#545454]">
                Shipping
              </h2>
              <ShippingStep
                register={register}
                errors={errors}
                control={control}
                setValue={setValue}
                onContinue={handleContinueToBilling}
                countryList={countryList}
                stateList={stateList}
                cityList={cityList}
                isActive={currentStep === 2}
                isCompleted={completedSteps.includes(2)}
                onEdit={handleEditShipping}
                onAddressSelect={handleShippingAddressSelect}
                // shippingInfo={{
                //   firstName: watch("firstName"),
                //   lastName: watch("lastName"),
                //   address: watch("address1"),
                //   city: watch("city"),
                //   state: watch("state"),
                //   country: watch("country"),
                //   zip: watch("zip"),

                //   company: watch("company"),
                //   address1: watch("address1"),
                //   address2: watch("address2"),
                //   phone: watch("phone"),
                // }}
                shippingInfo={shippingInfoMemo}
                watchedShippingMethod={watchedShippingMethod}
              />
            </div>

            {/* STEP 3: Billing */}
            <div
              className={`p-6 border-b-[1px]  items-center border-b-[#8b8b8b] ${currentStep >= 4 ? "flex gap-16" : "block"}`}
            >
              <h2 className="hidden md:flex text-[1.92308rem] font-normal mb-4 text-[#545454]">
                Billing
              </h2>
              <BillingStep
                register={register}
                errors={errors}
                control={control}
                setValue={setValue}
                onContinue={handleContinueToPayment}
                countryList={countryList}
                stateList={billingStateList}
                cityList={billingCityList}
                isActive={currentStep === 3}
                isCompleted={completedSteps.includes(3)}
                onEdit={handleEditBilling}
                onAddressSelect={handleBillingAddressSelect}
                billingInfo={billingInfoMemo}
              // billingInfo={{
              //   firstName: watch("billingFirstName"),
              //   lastName: watch("billingLastName"),
              //   address: watch("billingAddress1"),
              //   city: watch("billingCity"),
              //   state: watch("billingState"),
              //   country: watch("billingCountry"),
              //   zip: watch("billingZip"),

              //   company: watch("billingCompany"),
              //   address1: watch("billingAddress1"),
              //   address2: watch("billingAddress2"),
              //   phone: watch("billingPhone"),
              // }}
              />
            </div>

            {/* STEP 4: Payment */}
            {cart?.length > 0 && (
              <div className="p-6  border-b-[1px] border-b-[#8b8b8b]">
                <h2 className="text-[1.92308rem] font-normal mb-4 text-[#545454]">
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
            )}
          </div>

          {/* RIGHT SECTION - Order Summary */}
          {!isMultiAddress ? (
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
          ) : (
            <CheckoutMultipleOrderSummary
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

          )}
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
