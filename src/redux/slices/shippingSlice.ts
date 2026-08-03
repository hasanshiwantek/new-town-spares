import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";


export const fetchShippingRates = createAsyncThunk(
    "shippingZone/fetchShippingRates",
    async ({ data }: { data: any }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`web/checkout/get-shipping-rates`, data);
            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch shipping rates"
            );
        }
    }
);


export const addShippingCost = createAsyncThunk(
    "cart/shipping-by-rate",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`web/cart/add/shipping-by-rate`, data);
            return res.data;
        } catch (err: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to add cart"
            );
        }
    }
);
export const fetchShippingRate = createAsyncThunk(
    "cart/fetchShippingDetails",
    async (data: any, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`web/cart/get/shipping-by-rate`);
            return res.data;
        } catch (err: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch shipping details"
            );
        }
    }
);
export const getCheckoutForm = createAsyncThunk(
    "cart/checkout-form/get",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`web/checkout-form/get`);
            return res.data;
        } catch (err: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch shipping details"
            );
        }
    }
);

export const checkoutFormSave = createAsyncThunk(
    "shippingZone/checkout-form",
    async ({ data }: { data: any }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`web/checkout-form/save`, data);
            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch shipping rates"
            );
        }
    }
);
export const removeShippingRate = createAsyncThunk(
    "shippingZone/remove-shipping-rate",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(`web/cart/remove-shipping-rate`);
            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to remove shipping rate"
            );
        }
    }
);
const initialState = {
    shippingRates: [] as any[],
    shippingDetail: null,
    saveDetail: null as any,
    ratesLoader: false,
    loading: false,
    error: null as string | null,
};

const shippingZoneSlice = createSlice({
    name: "shippingZone",
    initialState,
    reducers: {
        resetShippingRates: (state) => {
            state.shippingRates = [];
            state.ratesLoader = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchShippingRates.pending, (state) => {
                state.ratesLoader = true;
            })
            .addCase(fetchShippingRates.fulfilled, (state, action) => {
                state.ratesLoader = false;
                state.shippingRates = action.payload?.rates;
            })
            .addCase(fetchShippingRates.rejected, (state, action) => {
                state.ratesLoader = false;
                state.error = "Shipping is not available in your region.";
            })



            // add shipping rate
            .addCase(addShippingCost.pending, (state) => {
                state.loading = true;
            })
            .addCase(addShippingCost.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addShippingCost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed update";
            })


            // get shipping rate
            .addCase(fetchShippingRate.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchShippingRate.fulfilled, (state, action) => {
                state.shippingDetail = action.payload?.data || null;
                state.loading = false;
            })
            .addCase(fetchShippingRate.rejected, (state, action) => {
                state.loading = false;
                state.shippingDetail = null;
                state.error = action.error.message || "Failed get";
            })


            .addCase(getCheckoutForm.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCheckoutForm.fulfilled, (state, action) => {
                state.saveDetail = action.payload?.data || null;
                state.loading = false;
            })
            .addCase(getCheckoutForm.rejected, (state, action) => {
                state.loading = false;
                state.saveDetail = null;
                state.error = action.error.message || "Failed get";
            })
    },
});
export const { resetShippingRates } = shippingZoneSlice.actions;

export default shippingZoneSlice.reducer;
