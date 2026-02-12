import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

export const globalSearch = createAsyncThunk(
  "home/globalSearch",
  async ({ query }: { query: any }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `web/products/search-product?query=${query}`
      );
      console.log("Main Search Data: ", res?.data);
      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch search data"
      );
    }
  }
);

export const getBrands = createAsyncThunk(
  "home/getBrands",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`web/brands/brands`);
      console.log("brands data: ", res.data);

      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch brands by id"
      );
    }
  }
);

export const fetchPopularProducts = createAsyncThunk(
  "home/fetchPopularProducts",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`web/products/popular-products`);
      console.log("Popular products: ", res.data);

      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch popular products"
      );
    }
  }
);

export const fetchReviews = createAsyncThunk(
  "home/fetchReviews",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        "https://widget.advertsedge.com/api/reviews-nts"
      );
      return res?.data?.data ?? [];
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ??
          err?.message ??
          "Unable to load testimonials. Please try again."
      );
    }
  }
);

export const fetchStats = createAsyncThunk(
  "home/fetchStats",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        "https://widget.advertsedge.com/api/stats-nts"
      );
      if (res?.data?.status && res?.data?.data) {
        return res.data.data;
      }
      return null;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("Error fetching stats:", err);
      // Don't reject, just return null
      return null;
    }
  }
);

export const bulkInquiry = createAsyncThunk(
  "home/bulkInquiry",
  async (payload: any, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        `web/bulk-inquiries/submit`,
        payload
      );

      if (res?.data?.status && res?.data?.data) {
        console.log("Bulk inquiry response:", res?.data);
        return res.data;
      }

      return null;
    } catch (err: any) {
      console.error("Error sending bulk inquiry:", err);
      return null;
    }
  }
);

export const contactUs = createAsyncThunk(
  "home/contactUs",
  async (payload: any, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        `web/contact-requests/submit`,
        payload
      );

      if (res?.data?.status && res?.data?.data) {
        console.log("Contact us response:", res?.data);
        return res.data;
      }

      return null;
    } catch (err: any) {
      console.error("Error sending contact request:", err);
      return null;
    }
  }
);

// 2. Initial State
const initialState = {
  statistics: null,
  groups: [],
  wellerStatus: [],
  searchData: [],
  getBrand: [],
  popularProducts: [],
  reviews: [] as any[],
  reviewsLoading: false,
  reviewsError: null as string | null,
  stats: null as any,
  statsLoading: false,
  loading: false,
  error: null as string | null,
  popularProductsLoading: false,
};

// 3. Slice
const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // GLOBAL SEARCH
      .addCase(globalSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(globalSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.searchData = action.payload;
      })
      .addCase(globalSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch search data";
      })
      .addCase(getBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.getBrand = action.payload;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch getBrand data";
      })
      .addCase(fetchPopularProducts.pending, (state) => {
        state.popularProductsLoading = true;
      })
      .addCase(fetchPopularProducts.fulfilled, (state, action) => {
        state.popularProductsLoading = false;
        state.popularProducts = action.payload;
      })
      .addCase(fetchPopularProducts.rejected, (state, action) => {
        state.popularProductsLoading = false;
        state.error = action.error.message || "Failed to fetch getBrand data";
      })
      // REVIEWS
      .addCase(fetchReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.payload as string;
        state.reviews = [];
      })
      // STATS
      .addCase(fetchStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state) => {
        state.statsLoading = false;
        // Stats error is not critical, so we don't set error state
      });
  },
});

export default homeSlice.reducer;
