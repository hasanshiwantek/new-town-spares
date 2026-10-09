"use client";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useAlert } from "@/hooks/useAlert";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import axiosInstance from "@/lib/axiosInstance";
import { fetchOrderDetails } from "@/redux/slices/cartsSlice";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ReturnItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: any;
  isSubmit?: boolean;
  onSuccess?: () => void;
}

interface OrderData {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: string;
  shippingCost: string;
  billingInformation: {
    firstName: string;
    lastName: string;
    phone: string;
    companyName: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
  };
  products: Array<{
    id: number;
    name: string;
    sku: string;
    price: string;
    msrp: string;
    image: Array<{
      path: string;
      isPrimary: number;
      altText: string;
    }>;
  }>;
  shippingDestinations: Array<{
    address: {
      firstName: string;
      lastName: string;
      phone: string;
      companyName: string;
      addressLine1: string;
      addressLine2: string | null;
      city: string;
      state: string;
      zip: string;
      country: string;
      email: string;
    };
    products: Array<{
      productId: number;
      quantity: number;
      price: string;
    }>;
  }>;
}

const ReturnItemsModal: React.FC<ReturnItemsModalProps> = ({
  isOpen,
  onClose,
  orderId,
  isSubmit,
  onSuccess,
}) => {
  const [returnReason, setReturnReason] = useState("");
  const [returnAction, setReturnAction] = useState("");
  const [comments, setComments] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: number]: number;
  }>({});

  const dispatch = useAppDispatch();
  const formatPrice = useFormatPrice();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert, Alert } = useAlert();

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID not found");
        setLoading(false);
        return;
      }

      // Check if already returned
      if (isSubmit) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await dispatch(
          fetchOrderDetails({ orderId: orderId })
        ).unwrap();

        if (res?.order?.length > 0) {
          setOrder(res.order[0]);

          // Initialize selected quantities
          const initialQuantities: { [key: number]: number } = {};
          res.order[0].shippingDestinations[0]?.products?.forEach(
            (item: any) => {
              initialQuantities[item.productId] = item.quantity;
            }
          );
          setSelectedQuantities(initialQuantities);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadOrderDetails();
    }
  }, [orderId, isOpen, dispatch, isSubmit]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setReturnReason("");
      setReturnAction("");
      setComments("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuantityChange = (productId: number, quantity: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!returnReason) {
      showAlert({
        title: "Return Reason Required",
        message: "Please select a return reason.",
      });
      return;
    }
    setSubmitting(true);
    try {
      const returnData = {
        orderId: order?.id,
        reason: returnReason,
        returnAction,
        comments,
        isSubmit: true,
      };

      await axiosInstance.post("web/orders/return-order", returnData);

      onSuccess?.();
      onClose();
    } catch (err) {
      showAlert({
        title: "Return Request Failed",
        message: "Failed to submit return request. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Matches the account form styling (AccountForm.tsx)
  const inputClass =
    "w-full h-[42px] text-[14px] border border-[#ebebeb] rounded-[4px] bg-white text-[#333333] px-[14px] outline-none focus:border-[#999999] disabled:bg-[#f5f5f5] disabled:cursor-not-allowed";
  const labelClass =
    "flex items-center justify-between text-[14px] font-light text-[#333333] mb-[7px]";
  const primaryBtnClass =
    "h-[39px] px-[32px] rounded-[4px] bg-[#FF482E] text-white text-[14px] font-light hover:bg-[#e63e26] transition disabled:opacity-50 disabled:cursor-not-allowed";
  const RequiredTag = () => (
    <span className="text-[10px] font-light uppercase tracking-[0.5px] text-[#333333]">
      Required
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-[800px] rounded-[4px] shadow-lg max-h-[90vh] overflow-y-auto text-[#333333]">
        {/* Header */}
        <div className="flex justify-between items-center px-[21px] py-[14px] border-b border-[#ebebeb] sticky top-0 bg-white z-10">
          <h2 className="text-[20px] leading-[28px] font-normal">
            Return Items
            {order?.orderNumber && ` – Order #${order.orderNumber}`}
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="text-[#757575] hover:text-[#FF482E] transition disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-[21px]">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#ebebeb] border-t-[#FF482E] mb-4"></div>
              <p className="text-[14px] font-light">Loading order details...</p>
            </div>
          )}

          {/* Already Returned State */}
          {!loading && isSubmit && (
            <div className="border border-[#ebebeb] p-[28px] text-center">
              <p className="text-[16px] leading-[24px] mb-[7px]">
                Return Already Submitted
              </p>
              <p className="text-[14px] font-light mb-[21px]">
                You have already submitted a return request for this order.
              </p>
              <button onClick={onClose} className={primaryBtnClass}>
                Close
              </button>
            </div>
          )}

          {/* Error State */}
          {error && !loading && !isSubmit && (
            <div className="border border-[#ebebeb] p-[28px] text-center">
              <p className="text-[16px] leading-[24px] text-[#FF482E] mb-[7px]">
                Error Loading Order
              </p>
              <p className="text-[14px] font-light mb-[21px]">{error}</p>
              <button onClick={onClose} className={primaryBtnClass}>
                Close
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && !isSubmit && order && (
            <>
              {/* Items — table at >=801, label/value rows below */}
              <div className="border border-[#ebebeb]">
                <div className="hidden min-[801px]:grid grid-cols-12 border-b border-[#ebebeb] bg-[#f5f5f5] text-[13px] leading-[15.6px]">
                  <div className="col-span-7 p-[11px]">Item</div>
                  <div className="col-span-2 p-[11px] text-center">Price</div>
                  <div className="col-span-3 p-[11px] text-right">
                    Qty To Return
                  </div>
                </div>

                {order?.shippingDestinations[0]?.products?.map(
                  (item: any, index: number, arr: any[]) => {
                    const product = order.products.find(
                      (p: any) => p.id === item.productId
                    );

                    if (!product) return null;

                    return (
                      <div
                        key={item.productId}
                        className={`grid grid-cols-1 min-[801px]:grid-cols-12 items-center text-[14px] leading-[21px] ${index !== arr.length - 1 ? "border-b border-[#ebebeb]" : ""}`}
                      >
                        <div className="min-[801px]:col-span-7 p-[11px] flex justify-between gap-4 min-[801px]:block min-w-0">
                          <span className="min-[801px]:hidden text-[13px] shrink-0">
                            Item
                          </span>
                          <span className="text-right min-[801px]:text-left break-words">
                            <span className="font-medium">{product.sku}</span> |{" "}
                            {product.name}
                          </span>
                        </div>

                        <div className="min-[801px]:col-span-2 p-[11px] pt-0 min-[801px]:pt-[11px] flex justify-between min-[801px]:block min-[801px]:text-center">
                          <span className="min-[801px]:hidden text-[13px]">
                            Price
                          </span>
                          <span>{formatPrice(item.price)}</span>
                        </div>

                        <div className="min-[801px]:col-span-3 p-[11px] pt-0 min-[801px]:pt-[11px] flex justify-between items-center min-[801px]:justify-end">
                          <span className="min-[801px]:hidden text-[13px]">
                            Qty To Return
                          </span>
                          <select
                            value={selectedQuantities[item.productId] || 0}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.productId,
                                Number(e.target.value)
                              )
                            }
                            disabled={submitting}
                            className={`${inputClass} !w-[80px] !h-[36px] !px-[10px]`}
                          >
                            {Array.from(
                              { length: item.quantity + 1 },
                              (_, i) => i
                            ).map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Return Form */}
              <form onSubmit={handleSubmit} className="mt-[28px]">
                <div className="grid grid-cols-1 min-[551px]:grid-cols-2 gap-x-[21px] gap-y-[28px]">
                  <div className="space-y-[28px]">
                    <div>
                      <label htmlFor="returnReason" className={labelClass}>
                        <span>
                          Return Reason{" "}
                          <span className="text-red-500">*</span>
                        </span>
                        <RequiredTag />
                      </label>
                      <select
                        id="returnReason"
                        required
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        disabled={submitting}
                        className={inputClass}
                      >
                        <option value="">Select reason</option>
                        <option>Received Wrong Product</option>
                        <option>Wrong Product Order</option>
                        <option>Not Satisfied With The Product</option>
                        <option>There was a problem with the Product</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="returnAction" className={labelClass}>
                        Return Action
                      </label>
                      <select
                        id="returnAction"
                        value={returnAction}
                        onChange={(e) => setReturnAction(e.target.value)}
                        disabled={submitting}
                        className={inputClass}
                      >
                        <option value="">Select action</option>
                        <option>Repair</option>
                        <option>Replacement</option>
                        <option>Store Credit</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="returnComments" className={labelClass}>
                      Comments
                    </label>
                    <textarea
                      id="returnComments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      disabled={submitting}
                      className={`${inputClass} !h-[154px] py-[10px] resize-none`}
                      placeholder="Write your comments..."
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-[28px] flex flex-col-reverse min-[551px]:flex-row justify-end gap-[11px]">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="h-[39px] px-[32px] rounded-[4px] border border-[#333333] text-[#333333] text-[14px] font-light hover:border-[#FF482E] hover:text-[#FF482E] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`${primaryBtnClass} flex items-center justify-center gap-2`}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      "Submit Return Request"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <Alert />
    </div>
  );
};

export default ReturnItemsModal;
