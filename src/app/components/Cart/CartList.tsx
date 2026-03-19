"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import Link from "next/link";
import {
  clearCart,
  decreaseQty,
  increaseQty,
  removeFromCart,
  updateQty,
} from "@/redux/slices/cartSlice";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const CartList = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.cart.items);
  console.log("Cart Items:", cart);
  const [quantities, setQuantities] = useState<{
    [key: string]: number | string;
  }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const handleChange = (id: string, value: string) => {
    if (value === "" || /^\d*$/.test(value)) {
      setQuantities((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(removeFromCart(itemToDelete.id));
      setItemToDelete(null);
    }
    setIsDialogOpen(false);
  };
  useEffect(() => {
    const updatedQuantities: { [key: string]: number } = {};
    cart.forEach((item) => {
      updatedQuantities[item.id] = item.quantity;
    });
    setQuantities(updatedQuantities);
  }, [cart]);

  const handleManualQtyUpdate = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    maxPurchaseQuantity?: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputValue = quantities[id];
      const parsed = Number(inputValue);

         const newQty = maxPurchaseQuantity
      ? Math.min(parsed > 0 ? parsed : 1, maxPurchaseQuantity)
      : parsed > 0
      ? parsed
      : 1;

      dispatch(updateQty({ id, quantity: newQty }));

      setQuantities((prev) => ({
        ...prev,
        [id]: newQty,
      }));

      e.currentTarget.blur();
    }
  };

  const isEmpty = !cart?.length;

  return (
    <div
      className={`w-full border border-[#D6D6D6] rounded-lg 2xl:w-full p-7 ${
        isEmpty ? "min-h-[259px]" : ""
      }`}
    >
      {!isEmpty && (
        <div className="hidden md:grid md:grid-cols-[1fr_100px_90px_90px_120px] md:gap-2 lg:gap-4 font-semibold pb-6 text-[14px] text-[#333333] border-b border-gray-300">
          <span>Item</span>
          <span>SKU</span>
          <span>Price</span>
          <span>Quantity</span>
          <span className="text-right">Total</span>
        </div>
      )}

      {cart?.length > 0 ? (
        <>
          {cart.map((item) => (
            <div key={item?.id}>
              <div className="border-b border-gray-300 py-4 md:py-0">
                <div className="md:hidden">
                  <div className="flex justify-center">
                    <Image
                      width={98}
                      height={105}
                      src={item.image?.[0]?.path || "/checkouticon/orderimg.png"}
                      alt={item.name}
                      className="w-[88px] h-[9.2rem] shrink-0 object-contain border"
                    />
                  </div>

                  <div className="text-center mt-3">
                    <p className="text-[14px] text-[#777777]">{item.brand?.name || "—"}</p>
                    <p className="text-[15px] text-[#333333] line-clamp-3 mt-1">
                      {item.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
                    <div>
                      <p className="text-[12px] text-[#777777]">SKU</p>
                      <p className="text-[14px] text-[#333333]">{item.sku || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-[#777777]">Price</p>
                      <p className="text-[14px] text-[#333333]">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] text-[#777777] mb-1">Quantity</p>
                      <div className="w-[64px] h-[40px] border border-gray-300 overflow-hidden bg-white shrink-0">
                        <input
                          type="number"
                          value={
                            quantities[item.id] === undefined
                              ? item.quantity
                              : quantities[item.id]
                          }
                          onChange={(e) => handleChange(item.id, e.target.value)}
                          onKeyDown={(e) =>
                            handleManualQtyUpdate(
                              e,
                              item.id,
                              item.maxPurchaseQuantity
                            )
                          }
                          className="w-[64px] h-[40px] text-center py-2 outline-none text-[14px] text-[#333333] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] text-[#777777]">Total</p>
                      <p className="text-[14px] text-[#333333] font-bold">
                        ${Number(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => {
                        setItemToDelete(item);
                        setIsDialogOpen(true);
                      }}
                      className="shrink-0 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="hidden md:grid md:grid-cols-[1fr_100px_90px_90px_120px] md:gap-2 lg:gap-4 items-center">
                  {/* Item: thumbnail + brand + title */}
                  <div className="flex items-center gap-4 w-full">
                    <Image
                      width={98}
                      height={105}
                      src={item.image?.[0]?.path || "/checkouticon/orderimg.png"}
                      alt={item.name}
                      className="w-[73.50px] h-[8.4rem] shrink-0 object-contain border"
                    />
                    <div className="min-w-0">
                      <p className="text-[14px] text-[#777777]">
                        {item.brand?.name || "—"}
                      </p>
                      <p className="text-[15px] text-[#333333] line-clamp-3">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <p className="text-[14px] text-[#333333]">{item.sku || "N/A"}</p>
                  <p className="text-[14px] text-[#333333]">
                    ${Number(item.price).toFixed(2)}
                  </p>
                  <div className="w-[50px] h-[40px] border border-gray-300 overflow-hidden bg-white shrink-0">
                    <input
                      type="number"
                      value={
                        quantities[item.id] === undefined
                          ? item.quantity
                          : quantities[item.id]
                      }
                      onChange={(e) => handleChange(item.id, e.target.value)}
                      onKeyDown={(e) =>
                        handleManualQtyUpdate(e, item.id, item.maxPurchaseQuantity)
                      }
                      className="w-[50px] h-[40px] text-center py-2 outline-none text-[14px] text-[#333333] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <p className="text-[14px] text-[#333333] font-bold">
                      ${Number(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        setItemToDelete(item);
                        setIsDialogOpen(true);
                      }}
                      className="shrink-0 w-6 h-6 rounded-full bg-[#F15939] hover:bg-red-600 text-white flex items-center justify-center transition"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center w-full min-h-[259px] px-4">
          <p className="text-[22px] text-[#333333] leading-none mb-8">
            Your cart is empty
          </p>
          <Link href="/products">
            <button className="h-[40px] px-4 md:px-12 rounded bg-[#FF4F2F] hover:bg-[#F15939] transition text-white text-[14px] font-medium">
              Click here to continue shopping
            </button>
          </Link>
        </div>
      )}

      {/* Footer: Empty Cart / Continue Shopping */}
      {!isEmpty && (
        <div className="flex justify-end items-center mt-6 px-6">
          <button
            onClick={() => dispatch(clearCart())}
            className="w-full md:w-[117px] py-2 px-5 border rounded-lg hover:bg-gray-100 transition"
          >
            Empty Cart
          </button>
        </div>
      )}
      {/* ShadCN Dialog for Delete Confirmation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <strong>{itemToDelete?.name}</strong> from your cart? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="!p-4 !text-lg">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}  className="!p-4 !text-lg">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartList;
