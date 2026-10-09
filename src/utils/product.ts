import { CONTACT_INFO } from "@/const/contact";
import { getMinQty, isAvailableForSale } from "@/lib/utils";

type ProductImage = { path?: string | null; isPrimary?: number | null };

export type ProductInfoSource = {
  id?: number | string | null;
  name?: string | null;
  sku?: string | null;
  slug?: string | null;
  productUrl?: string | null;
  brand?: { name?: string | null; slug?: string | null } | null;
  // API products send an array; cart/wishlist items may send one image or a plain path
  image?: ProductImage[] | ProductImage | string | null;
  categories?: { id?: number | string; name?: string; slug?: string | null }[] | null;
  price?: number | string | null;
  msrp?: number | string | null;
  retailPrice?: number | string | null;
  costPrice?: number | string | null;
  availabilityText?: string | null;
  callForPricingLabel?: string | null;
  callForPricingPhone?: string | null;
  purchasabilityStatus?: string | null;
  currentStock?: number | string | null;
  allowPurchase?: boolean | number | null;
  minPurchaseQuantity?: number | string | null;
  maxPurchaseQuantity?: number | string | null;
  quantity?: number | string | null;
};

export function getProductInfo(product?: ProductInfoSource | null) {
  // identity
  const id = product?.id ?? undefined;
  const productName = product?.name || "Unnamed Product";
  const sku = product?.sku || "";
  const skuUrl = `/${sku}`;
  const productUrl =
    product?.productUrl || (product?.slug ? `/${product.slug}` : "#");
  const categoryUrl = `/category/${product?.categories?.[0]?.slug || product?.slug}`;

  // brand
  const hasBrand = !!product?.brand?.name;
  const brandName = product?.brand?.name || "Unknown Brand";
  const brandSlug = product?.brand?.slug || undefined;
  const brandUrl = brandSlug ? `/brand/${brandSlug}` : undefined;

  // media (primary image first, then the rest in API order)
  const rawImage = product?.image;
  const imageList: ProductImage[] = Array.isArray(rawImage)
    ? rawImage
    : typeof rawImage === "string"
      ? [{ path: rawImage }]
      : rawImage
        ? [rawImage]
        : [];
  const primaryImage = imageList.find((img) => img?.isPrimary === 1);
  const images = (
    primaryImage
      ? [primaryImage, ...imageList.filter((img) => img !== primaryImage)]
      : imageList
  )
    .map((img) => img?.path)
    .filter((path): path is string => !!path);
  const imageSrc = images[0] || "/default-product-image.svg";

  // pricing
  const price = Number(product?.price) || 0;
  const msrp = Number(product?.msrp) || 0;
  const hasMsrp = msrp > 0;
  const retailPrice = Number(product?.retailPrice) || 0;
  const costPrice = Number(product?.costPrice) || 0;
  const savings = hasMsrp && price > 0 ? msrp - price : 0;
  const callForPricingLabel =
    product?.callForPricingLabel?.trim() || "Call for pricing";
  const callForPricingPhone =
    product?.callForPricingPhone?.trim() || CONTACT_INFO.phone.display;
  const callForPricingTel = `tel:${
    product?.callForPricingPhone?.trim() || CONTACT_INFO.phone.number
  }`;

  // availability
  const availabilityText = product?.availabilityText || undefined;
  const availableForSale = isAvailableForSale(
    product?.purchasabilityStatus ?? "",
    price,
  );
  const isOutOfStock = Number(product?.currentStock) === 0;
  const isPurchaseBlocked = !product?.allowPurchase;
  const disabledAddToCart = isOutOfStock || isPurchaseBlocked;
  const stockStatusText = isOutOfStock
    ? "Out of Stock"
    : availabilityText || "In Stock";

  // purchase limits
  const minQty = getMinQty(product);
  const maxQty = Number(product?.maxPurchaseQuantity) || undefined;

  return {
    id,
    productName,
    sku,
    skuUrl,
    productUrl,
    categoryUrl,
    hasBrand,
    brandName,
    brandSlug,
    brandUrl,
    images,
    imageSrc,
    price,
    msrp,
    hasMsrp,
    retailPrice,
    costPrice,
    savings,
    callForPricingLabel,
    callForPricingPhone,
    callForPricingTel,
    availabilityText,
    availableForSale,
    isOutOfStock,
    isPurchaseBlocked,
    disabledAddToCart,
    stockStatusText,
    minQty,
    maxQty,
  };
}
