import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAvailableForSale(status: string, price: string | number) {
  const availableForSale = status == "available" && Number(price) > 0;
  return availableForSale;
}
