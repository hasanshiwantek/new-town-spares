import { useFormatPrice } from "@/hooks/useFormatPrice";
import { formatAmount } from "@/lib/money";

const ProductPrice: React.FC<{
  price: number;
  currency?: string;
  symbol?: string;
  showWas?: boolean;
  inline?: boolean;
  textColor?: string;
  className?: string;
}> = ({
  price,
  currency,
  symbol,
  showWas = false,
  inline = false,
  textColor,
  className,
}) => {
  const formatPrice = useFormatPrice();

  // With `currency`: an amount already in that currency (e.g. an order's),
  // shown as stored at the dashboard's decimal places — not rounded to the
  // penny first, the same way checkout shows prices
  const formattedPrice = currency
    ? formatAmount(Number(price) || 0, currency, symbol)
    : formatPrice(price);
  const baseClasses = "xl:text-[13.3px] 2xl:text-[16.6px] font-normal";
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  if (inline) {
    return (
      <span
        className={combinedClasses}
        style={textColor ? { color: textColor } : {}}
      >
        {showWas && "Was "}
        {formattedPrice}
      </span>
    );
  }

  return (
    <h2
      className={combinedClasses}
      style={textColor ? { color: textColor } : {}}
    >
      {showWas && "Was "}
      {formattedPrice}
    </h2>
  );
};

export default ProductPrice;
