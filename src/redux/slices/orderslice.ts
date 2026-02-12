import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  lastOrder: any | null;
}

const initialState: OrderState = {
  lastOrder: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setLastOrder: (state, action: PayloadAction<any>) => {
      state.lastOrder = action.payload;
    },
    clearLastOrder: (state) => {
      state.lastOrder = null;
    },
  },
});

export const { setLastOrder, clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer;
