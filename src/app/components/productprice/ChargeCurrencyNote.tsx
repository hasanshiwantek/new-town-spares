import { ENV_CONFIG } from "@/config/envConfig";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { formatMoney, money } from "@/lib/money";
import { RootState } from "@/redux/store";

// Payments are always charged in USD; when another display currency is
// selected, show the exact USD amount the card will be charged.
const ChargeCurrencyNote = ({ usdTotal }: { usdTotal: number }) => {
  const selectedCurrency = useAppSelector(
    (state: RootState) => state.currency.selectedCurrency,
  );

  if (selectedCurrency === "USD" || ENV_CONFIG.chargeInSelectedCurrency) return null;

  return (
    <p className="mt-2 text-[12px] text-[#757575] text-right">
      Your card will be charged in USD: {formatMoney(money(usdTotal, "USD"))}.{" "}
      {selectedCurrency} amounts are estimates.
    </p>
  );
};

export default ChargeCurrencyNote;
