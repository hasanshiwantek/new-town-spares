"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useAddProductBySku } from "@/hooks/useAddProductBySku";
import { addBySku, deleteCart, fetchCartList, updateCart } from "@/redux/slices/cartsSlice";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

export default function ProductListCartSidebar() {
  const cart = useAppSelector((state: RootState) => state.carts.items);
    const [updatingQty, setUpdatingQty] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<{
        [key: string]: number | string;
      }>({});

  const { loading } = useAppSelector(
      (state: RootState) => state.carts
    )
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    skuInput,
    setSkuInput,
    qty,
    setQty,
    adding,
    handleAddBySku,
  } = useAddProductBySku();
    function removeLocalShipping() {
    localStorage.removeItem("shippingCost");
    localStorage.removeItem("shippingData");
  }
    const handleChange = (id: string, value: string) => {
    if (value === "" || /^\d*$/.test(value)) {
      setQuantities((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };
    const confirmDelete = (item: any) => {
      dispatch(deleteCart({ id: item.cartItemId }))
        .unwrap()
        .then(() => {
          dispatch(fetchCartList());
          removeLocalShipping();
        });
    };
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
    setUpdatingQty(id);
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
            setUpdatingQty(null);
            setQuantities((prev) => ({
              ...prev,
              [id]: newQty,
            }));
          }).catch(() => {
    setUpdatingQty(null);
  });
    
        e.currentTarget.blur();
      }
    };
    const qtyInput = (item: any) => (
    <div className="w-[35px] h-8 border border-[#ebebeb] overflow-hidden bg-white shrink-0">
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
        className="w-full h-full text-center py-2 outline-none !text-[10px] !font-bold text-[#333333] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
   const handleSkuCart = async ()=>{
      if(skuInput == "" || qty<1){
        return 
      }
         const result =  await dispatch(addBySku({sku:skuInput,quantity:qty}))
         if (addBySku.fulfilled.match(result)) {
      toast.success(result.payload.message);
        setSkuInput("");
        setQty(1);
        dispatch(fetchCartList())
    } else {
      //  toast.error(result.payload.message);
    }
    }

  return (
    <div className="hidden xl:block w-full max-w-[30.7%] border border-gray-200 overflow-hidden shrink-0 p-4.5 sticky top-4 self-start max-h-screen overflow-y-auto">
      <h2 className="text-[#333333] text-2xl lg:text-[22px] text-center pb-4 border-b border-gray-200">
        Your Cart
      </h2>

      <div className="bg-white  border-gray-200">
       {cart.length === 0 && (
  <div className="bg-white border-b border-gray-200">
    <p className="text-[#959595] text-[14px] text-center py-4.5">
      Your Cart Is Empty.
    </p>
  </div>
)}
 {cart.length > 0 && (
                      <div className=" relative max-h-[420px] overflow-y-auto">
                        {cart.map((item) => {
                          const imageUrl =
                            item?.image?.[0]?.path ||
                            item?.image?.path ||
                            item?.image ||
                            "/default-product-image.svg";
                          const itemPrice = Number(item?.price || 0);
                          return (
                            <div
  key={item.id}
  className=" px-5 py-4  border-gray-200 flex gap-4"
>
                              <div className="shrink-0">
                                <Image
                                  src={imageUrl}
                                  alt={item?.name ?? ""}
                                  width={56}
                                  height={56}
                                  className="object-contain w-18 h-18"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-[#333333] text-[14px] leading-snug line-clamp-2">
                                  {item?.name ?? "—"}
                                </p>
                                <p className="text-[#333333] text-[14px] mt-1">
                                  {item?.sku ?? ""}
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                  <div className="w-[35px] h-8 border border-gray-300 overflow-hidden bg-white shrink-0">
                                  
                                      {qtyInput(item)}
                                  </div>
                                  <span className="text-[#333333]">×</span>
                                  <span className="text-[#FD5430] text-[14px]">
                                    ${itemPrice.toFixed(2)}
                                  </span>
                                  <div className="flex-1" />
                                  <button
                                    type="button"
                                    onClick={() => confirmDelete(item)}
                                    className="shrink-0 w-6 h-6 rounded-full bg-[#FD5430] text-white flex items-center justify-center"
                                    aria-label="Remove item"
                                  >
                                    <X size={14} strokeWidth={3} />
                                  </button>
                                </div>
                              </div>
                          
                            </div>
                          );
                        })}
                        {loading && updatingQty && (
  <div className="absolute inset-0 z-30 flex items-center justify-center">
    {/* Blur layer */}
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />

    {/* Loader */}
    <div className="relative z-40 flex gap-2">
      <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
      <span
        className="w-2 h-2 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0.15s" }}
      />
      <span
        className="w-2 h-2 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  </div>
)}
                        
                      </div>
                    )}

      </div>

      <div className="space-y-4 bg-white border-b border-gray-200">
        {/* <label className="text-gray-800 text-sm font-medium block">Add SKU to Cart</label> */}
        <div className="flex gap-0 border border-gray-300 rounded overflow-hidden mt-4.5">
          <input
            type="text"
            value={skuInput}
            onChange={(e) => setSkuInput(e.target.value)}
            placeholder="Add SKU to Cart"
            className="flex-1 min-w-0 h-[42px] pl-2 border-0 border-r border-gray-300 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-[#FD5430] focus:ring-inset"
          />
          <div className="flex items-center justify-center mx-auto text-center w-16 h-[42px] border-0 border-r border-gray-300 bg-white">
            <input
              type="number"
              min={1}
              value={qty}
               onFocus={(e) => e.target.select()}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full h-full text-gray-800 text-lg bg-transparent text-center outline-none ml-5"
              style={{ appearance: "textfield" }}
            />
          </div>
          <button
            type="button"
            onClick={handleSkuCart}
            disabled={loading}
            className="h-[42px] bg-[#FD5430] hover:bg-[#e04a2a] text-white text-[14px] shrink-0 px-4 disabled:opacity-70"
          >
            {loading? "loading" : "Add"}
          </button>
        </div>
      </div>

      <div className="space-y-2 text-[14px] text-gray-800 py-4">
        <div className="flex justify-between text-[14px] border-t border-gray-200 pt-3">
          <span>Total Items:</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between text-[14px] border-t border-gray-200 pt-3">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[14px] border-t border-gray-200 pt-3">
          <span>Grand total:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2 bg-gray-50">
        <Link
          href="/cart"
          className="flex-1 h-[37.58px] flex items-center justify-center rounded border border-gray-300 bg-white text-gray-700 text-[14px] font-medium hover:bg-gray-50"
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
          className="flex-1 h-[37.58px] rounded bg-[#FD5430] hover:bg-[#e04a2a] text-white text-[14px] font-medium"
        >
          Check out
        </button>
      </div>
    </div>
  );
}
