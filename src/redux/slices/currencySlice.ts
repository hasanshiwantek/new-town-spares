import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { CurrencyFormat, setCurrencyFormats } from "@/lib/money";

export interface Currency extends CurrencyFormat {
  code: string;
  name: string;
  rate: number; // USD → currency, parsed from exchangeRate
  isDefault: boolean;
  payload: ApiCurrency; // the currency exactly as /web/currencies returned it
}

export interface ApiCurrency extends CurrencyFormat {
  id: number;
  code: string;
  name: string;
  exchangeRate: string;
  isDefault: boolean;
  [key: string]: unknown;
}

interface CurrencyState {
  currencies: Currency[];
  selectedCurrency: string;
  // Whole payload of the selected currency; persisted and sent with the order
  selectedCurrencyPayload: ApiCurrency | null;
  // true once the shopper picks a currency; until then the store default is used
  userSelected: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CurrencyState = {
  currencies: [],
  selectedCurrency: "USD",
  selectedCurrencyPayload: null,
  userSelected: false,
  status: "idle",
};

// Fetch the store's currencies (default first, then additional) from the backend
export const fetchCurrencies = createAsyncThunk(
  "currency/fetchCurrencies",
  async (): Promise<Currency[]> => {
    const res = await axiosInstance.get("web/currencies");
    const data: ApiCurrency[] = res.data?.data ?? [];
    const currencies = data.filter(Boolean).map((c: ApiCurrency) => ({
      code: c.code,
      name: c.name,
      rate: Number(c.exchangeRate),
      isDefault: c.isDefault,
      symbol: c.symbol,
      symbolLocation: c.symbolLocation,
      decimalToken: c.decimalToken,
      thousandsToken: c.thousandsToken,
      decimalPlaces: Number(c.decimalPlaces),
      payload: c,
    }));
    // formatMoney() reads these, so every price uses the store's settings
    setCurrencyFormats(currencies);
    return currencies;
  },
  {
    // Several header components dispatch this on mount; only the first runs
    condition: (_, { getState }) => {
      const { status } = (getState() as { currency: CurrencyState }).currency;
      return status !== "loading" && status !== "succeeded";
    },
  },
);

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setSelectedCurrency(state, action: PayloadAction<string>) {
      const match = state.currencies.find((c) => c.code === action.payload);
      if (state.currencies.length && !match) return;
      state.selectedCurrency = action.payload;
      state.selectedCurrencyPayload = match?.payload ?? null;
      state.userSelected = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currencies = action.payload;
        // Pre-select the store's default (isDefault) currency, unless the
        // shopper already picked one that is still offered
        const defaultCurrency =
          action.payload.find((c) => c.isDefault) ?? action.payload[0];
        if (
          defaultCurrency &&
          (!state.userSelected ||
            !action.payload.some((c) => c.code === state.selectedCurrency))
        ) {
          state.selectedCurrency = defaultCurrency.code;
        }
        // refresh the saved payload with the latest rate/format
        state.selectedCurrencyPayload =
          action.payload.find((c) => c.code === state.selectedCurrency)
            ?.payload ?? null;
      })
      .addCase(fetchCurrencies.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setSelectedCurrency } = currencySlice.actions;
export default currencySlice.reducer;
