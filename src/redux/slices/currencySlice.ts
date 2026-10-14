import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Currency {
  code: string;
  rate: number;
}

interface CurrencyState {
  currencies: Currency[];
  selectedCurrency: string;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CurrencyState = {
  currencies: [],
  selectedCurrency: "USD",
  status: "idle",
};

// Only these currencies are offered in the store (in dropdown order)
export const SUPPORTED_CURRENCIES = ["USD", "GBP"];

// Fetch currencies via our own API route, which caches the open.er-api.com
// rates server-side for 3 hours (src/app/api/currency-rates/route.ts)
export const fetchCurrencies = createAsyncThunk(
  "currency/fetchCurrencies",
  async () => {
    const res = await axios.get("/api/currency-rates");
    const rates = res.data.rates;
    return SUPPORTED_CURRENCIES.filter((code) => rates[code] != null).map(
      (code) => ({
        code,
        rate: rates[code],
      }),
    );
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
      if (!SUPPORTED_CURRENCIES.includes(action.payload)) return;
      state.selectedCurrency = action.payload;
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
        // reset a previously saved currency that is no longer offered
        if (!SUPPORTED_CURRENCIES.includes(state.selectedCurrency)) {
          state.selectedCurrency = "USD";
        }
      })
      .addCase(fetchCurrencies.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setSelectedCurrency } = currencySlice.actions;
export default currencySlice.reducer;
