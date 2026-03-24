"use client";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import axiosInstance from "@/lib/axiosInstance";
import { fetchOrderDetails } from "@/redux/slices/cartSlice";
import React, { useEffect, useState } from "react";

interface ReturnItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: any;
  isSubmit?: boolean;
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
}) => {
  const [returnReason, setReturnReason] = useState("");
  const [returnAction, setReturnAction] = useState("");
  const [comments, setComments] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: number]: number;
  }>({});

  const dispatch = useAppDispatch();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        console.error(err);
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
      alert("Please select a return reason");
      return;
    }
    setSubmitting(true);
    try {
      const returnData = {
        orderId: order?.id,
        reason:returnReason,
        returnAction,
        comments,
        isSubmit:true,
      };

      console.log("Return Request Data:", returnData);

      const response = await axiosInstance.post("web/orders/return-order", 
         returnData
      );


        console.log("Return Request Response:", response.data);
      onClose();
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit return request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-4 md:px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl md:text-2xl font-bold">
            Return Items
            {order?.orderNumber && ` – #${order.orderNumber}`}
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-2xl text-gray-500 hover:text-black disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          )}

          {/* Already Returned State */}
          {!loading && isSubmit && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <svg
                  className="h-10 w-10 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-yellow-800 text-xl font-semibold mb-2">
                Return Already Submitted
              </p>
              <p className="text-gray-700 mb-6">
                You have already submitted a return request for this order.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold"
              >
                Close
              </button>
            </div>
          )}

          {/* Error State */}
          {error && !loading && !isSubmit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 text-lg font-medium mb-2">
                Error Loading Order
              </p>
              <p className="text-gray-700 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Close
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && !isSubmit && order && (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-gray-300 mb-6">
                <div className="col-span-6 text-lg font-semibold">Item</div>
                <div className="col-span-3 text-lg font-semibold text-center">
                  Price
                </div>
                <div className="col-span-3 text-lg font-semibold text-end">
                  Qty To Return
                </div>
              </div>

              {/* Items */}
              {order?.shippingDestinations[0]?.products?.map((item: any) => {
                const product = order.products.find(
                  (p: any) => p.id === item.productId
                );

                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-4 md:pb-2 border-b border-gray-300 mb-4 md:mb-6"
                  >
                    {/* Mobile Label */}
                    <div className="md:hidden font-semibold text-gray-700 text-sm">
                      Item
                    </div>
                    <div className="col-span-1 md:col-span-6 text-base md:text-lg">
                      <span className="font-medium">{product.sku}</span> |{" "}
                      {product.name}
                    </div>

                    {/* Mobile Label */}
                    <div className="md:hidden font-semibold text-gray-700 text-sm mt-2">
                      Price
                    </div>
                    <div className="col-span-1 md:col-span-3 text-base md:text-lg text-left md:text-center">
                      ${Number(item.price).toFixed(2)}
                    </div>

                    {/* Mobile Label */}
                    <div className="md:hidden font-semibold text-gray-700 text-sm mt-2">
                      Quantity to Return
                    </div>
                    <div className="col-span-1 md:col-span-3 text-base md:text-lg text-left md:text-end">
                      <select
                        value={selectedQuantities[item.productId] || 0}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productId,
                            Number(e.target.value)
                          )
                        }
                        disabled={submitting}
                        className="w-full md:w-24 border px-3 py-2 rounded bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              })}

              {/* Return Form */}
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-lg md:text-xl mb-2">
                        Return Reason <span className="text-red-600">*</span>
                      </label>
                      <select
                        required
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        disabled={submitting}
                        className="w-full border px-4 py-3 md:py-4 rounded bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Select reason</option>
                        <option>Received Wrong Product</option>
                        <option>Wrong Product Order</option>
                        <option>Not Satisfied With The Product</option>
                        <option>There was a problem with the Product</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-lg md:text-xl mb-2">
                        Return Action
                      </label>
                      <select
                        value={returnAction}
                        onChange={(e) => setReturnAction(e.target.value)}
                        disabled={submitting}
                        className="w-full border px-4 py-3 md:py-4 rounded bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Select action</option>
                        <option>Repair</option>
                        <option>Replacement</option>
                        <option>Store Credit</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-lg md:text-xl mb-2">
                      Comments
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      disabled={submitting}
                      className="w-full h-[140px] md:h-[185px] border px-4 py-3 md:py-4 rounded bg-white resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Write your comments..."
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 md:mt-8 flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="w-full md:w-auto px-6 py-3 md:py-4 border rounded font-bold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto btn-primary !px-6 md:!px-8 !py-3 md:!py-5 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>SUBMITTING...</span>
                      </>
                    ) : (
                      "SUBMIT RETURN REQUEST"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnItemsModal;