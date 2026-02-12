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

// Fetch currencies from open.er-api.com
export const fetchCurrencies = createAsyncThunk(
  "currency/fetchCurrencies",
  async () => {
    const res = await axios.get("https://open.er-api.com/v6/latest/USD");
    const rates = res.data.rates;
    return Object.keys(rates).map((code) => ({
      code,
      rate: rates[code],
    }));
  }
);

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setSelectedCurrency(state, action: PayloadAction<string>) {
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
      })
      .addCase(fetchCurrencies.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setSelectedCurrency } = currencySlice.actions;
export default currencySlice.reducer;
