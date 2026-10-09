import { useFormatPrice } from "@/hooks/useFormatPrice";

const ProductPrice: React.FC<{ price: number; showWas?: boolean; inline?: boolean; textColor?: string; className?: string }> = ({ price, showWas = false, inline = false, textColor, className }) => {
  const formatPrice = useFormatPrice();

 const formattedPrice = formatPrice(price);
 const baseClasses = "xl:text-[13.3px] 2xl:text-[16.6px] font-normal";
 const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

  if (inline) {
    return (
      <span className={combinedClasses} style={textColor ? { color: textColor } : {}}>
        {showWas && "Was "}{formattedPrice}
      </span>
    );
  }

  return (
    <h2 className={combinedClasses} style={textColor ? { color: textColor } : {}}>
      {showWas && "Was "}{formattedPrice}
    </h2>
  );
};

export default ProductPrice;
