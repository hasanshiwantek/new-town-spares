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
import { Trash2 } from "lucide-react";
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

  return (
    <div className="border border-[#D6D6D6] rounded-lg 2xl:w-full">
      <div className="hidden  xl:flex justify-between font-semibold py-5 px-8 bg-[#F6F6F6]">
        <span className="h3-secondary">Items</span>
        <span className="flex justify-between xl:w-[31.8%] 2xl:w-[31.2%]">
          <span className="h5-20px-regular">Price</span>
          <span className="h5-20px-regular">Qty</span>
          <span className="h5-20px-regular">Subtotal</span>
        </span>
      </div>
      {cart?.length > 0 ? (
        cart?.map((item, index) => (
          <>
            {/* Example product row */}
            <div
              key={item?.id}
              className="flex flex-col xl:flex-row items-center justify-between p-4"
            >
              <div className="flex flex-col xl:flex-row items-center xl:w-[65.1%] 2xl:w-[64.5%]">
                <div className="w-full xl:w-[18.1%] 2xl:w-[18%]">
                  <Image
                    width={98}
                    height={105}
                    src={item.image?.[0]?.path || "/checkouticon/orderimg.png"}
                    alt={item.name}
                    className="xl:w-[87.6%] 2xl:w-[53%] xl:h-[6.5rem] 2xl:h-[8.8rem] object-contain border m-auto"
                  />
                </div>
                <div className="w-full xl:w-[82.1%] 2xl:w-[82%] mx-2">
                  <p className="h5-medium-20px-medium text-center xl:text-start">
                    SKU: {item.sku || "N/A"}
                  </p>
                  <p className="h5-medium   text-center lg:mx-auto md:mx-auto sm:mx-auto w-[100%] sm:w-[60%]  md:w-[70%] lg:w-[80%] xl:text-start xl:w-[100%] 2xl:w-[100%]">
                    {item.name}
                  </p>
                </div>
              </div>

              <div className="relative flex items-center gap-4 xl:gap-0 xl:w-[33%]  2xl:w-[32%] justify-between">
                <p className="h5-regular">${Number(item.price).toFixed(2)}</p>
                <div className="flex items-center border border-gray-300 overflow-hidden xl:w-[27.9%] 2xl:w-[28.1%]">
                  {/* Number Input */}
                  <input
                    type="number"
                    value={
                      quantities[item.id] === undefined
                        ? item.quantity
                        : quantities[item.id]
                    }
                    onChange={(e) => handleChange(item.id, e.target.value)}
                    onKeyDown={(e) => handleManualQtyUpdate(e, item.id , item.maxPurchaseQuantity)}
                    className="w-10 xl:w-[51%] 2xl:w-[48.9%] text-center py-2 xl:px-2 2xl:px-2 outline-none h5-medium [appearance:textfield] 
                   [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  {/* Buttons */}
                  <div className="flex flex-col justify-center items-center border-l border-gray-300 w-10 xl:w-[51%] 2xl:w-[48.9%]">
                    <button
                      type="button"
                        onClick={() => {
    if (!item.maxPurchaseQuantity || item.quantity < item.maxPurchaseQuantity) {
      dispatch(increaseQty(item.id));
    }
  }}
                      className="flex items-center justify-center w-2.5 h-5 hover:bg-gray-100 text-[#AEAEAE]"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseQty(item.id))}
                      className="flex items-center justify-center w-2.5 h-6 hover:bg-gray-100 text-[#AEAEAE]"
                    >
                      ▼
                    </button>
                  </div>
                </div>
                {/* Trash / Delete Button */}
                <button
                  onClick={() => {
                    setItemToDelete(item);
                    setIsDialogOpen(true);
                  }}
                  className="absolute -right-12 xl:right-0 xl:bottom-14 2xl:right-1 2xl:bottom-18 ml-auto text-gray-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <p className="h5-regular">
                  ${Number(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            {/* line grey */}
            <div className="w-[97%] mx-auto h-[1px] bg-gray-300"></div>
          </>
        ))
      ) : (
        <div className="text-7xl text-[#4A4A4A] text-center my-16">
          No Cart Added
        </div>
      )}

      {/* Continue + Update */}
      <div className="flex justify-between items-center my-7 px-6">
        <Link href={"/products"}>
          <button className="h3-regular xl:w-64 2xl:w-85 py-2 px-4  rounded-lg border border-[#4A4A4A] hover:text-[#F15939] transition">
            Continue Shopping
          </button>
        </Link>
        <button onClick={() => dispatch(clearCart())} disabled={cart.length === 0} className="h3-regular xl:w-46 2xl:w-68 py-2 px-5 border border-[#4A4A4A] rounded-lg hover:bg-gray-100 transition">
          Empty Cart
        </button>
      </div>
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
