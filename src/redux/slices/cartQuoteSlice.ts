import type { OrderTotals } from "@/hooks/useFormatPrice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// The cart priced by the backend (order-calculate): saved shipping rate and
// coupon included. Kept by <CartQuoteSync />, read by every cart total
// (cart page, header cart, add-to-cart modal, cart sidebars).
interface CartQuoteState {
  totals: OrderTotals | null;
  loading: boolean;
}

const initialState: CartQuoteState = {
  totals: null,
  loading: false,
};

const cartQuoteSlice = createSlice({
  name: "cartQuote",
  initialState,
  reducers: {
    setCartQuote(state, action: PayloadAction<CartQuoteState>) {
      state.totals = action.payload.totals;
      state.loading = action.payload.loading;
    },
  },
});

export const { setCartQuote } = cartQuoteSlice.actions;
export default cartQuoteSlice.reducer;
