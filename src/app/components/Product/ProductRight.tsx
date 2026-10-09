"use client";
import { CONTACT_INFO } from "@/const/contact";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { clampQty, getQtyError } from "@/lib/utils";
import { addCart, fetchCartList } from "@/redux/slices/cartsSlice";
import { RootState } from "@/redux/store";
import { REGEX } from "@/regex/regex";
import { errorMessage } from "@/utils/message";
import { getProductInfo, ProductInfoSource } from "@/utils/product";
import Link from "next/link";
import { useState } from "react";
import AddToCartModal from "../modal/AddToCartModal";
import BulkInquiryModal from "../modal/BulkInquiryModal";
import ProductPrice from "../productprice/ProductPrice";
interface ProductRightProps {
  product: ProductInfoSource;
  quantity: number | string;
  setQuantity: (value: number | "") => void;
  increment?: () => void;
  decrement?: () => void;
  onAddToCart?: () => void;
}

const ProductRight = ({
  product,
  quantity,
  setQuantity,
}: ProductRightProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const cart = useAppSelector((state: RootState) => state.carts?.items);
  const dispatch = useAppDispatch();
  const {
    id,
    productName,
    sku,
    imageSrc,
    hasBrand,
    brandName,
    price,
    callForPricingTel,
    availableForSale,
    disabledAddToCart,
    stockStatusText,
    minQty,
    maxQty,
  } = getProductInfo(product);

  return (
    <>
      <aside className="product-right w-full mt-3 [grid-area:buy]">
        {/* Top: Price, Stock, Quantity, Add to Cart */}
        {availableForSale ? (
          <div className="border border-[#ebebeb] w-full p-7 ">
            <div className="text-[20px] font-semibold text-[#FF482E] mb-[16px]">
              {price > 0 && (
                <ProductPrice
                  price={price}
                  inline
                  textColor="#FF482E"
                  className="!text-[20px] !font-normal"
                />
              )}
            </div>
            <p className="text-[#333] text-[14px] mt-[8px] font-light">
              {stockStatusText}
            </p>

            <div className="mt-4 flex flex-col gap-2 items-start">
              <label className="text-[#333] text-[13px] mb-1 font-light">
                Quantity:
              </label>
              <input
                type="number"
                min={minQty}
                max={maxQty || undefined}
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || REGEX.DIGITS_ONLY.test(val)) {
                    setQuantity(val === "" ? "" : Number(val));
                  }
                }}
                className="font-bold! w-[50px] h-[40px] text-center text-[14px] border border-[#ebebeb] rounded bg-white text-[#000000] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Quantity"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            {availableForSale && (
              <button
                aria-label={`Add ${quantity} ${productName} to cart`}
                onClick={() => {
                  const qtyError = getQtyError(quantity, product);
                  if (qtyError) {
                    errorMessage(qtyError);
                    setQuantity(clampQty(quantity, product));
                    return;
                  }
                  const existingItem = cart.find(
                    (item: any) => item.id === id,
                  );
                  const currentQty = existingItem ? existingItem.quantity : 0;
                  const desiredQty = clampQty(quantity, product);
                  const remainingQty = maxQty
                    ? maxQty - currentQty
                    : desiredQty;

                  if (remainingQty <= 0) {
                    errorMessage(
                      `Cannot add more than ${maxQty} units of ${productName} to cart.`,
                    );
                    return;
                  }

                  if (desiredQty > remainingQty) {
                    errorMessage(
                      `You can add only ${remainingQty} more of ${productName} (maximum ${maxQty}).`,
                    );
                    return;
                  }
                  const quantityToAdd = desiredQty;
                  setIsCartModalOpen(true);
                  setIsAdding(true);
                  dispatch(
                    addCart({
                      data: {
                        productId: id,
                        quantity: quantityToAdd,
                      },
                    }),
                  )
                    .unwrap()
                    .then(() => dispatch(fetchCartList()))
                    .catch((err) => {
                      setIsCartModalOpen(false);
                      errorMessage(err || "Failed to add to cart");
                    })
                    .finally(() => setIsAdding(false));
                }}
                disabled={disabledAddToCart || isAdding}
                className="w-full mt-8 py-3 bg-[#F15939] hover:bg-[#4d2017] text-white text-[14px] transition-colors font-light! disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:bg-[#F15939]"
              >
                ADD TO CART
              </button>
            )}
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg w-full p-7 ">
            <Link
              href={callForPricingTel}
              className="w-full block text-center py-3 bg-[#F15939] hover:bg-[#e04d2e] text-white font-semibold text-[15px] transition-colors"
            >
              CALL FOR PRICE
            </Link>

            <p className="mt-8">
              We're committed to offering you unbeatable prices and delivering
              exceptional service. Feel free to get in touch with us anytime –
              we're here and eager to assist you !
            </p>
          </div>
        )}

        {/* Expert Team Support */}
        <div className="border border-[#ebebeb] w-full mt-6 p-7 hidden min-[801px]:block">
          <p className="text-center text-[#888888] text-[15px] leading-[22.5px] font-normal uppercase tracking-wide">
            Expert Team Support
          </p>
          <div className="w-full flex gap-2 justify-between items-center flex-nowrap mt-4">
            <a
              href="mailto:support@newtownspares.com"
              className="px-[6px] py-[5px] bg-[#2c2d2c] text-white text-[12.6px] leading-[18.9px] font-medium shadow-sm transition-colors w-full text-center"
            >
              Email
            </a>
            <a
              href={`https://wa.me/${CONTACT_INFO.phone.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-[6px] py-[5px] bg-[#2c2d2c] text-white text-[12.6px] leading-[18.9px] font-medium shadow-sm transition-colors w-full text-center"
            >
              WhatsApp
            </a>
            <a
              href="https://join.skype.com/invite/example"
              target="_blank"
              rel="noopener noreferrer"
              className="px-[6px] py-[5px] bg-[#2c2d2c] text-white text-[12.6px] leading-[18.9px] font-medium shadow-sm transition-colors w-full text-center"
            >
              Skype
            </a>
          </div>
          <p className="text-center text-[#333]! text-[14px]! mt-4">
            <a href={CONTACT_INFO.phone.href}>{CONTACT_INFO.phone.display}</a>
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-4 py-3 bg-white border border-[#333333] text-[#333] font-normal text-[14px] hover:bg-[#333] hover:text-white transition-colors"
          >
            Request A Bulk Quote
          </button>
        </div>
      </aside>

      <BulkInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{ name: productName, image: imageSrc, sku }}
      />

      <AddToCartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        loading={isAdding}
        product={{
          id,
          name: productName,
          image: imageSrc,
          brand: hasBrand ? brandName : undefined,
          price,
        }}
      />
    </>
  );
};

export default ProductRight;
