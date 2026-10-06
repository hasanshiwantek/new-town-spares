// store/slices/couponSlice.ts
import axiosInstance from "@/lib/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  getFromSessionStorage,
  getFromStorage,
  setInSessionStorage,
  setInStorage,
} from "@/utils/storage";

interface Coupon {
  id?: number;
  coupon_id?: number;
  couponCode?: string;
  coupon_code?: string;
  discountType?: "per_total_discount" | "percentage_discount" | string;
  discountAmount?: string | number;
  discount_amount?: string | number;
  enabled?: string;
  usageId?: number | null;
  manualDiscount?: string | number;
  // add other fields as needed
}

interface CouponUsageItem {
  id?: number;
  coupon_id?: number;
  coupon_code?: string;
  couponCode?: string;
  discount_amount?: string | number;
  email?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

interface CouponState {
  appliedCoupon: Coupon | null;
  couponUsageId: number | null;
  discountAmount: number;
  manualDiscount: number;
  loading: boolean;
  quoteToken: string | null;
  orderId: number | null;
  error: string | null;
}

const initialState: CouponState = {
  appliedCoupon: null,
  couponUsageId: null,
  discountAmount: 0,
  manualDiscount: 0,
  loading: false,
  error: null,
  quoteToken: null,
  orderId: null,
};

const normalizeCoupon = (
  coupon?: Partial<Coupon> | Partial<CouponUsageItem> | null,
) => {
  if (!coupon) return null;

  const code = coupon.couponCode ?? coupon.coupon_code ?? "";
  const couponId = "coupon_id" in coupon ? coupon.coupon_id : coupon.id;
  const discountValue =
    (coupon as Partial<Coupon>)?.discountAmount ??
    (coupon as Partial<CouponUsageItem>)?.discount_amount ??
    0;

  return {
    ...coupon,
    id: coupon.id ?? couponId ?? undefined,
    coupon_id: couponId ?? undefined,
    couponCode: code,
    coupon_code: code,
    discountAmount: Number(discountValue),
    discount_amount: Number(discountValue),
    usageId: couponId ?? null,
  } as Coupon;
};

export const fetchMyCouponUsage = createAsyncThunk(
  "coupon/fetchMyCouponUsage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/web/coupons/my-coupon-usage");
      const manualDiscount = response?.data?.manualDiscount;

      const usageData = response?.data?.data;
      const activeUsage = Array.isArray(usageData)
        ? usageData[0]
        : usageData || null;
      const normalizedUsage = normalizeCoupon(activeUsage);

      return {
        activeUsage: normalizedUsage,
        couponUsageId: activeUsage?.id ?? null,
        discountAmount: Number(normalizedUsage?.discountAmount ?? 0),
        manualDiscount: Number(manualDiscount ?? 0),
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch coupon usage",
      );
    }
  },
);

export const removeCoupon = createAsyncThunk(
  "coupon/remove",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const usageId =
        state.coupon?.couponUsageId ??
        state.coupon?.appliedCoupon?.usageId ??
        state.coupon?.appliedCoupon?.id ??
        null;

      if (usageId) {
        await axiosInstance.delete(`/web/coupons/my-coupon-usage/${usageId}`);
      }

      return { usageId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove coupon",
      );
    }
  },
);

// Async thunk to apply coupon
export const applyCoupon = createAsyncThunk(
  "coupon/apply",
  async (
    {
      couponCode,
      total,
      productIds,
    }: { couponCode: string; total: number; productIds?: (string | number)[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.get("/web/coupons/get-couponcode", {
        params: { couponCode, productIds },
      });

      const coupon = response?.data?.data;

      let discountAmount = 0;

      if (coupon.discountType === "per_total_discount") {
        discountAmount = Number(coupon.discountAmount);
      } else if (coupon.discountType === "percentage_discount") {
        discountAmount = (total * Number(coupon.discountAmount)) / 100;
      }

      return { coupon: normalizeCoupon(coupon), discountAmount };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply coupon",
      );
    }
  },
);

export const fetchLoadSavedQuote = createAsyncThunk(
  "cart/fetchLoadSavedQuote",
  async (quoteToken: string, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`web/cart/load-saved-quote`, {
        quoteToken,
      });
      const state = thunkAPI.getState() as RootState;
      const currentUserId = state.auth?.user?.id;
      const userId = res?.data?.data?.customer?.id;
      return res?.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load saved quote",
      );
    }
  },
);

export const fetchCustomerDiscounts = createAsyncThunk(
  "coupon/fetchCustomerDiscounts",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`dashboard/customer-discounts`);
      return res?.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load saved quote",
      );
    }
  },
);
const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    removeManualDiscount: (state) => {
      state.manualDiscount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.coupon;
        state.discountAmount = action.payload.discountAmount;
        state.error = null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMyCouponUsage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCouponUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.activeUsage ?? null;
        state.couponUsageId = action.payload.couponUsageId ?? null;
        state.discountAmount = Number(action.payload.discountAmount ?? 0);
        state.manualDiscount = Number(action?.payload?.manualDiscount ?? 0);
        state.error = null;
      })
      .addCase(fetchMyCouponUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(removeCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCoupon.fulfilled, (state) => {
        state.loading = false;
        state.appliedCoupon = null;
        state.couponUsageId = null;
        state.discountAmount = 0;
        state.error = null;
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchLoadSavedQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoadSavedQuote.fulfilled, (state, action) => {
        state.loading = false;
        const coupon = {
          discountAmount: Number(action?.payload?.data?.discountAmount),
          couponCode: action?.payload?.data?.couponCode,
        };
        let quoteToken: string | null = null;
        const isDraftUrl = action?.payload?.data?.isDraftUrl;
        const orderId = action?.payload?.data?.id;
        if (isDraftUrl) {
          try {
            quoteToken = new URL(isDraftUrl).searchParams.get("quoteToken");
            state.orderId = orderId;
          } catch {
            quoteToken = null;
          }
        }

        // state.quoteToken = quoteToken;
        state.error = null;
      })
      .addCase(fetchLoadSavedQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, removeManualDiscount } = couponSlice.actions;
export default couponSlice.reducer;
