"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { useAddProductBySku } from "@/hooks/useAddProductBySku";
import {
  addBySku,
  deleteCart,
  fetchCartList,
  updateQty,
} from "@/redux/slices/cartsSlice";

export default function WishlistCartSidebar() {
  const cart = useAppSelector((state: RootState) => state.carts.items);
  const { loading } = useAppSelector((state: RootState) => state.carts);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { skuInput, setSkuInput, qty, setQty } = useAddProductBySku();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSkuCart = async () => {
    if (skuInput == "" || qty < 1) return;
    const result = await dispatch(addBySku({ sku: skuInput, quantity: qty }));
    if (addBySku.fulfilled.match(result)) {
      toast.success(result.payload.message);
      setSkuInput("");
      setQty(1);
      dispatch(fetchCartList());
    }
  };

  const handleRemove = (item: any) => {
    dispatch(deleteCart({ id: item?.cartItemId }))
      .unwrap()
      .then(() => dispatch(fetchCartList()))
      .catch(() => {});
  };

  const handleQtyChange = (id: string | number, value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 1) return;
    dispatch(updateQty({ id, quantity: parsed }));
  };

  return (
    <div className="hidden min-[1260px]:block min-[1260px]:w-[300px] shrink-0 self-start bg-white shadow-[0_0_1px_0_rgba(0,0,0,0.5)] p-[14px] mb-[21px] sticky top-4">
      <h2 className="text-[#333333] text-[22px] font-light leading-[33px] text-center pb-[14px] border-b border-[#ebebeb]">
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <div>
          <p className="text-[#959595] text-[14px] text-center py-[18px]">
            Your Cart Is Empty.
          </p>
        </div>
      ) : (
        <div className="max-h-[390px] overflow-y-auto">
          {cart.map((item: any) => {
            const imageUrl =
              item?.image?.[0]?.path ||
              item?.image?.path ||
              item?.image ||
              "/default-product-image.svg";
            const itemPrice = Number(item?.price || 0);
            return (
              <div
                key={item.id}
                className="py-[14px] flex gap-[14px]"
              >
                <Link
                  href={item?.productUrl || "#"}
                  className="shrink-0 relative w-[54px] h-[45px] block"
                >
                  <Image
                    src={imageUrl}
                    alt={item?.name ?? ""}
                    width={54}
                    height={45}
                    className="object-contain w-[54px] h-[45px]"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={item?.productUrl || "#"}>
                    <p className="text-[#333333] text-[14px] leading-[16.8px] line-clamp-2 hover:text-[#ff482e]">
                      {item?.name ?? "—"}
                    </p>
                  </Link>
                  <p className="text-[#333333] text-[14px] leading-[21px] mt-[4px]">
                    {item?.sku ?? ""}
                  </p>

                  <div className="mt-[7px] flex items-center gap-[7px]">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleQtyChange(item.id, e.target.value)}
                      className="w-[35px] h-[24px] border-[0.667px] border-[#ebebeb] rounded-[2px] bg-white text-center outline-none !text-[15px] text-[#333333] shrink-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      aria-label="Quantity"
                    />
                    <span className="text-[#333333] text-[14px] leading-[21px]">
                      ×
                    </span>
                    <span className="text-[#ff482e] text-[14px] leading-[21px]">
                      ${itemPrice.toFixed(2)}
                    </span>
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="shrink-0 w-[18px] h-[18px] rounded-full bg-[#ff482e] text-white flex items-center justify-center"
                      aria-label="Remove item"
                    >
                      <X size={11} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="py-[14px] border-b border-[#ebebeb]">
        <div className="flex gap-0 border-[0.667px] border-[#ebebeb] rounded-[4px] overflow-hidden h-[42px]">
          <input
            type="text"
            value={skuInput}
            onChange={(e) => setSkuInput(e.target.value)}
            placeholder="Add SKU to Cart"
            className="flex-1 min-w-0 h-full pl-[11px] border-0 border-r-[0.667px] border-[#ebebeb] text-[#333333] !text-[14px] outline-none focus:ring-2 focus:ring-[#ff482e] focus:ring-inset"
          />
          <div className="flex items-center justify-center text-center w-[52px] h-full border-0 border-r-[0.667px] border-[#ebebeb] bg-white">
            <input
              type="number"
              min={1}
              value={qty}
              onFocus={(e) => e.target.select()}
              onChange={(e) =>
                setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-full h-full text-[#333333] !text-[14px] bg-transparent text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <button
            type="button"
            onClick={handleSkuCart}
            disabled={loading}
            className="h-full bg-[#ff482e] hover:bg-[#e63e26] text-white text-[14px] font-light shrink-0 px-[16px] disabled:opacity-70"
          >
            {loading ? "loading" : "Add"}
          </button>
        </div>
      </div>

      <div className="py-[7px] text-[14px] leading-[21px] text-[#333333]">
        <div className="flex justify-between py-[7px]">
          <span>Total Items:</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between py-[7px]">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-[7px]">
          <span>Grand total:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-[9px]">
        <Link
          href="/cart"
          className="flex-1 h-[37px] flex items-center justify-center rounded-[4px] border-[0.667px] border-[#ebebeb] bg-white text-[#333333] text-[14px] font-light hover:bg-gray-50"
        >
          View Cart
        </Link>
        <button
          type="button"
          onClick={() => {
            if (cart.length === 0) {
              toast.error("Your cart is empty");
              return;
            }
            router.push("/checkout");
          }}
          className="flex-1 h-[37px] rounded-[4px] bg-[#ff482e] hover:bg-[#e63e26] text-white text-[14px] font-light"
        >
          Check out
        </button>
      </div>
    </div>
  );
}
