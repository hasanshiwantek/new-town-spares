import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

interface AdvanceState {
    loading: boolean;
    success: string | null;
    error: string | null;
    products: any,
    categories: any,
    brands: any,
    productCount: number,
    pagination: any
}

const initialState: AdvanceState = {
    loading: false,
    success: null,
    error: null,
    products: [],
    categories: [],
    brands: [],
    productCount: 0,
    pagination: null
};

interface SearchPayload {
    // q: any;
    // perPage?: number;
    // page?: number;
    // sortBy?: string;
    q: any;
    perPage?: number;
    page?: number;
    sortBy?: string;
    categoriesIds?: string;
    brandId?: string;
    priceFrom?: string;
    priceTo?: string;
    featured?: string;
    freeShipping?: string;
    searchSubcategories?: string;
}

// Search thunk
export const advancedSearch = createAsyncThunk(
    "advanceSearch/advancedSearch",
    async ({ q, perPage = 12, page = 1, sortBy, categoriesIds, brandId, priceFrom, priceTo, featured, freeShipping, searchSubcategories }: SearchPayload, thunkAPI) => {
        try {
            const params = new URLSearchParams();
            if (q) params.append("q", q);
            params.append("perPage", perPage.toString());
            params.append("page", page.toString());
            if (sortBy) params.append("sortBy", sortBy);
            if (categoriesIds) params.append("categories", categoriesIds);
            if (brandId) params.append("brands", brandId);
            if (priceFrom) params.append("price_from", priceFrom);
            if (priceTo) params.append("price_to", priceTo);
            if (featured) params.append("featured", featured);
            if (freeShipping) params.append("free_shipping", freeShipping);
            if (searchSubcategories) params.append("search_subcategories", searchSubcategories);

            const res = await axiosInstance.get(`web/search?${params.toString().replace(/%2C/g, ",")}`);
            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Search failed"
            );
        }
    }
);
const advanceSearchSlice = createSlice({
    name: "advanceSearch",
    initialState,
    reducers: {
        clearSearchData: (state) => {
            // state.searchData = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Search
            .addCase(advancedSearch.pending, (state) => {
                state.loading = true;
                // state.searchData = null;
                state.error = null;
            })
            .addCase(advancedSearch.fulfilled, (state, action) => {
                const { data } = action.payload
                state.loading = false;
                state.products = data?.products?.items || [];
                state.categories = data?.categories?.items || [];
                state.brands = data?.brands?.items || [];
                state.productCount = data?.products?.count;
                state.pagination = data?.products?.pagination;
            })
            .addCase(advancedSearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSearchData } = advanceSearchSlice.actions;
export default advanceSearchSlice.reducer;