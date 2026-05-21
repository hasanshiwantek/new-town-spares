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
const initialState = {
    shippingRates: [] as any[],
    ratesLoader: false,
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
                state.error = action.error.message || "Failed to fetch shipping rates";
            })
    },
});
export const { resetShippingRates } = shippingZoneSlice.actions;

export default shippingZoneSlice.reducer;