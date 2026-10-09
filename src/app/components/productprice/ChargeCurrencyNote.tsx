import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";

// Payments are always charged in USD; when another display currency is
// selected, show the exact USD amount the card will be charged.
const ChargeCurrencyNote = ({ usdTotal }: { usdTotal: number }) => {
  const selectedCurrency = useAppSelector(
    (state: RootState) => state.currency.selectedCurrency,
  );

  if (selectedCurrency === "USD") return null;

  return (
    <p className="mt-2 text-[12px] text-[#757575] text-right">
      Your card will be charged in USD: ${Number(usdTotal || 0).toFixed(2)}.{" "}
      {selectedCurrency} amounts are estimates.
    </p>
  );
};

export default ChargeCurrencyNote;
