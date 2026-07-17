// redux/slices/customerMessageSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

// ── Thunks ───────────────────────────────────────────────────────────────────

export const fetchUserOrders = createAsyncThunk(
    "customerMessage/fetchUserOrders",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`web/orders/my-orders-list`);
            return res?.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch orders"
            );
        }
    }
);

export const sendCustomerMessage = createAsyncThunk(
    "customerMessage/send",
    async (
        payload: {
            order_id: number;
            subject: string;
            message: string;
        },
        thunkAPI
    ) => {
        try {
            const res = await axiosInstance.post(
                `web/customer-messages/send`,
                payload
            );
            return res?.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to send message"
            );
        }
    }
);

export const fetchCustomerMessages = createAsyncThunk(
    "customerMessage/fetchAll",
    async (
        { page, pageSize }: { page?: number; pageSize?: number } = {},
        thunkAPI
    ) => {
        try {
            const res = await axiosInstance.get(`web/customer-messages/my-messages`);
            return res?.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch messages"
            );
        }
    }
);

export const orderDetailById = createAsyncThunk(
    "orders/orderDetailById",
    async ({ orderId }: { orderId: any }, thunkAPI) => {
        try {
            const response = await axiosInstance.get(
                `web/orders/order-detail?orderId=${orderId}`,
            );

            return response.data; // This will be a Blob
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch order detail",
            );
        }
    }
)
const initialState = {
    // orders dropdown
    orders: [] as any[],
    ordersLoading: false,

    // messages list
    messages: [] as any[],
    pagination: null as any,
    loading: false,

    // send message
    sendLoading: false,
    sendSuccess: false,

    error: null as string | null,


    orderDetail: null as any,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const customerMessageSlice = createSlice({
    name: "customerMessage",
    initialState,
    reducers: {
        resetSendSuccess(state) {
            state.sendSuccess = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // fetchUserOrders
            .addCase(fetchUserOrders.pending, (state) => {
                state.ordersLoading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.orders = action.payload?.data ?? [];
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.error = action.payload as string;
            })

            // sendCustomerMessage
            .addCase(sendCustomerMessage.pending, (state) => {
                state.sendLoading = true;
                state.sendSuccess = false;
                state.error = null;
            })
            .addCase(sendCustomerMessage.fulfilled, (state) => {
                state.sendLoading = false;
                state.sendSuccess = true;
            })
            .addCase(sendCustomerMessage.rejected, (state, action) => {
                state.sendLoading = false;
                state.error = action.payload as string;
            })

            // fetchCustomerMessages
            .addCase(fetchCustomerMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload?.data ?? [];
                state.pagination = action.payload?.pagination ?? null;
            })
            .addCase(fetchCustomerMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // fetchUserOrders
            .addCase(orderDetailById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(orderDetailById.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetail = action.payload?.data ?? [];
            })
            .addCase(orderDetailById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { resetSendSuccess } = customerMessageSlice.actions;
export default customerMessageSlice.reducer;