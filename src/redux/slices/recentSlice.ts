import axiosInstance from "@/lib/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

export interface Product {
  id: number;
  brand: Brand | string;
  sku: string;
  name: string | { name?: string };
  price: number | string;
  msrp?: number;
  image?: { path?: string }[];
  slug: string;
  productUrl?: string;
  purchasabilityStatus?: string,
}
export interface RecentProduct {
  id: number;
  sku: string;
}


interface RecentState {
  items: RecentProduct[];
  products: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RecentState = {
  items: [],
  products: [],
  loading: false,
  error: null,
};
export const fetchRecentProductsByIds = createAsyncThunk(
  "recent/fetchRecentProductsByIds",
  async (ids: Array<number | string>, thunkAPI) => {
    try {
      const idsParam = ids.filter(Boolean).join(",");
      if (!idsParam) return [];

      const res = await axiosInstance.get(
        `web/products/product-byIds?ids=${idsParam}`
      );

      return res?.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);
const recentSlice = createSlice({
  name: "recent",
  initialState,
  reducers: {
    addRecentView: (state, action: PayloadAction<RecentProduct>) => {
      const product = action.payload;

      // duplicate remove (SKU based)
      state.items = state.items.filter(
        (p) => p.sku !== product.sku
      );

      // top pe add
      state.items.unshift(product);

      // limit 20
      if (state.items.length > 20) {
        state.items.pop();
      }
    },
    clearRecent: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentProductsByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentProductsByIds.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        state.products =
          payload?.data ??
          (Array.isArray(payload) ? payload : []);
      })
      .addCase(fetchRecentProductsByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch products";
      });
  },
});

export const { addRecentView, clearRecent } = recentSlice.actions;
export default recentSlice.reducer;
