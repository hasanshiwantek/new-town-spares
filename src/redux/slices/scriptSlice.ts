import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

interface ScriptItem {
    id: number;
    store_id: number;
    script_name: string;
    description: string;
    placement: "header" | "footer";
    location: string;
    script_category: string;
    script_type: "url" | "script";
    script_content: string | null;
    created_at: string;
    updated_at: string;
}

interface ScriptState {
    scripts: ScriptItem[];
    loading: boolean;
    error: string | null;
}

const initialState: ScriptState = {
    scripts: [],
    loading: false,
    error: null,
};

export const getScripts = createAsyncThunk(
    "scripts/getScripts",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get("web/scripts/get-script");
            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch scripts"
            );
        }
    }
);

const scriptSlice = createSlice({
    name: "scripts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getScripts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getScripts.fulfilled, (state, action) => {
                state.loading = false;
                state.scripts = action.payload?.script || [];
            })
            .addCase(getScripts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default scriptSlice.reducer;