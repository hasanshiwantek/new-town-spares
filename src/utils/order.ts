import { replaceNullWithPlaceholder } from "@/lib/utils";

type OrderImage = { path?: string | null };

type ReturnOrderProduct = {
  name?: string | null;
  price?: number | string | null;
  // API sends either `image` or `images` depending on the product source
  image?: OrderImage[] | null;
  images?: OrderImage[] | null;
};

export type ReturnOrderSource = {
  id?: number | string | null;
  orderNumber?: number | string | null;
  status?: string | null;
  returnAction?: string | null;
  reason?: string | null;
  comments?: string | null;
  createdAt?: string | null;
  product?: ReturnOrderProduct[] | null;
};

const getProductImagePath = (product?: ReturnOrderProduct | null) =>
  product?.image?.[0]?.path || product?.images?.[0]?.path || undefined;

export function getReturnOrderInfo(order?: ReturnOrderSource | null) {
  const products = order?.product ?? [];

  // identity
  const id = order?.id ?? undefined;
  const orderNumber = replaceNullWithPlaceholder(order?.orderNumber, "N/A");
  const status = replaceNullWithPlaceholder(order?.status, "Pending");

  // products (first product that has an image, not just the first product)
  const productCount = products.length;
  const productLabel = `${productCount} product${productCount === 1 ? "" : "s"}`;
  const total = products.reduce(
    (sum, item) => sum + (Number(item?.price) || 0),
    0,
  );
  const formattedTotal = `$${total.toFixed(2)}`;
  const imageSrc =
    products.map(getProductImagePath).find(Boolean) ||
    "/default-product-image.svg";
  const imageAlt = products[0]?.name || "Product Image";

  // return details
  const requestedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "-";
  const returnAction = replaceNullWithPlaceholder(order?.returnAction, "-");
  const reason = replaceNullWithPlaceholder(order?.reason, "-");
  const comments = replaceNullWithPlaceholder(order?.comments, "No comments");

  return {
    id,
    orderNumber,
    status,
    productCount,
    productLabel,
    total,
    formattedTotal,
    imageSrc,
    imageAlt,
    requestedDate,
    returnAction,
    reason,
    comments,
  };
}
