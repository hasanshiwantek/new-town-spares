import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMinQty(product: any): number {
  return Math.max(1, Number(product?.minPurchaseQuantity) || 1);
}

export function clampQty(value: unknown, product: any): number {
  const min = getMinQty(product);
  const max = Number(product?.maxPurchaseQuantity) || Infinity;
  const parsed = parseInt(String(value), 10);
  const qty = isNaN(parsed) ? min : Math.max(parsed, min);
  return Math.max(min, Math.min(qty, max));
}

export function getQtyError(value: unknown, product: any): string | null {
  const parsed = parseInt(String(value), 10);
  const min = getMinQty(product);
  const max = Number(product?.maxPurchaseQuantity) || Infinity;
  if (isNaN(parsed) || parsed < min) {
    return `Minimum purchase quantity for this product is ${min}.`;
  }
  if (parsed > max) {
    return `Maximum purchase quantity for this product is ${max}.`;
  }
  return null;
}

export function isAvailableForSale(status: string, price: string | number) {
  const availableForSale = status == "available" && Number(price) > 0;
  return availableForSale;
}

export const replaceNullWithPlaceholder = (
  value: any,
  fallback: string = "N/A",
) => {
  if (isEmpty(value)) {
    return fallback;
  }

  return value;
};

export function isEmpty(val: unknown): boolean {
  if (val == null) return true; // Handles null and undefined
  if (typeof val === "boolean" || typeof val === "number") return false;

  // Type narrowing for objects/collections
  if (typeof val === "object" || typeof val === "function") {
    // Check for Map, Set, or custom collections with .size
    if ("size" in val && typeof (val as { size: unknown }).size === "number") {
      return (val as { size: number }).size === 0;
    }
    // Check for Array, String, or array-likes with .length
    if (
      "length" in val &&
      typeof (val as { length: unknown }).length === "number"
    ) {
      return (val as { length: number }).length === 0;
    }
    // Plain objects
    return Object.keys(val).length === 0;
  }

  return false;
}
