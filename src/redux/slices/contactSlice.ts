import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

interface ContactState {
    loading: boolean;
    success: string | null;
    error: string | null;
    // 
    newsletterLoading: boolean;
    newsletterSuccess: boolean;
    newsletterError: string | null;
}

const initialState: ContactState = {
    loading: false,
    success: null,
    error: null,
    // 
    newsletterLoading: false,
    newsletterSuccess: false,
    newsletterError: null,
};

interface ContactFormPayload {
    full_name: string;
    phone_number: string;
    email: string;
    order_number?: string;
    company_name?: string;
    rma_number?: string;
    comments: string;
}

// Newsletter thunk
export const subscribeNewsletter = createAsyncThunk(
    "contact/subscribeNewsletter",
    async (data: { email: string }, thunkAPI) => {
        try {
            const res = await axiosInstance.post("web/newsletters", data);
            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Newsletter subscription failed"
            );
        }
    }
);
export const contactRequests = createAsyncThunk(
    "contact/requests",
    async (data: ContactFormPayload, thunkAPI) => {
        try {
            const res = await axiosInstance.post("web/contact-requests/submit", data);
            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || ""
            );
        }
    }
);

// Slice
const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // Newsletter
            .addCase(subscribeNewsletter.pending, (state) => {
                state.newsletterLoading = true;
                state.newsletterSuccess = false;
                state.newsletterError = null;
            })
            .addCase(subscribeNewsletter.fulfilled, (state) => {
                state.newsletterLoading = false;
                state.newsletterSuccess = true;
            })
            .addCase(subscribeNewsletter.rejected, (state, action) => {
                state.newsletterLoading = false;
                state.newsletterError = action.payload as string;
            })

            // Conatact
            .addCase(contactRequests.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(contactRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message || "Request submitted successfully!";
            })
            .addCase(contactRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default contactSlice.reducer;
