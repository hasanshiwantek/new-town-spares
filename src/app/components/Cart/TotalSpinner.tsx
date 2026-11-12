// Shown in place of a cart total while the backend is pricing the cart
// (saved shipping rate and coupon not in yet), so the subtotal is never
// shown as the grand total
export default function TotalSpinner() {
  return (
    <span
      role="status"
      aria-label="Updating total"
      className="inline-block h-4 w-4 align-middle rounded-full border-2 border-gray-300 border-t-orange-500 animate-spin"
    />
  );
}
