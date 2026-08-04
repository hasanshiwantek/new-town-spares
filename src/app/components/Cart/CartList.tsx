"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import {
  clearAllCart,
  fetchCartList,
  removeFromCart,
  updateCart,
  updateQty,
} from "@/redux/slices/cartsSlice";
import { deleteCart } from "@/redux/slices/cartsSlice";
import { RootState } from "@/redux/store";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProductPrice from "../productprice/ProductPrice";
const CartList = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.carts.items);
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
  function removeLocalShipping() {
    localStorage.removeItem("shippingCost");
    localStorage.removeItem("shippingData");
  }
  // const confirmDelete = () => {
  //   if (itemToDelete) {
  //     dispatch(removeFromCart(itemToDelete.id));
  //     setItemToDelete(null);
  //   }
  //   setIsDialogOpen(false);
  // };
  const confirmDelete = () => {
    if (itemToDelete) {
      // dispatch(removeFromCart(itemToDelete.id));
      dispatch(deleteCart({ id: itemToDelete?.cartItemId }))
        .unwrap()
        .then(() => {
          dispatch(fetchCartList());
          removeLocalShipping();
          setItemToDelete(null);
          setIsDialogOpen(false);
        });
    }
  };
  useEffect(() => {
    const updatedQuantities: { [key: string]: number } = {};
    cart.forEach((item) => {
      updatedQuantities[item.cartItemId] = item.quantity;
    });
    setQuantities(updatedQuantities);
  }, [cart]);

  const handleManualQtyUpdate = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    maxPurchaseQuantity?: number,
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

      dispatch(
        updateCart({
          id,
          data: {
            quantity: newQty,
          },
        })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchCartList());
          removeLocalShipping();

          setQuantities((prev) => ({
            ...prev,
            [id]: newQty,
          }));
        });

      e.currentTarget.blur();
    }
  };

  const isEmpty = !cart?.length;

  // Shared qty <input> so mobile + desktop stay identical in behaviour.
  const qtyInput = (item: any) => (
    <div className="w-[50px] h-[40px] border border-[#ebebeb] overflow-hidden bg-white shrink-0">
      <input
        type="number"
        value={
          quantities[item.cartItemId] === undefined
            ? item.quantity
            : quantities[item.cartItemId]
        }
        onChange={(e) => handleChange(item.cartItemId, e.target.value)}
        onKeyDown={(e) =>
          handleManualQtyUpdate(e, item.cartItemId, item.maxPurchaseQuantity)
        }
        className="w-[50px] h-[40px] text-center py-2 outline-none !text-[15px] !font-bold text-[#333333] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );

  const removeButton = (item: any) => (
    <button
      onClick={() => {
        setItemToDelete(item);
        setIsDialogOpen(true);
      }}
      className="shrink-0 w-[18px] h-[18px] rounded-full bg-[#FF482E] hover:bg-[#F15939] text-white flex items-center justify-center transition"
      aria-label="Remove item"
    >
      <X size={14} strokeWidth={3} />
    </button>
  );

  return (
    <div
      className={
        isEmpty
          ? "w-full border border-[#D6D6D6] 2xl:w-full p-7 flex items-center min-h-[259px]"
          : "w-full 2xl:w-full shadow-[0_0_1px_0_rgba(0,0,0,0.5)] p-[21px]"
      }
    >
      {/* Column header — desktop table layout only (live hides it below 801px) */}
      {!isEmpty && (
        <div className="hidden min-[801px]:grid grid-cols-[1fr_12%_15%_15%_15%] pb-[14px] text-[14px] font-bold text-[#333333]">
          <span>Item</span>
          <span>SKU</span>
          <span className="text-right pr-[11px]">Price</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Total</span>
        </div>
      )}

      {cart?.length > 0 ? (
        <>
          {cart.map((item, idx) => (
            <div key={item?.id}>
              <div
                className={
                  idx === cart.length - 1 ? "" : "border-b border-[#ebebeb]"
                }
              >
                {/* Mobile (<=800): image floated left, brand/title, then stacked info rows */}
                <div className="min-[801px]:hidden py-4">
                  <Image
                    width={98}
                    height={105}
                    src={item.image?.[0]?.path || ""}
                    alt={item.name}
                    className="float-left w-[112px] min-[551px]:w-[167px] h-auto object-contain mr-5"
                  />
                  <p className="text-[14px] text-[#959595]">
                    {item.brand?.name || "—"}
                  </p>
                  <Link href={`${item?.productUrl || "#"}`}>
                    <p className="text-[15px] leading-[18px] text-[#333333] break-words">
                      {item.name}
                    </p>
                  </Link>

                  <div className="clear-both pt-4">
                    <div className="flex items-center gap-3 py-1">
                      <span className="min-w-[90px] text-[14px] font-bold text-[#333333]">
                        SKU
                      </span>
                      <span className="text-[14px] text-[#333333]">
                        {item.sku || "N/A"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 min-[551px]:grid-cols-3 gap-y-1">
                      <div className="flex items-center gap-3 py-1">
                        <span className="min-w-[90px] min-[551px]:min-w-0 text-[14px] font-bold text-[#333333]">
                          Price
                        </span>
                        <span className="text-[14px] text-[#333333]">
                          <ProductPrice
                            price={item.price}
                            inline={true}
                          />
                        </span>
                      </div>
                      <div className="flex items-center gap-3 py-1">
                        <span className="min-w-[90px] min-[551px]:min-w-0 text-[14px] font-bold text-[#333333]">
                          Quantity
                        </span>
                        {qtyInput(item)}
                      </div>
                      <div className="flex items-center gap-3 py-1">
                        <span className="min-w-[90px] min-[551px]:min-w-0 text-[14px] font-bold text-[#333333]">
                          Total
                        </span>
                        <strong className="text-[14px] font-bold text-[#333333]">
                          <ProductPrice
                            price={Number(item?.price * item?.quantity)}
                            inline={true}
                          />
                        </strong>
                        {removeButton(item)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop (>=801): table row matching live columns */}
                <div className="hidden min-[801px]:grid grid-cols-[1fr_12%_15%_15%_15%] items-center pt-[11px] pb-[21px]">
                  <div className="flex items-center gap-[21px] pr-[21px] min-w-0">
                    <Image
                      width={98}
                      height={105}
                      src={item.image?.[0]?.path || ""}
                      alt={item.name}
                      className="w-[21%] h-auto shrink-0 object-contain"
                    />
                    <div className="min-w-0">
                      <p className="text-[14px] leading-[21px] text-[#959595]">
                        {item.brand?.name || "—"}
                      </p>
                      <Link href={`${item?.productUrl || "#"}`}>
                        <p className="text-[15px] leading-[18px] text-[#333333] break-words">
                          {item.name}
                        </p>
                      </Link>
                    </div>
                  </div>

                  <p className="text-[14px] text-[#333333]">
                    {item.sku || "N/A"}
                  </p>
                  <p className="text-[14px] text-[#333333] text-right pr-[11px]">
                          <ProductPrice
                            price={Number(item.price)}
                            inline={true}
                          />
                  </p>
                  <div className="flex justify-center">{qtyInput(item)}</div>

                  <div className="flex items-center justify-end gap-[14px]">
                    <strong className="text-[14px] font-bold text-[#333333]">
                         <ProductPrice
                        price={Number(item.price * item.quantity)}
                        inline={true}
                      />
                    </strong>
                    {removeButton(item)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center w-full">
          <p className="font-normal text-[22px] text-[#333333] leading-none mb-[11px]">
            Your cart is empty
          </p>
          <Link href="/products">
            <button className="h-[40px] px-4 md:px-12 rounded-md bg-[#FF4F2F] hover:bg-[#F15939] transition text-white text-[14px] font-light">
              Click here to continue shopping
            </button>
          </Link>
        </div>
      )}

      {/* Footer: Empty Cart */}
      {!isEmpty && (
        <div className="flex justify-end items-center">
          <button
            onClick={() => dispatch(clearAllCart())}
            className="w-full md:w-[117px] py-[6px] px-[21px] text-[13px] font-light text-[#333333] border border-[#ebebeb] rounded-[4px] hover:bg-gray-100 transition"
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
              className="!p-4 !text-[#ffffff] !text-lg"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartList;
