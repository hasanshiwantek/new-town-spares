import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecentProduct {
  sku: string;
  name: string;
  image: string;
  price: number;
}

interface RecentState {
  items: RecentProduct[];
}

const initialState: RecentState = {
  items: [],
};

const recentSlice = createSlice({
  name: "recent",
  initialState,
  reducers: {
    addRecentView: (state, action: PayloadAction<RecentProduct>) => {
      const product = action.payload;
      // Remove existing same sku
      state.items = state.items.filter((p) => p.sku !== product.sku);
      // Add to top
      state.items.unshift(product);
      if (state.items.length > 20) state.items.pop();
    },
    clearRecent: (state) => {
      state.items = [];
    },
  },
});

export const { addRecentView, clearRecent } = recentSlice.actions;
export default recentSlice.reducer;
