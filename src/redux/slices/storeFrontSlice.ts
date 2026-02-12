import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

export const getBlogs = createAsyncThunk(
  "storeFront/getBlogs",
  async ({page,perPage}:any, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`web/blogs/blog-posts?page=${page}&perPage=${perPage}`);
      console.log("Blogs data: ", res.data);

      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);

export const getBlogById = createAsyncThunk(
  "storeFront/getBlogById",
  async ({ id }: { id: any }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`web/blogs/blog-posts/${id}`);
      console.log("Blogs data by id: ", res.data);

      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch blogs by id"
      );
    }
  }
);

// 2. Initial State
const initialState = {
  blogs: [],
  singleBlog: [],
  loading: false,
  error: null as string | null,
};

// 3. Slice
const storeFrontSlice = createSlice({
  name: "storeFront",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.blogs = action?.payload;
          state.loading = false; // <-- Add this!
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getBlogById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.singleBlog = action?.payload?.data;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default storeFrontSlice.reducer;
