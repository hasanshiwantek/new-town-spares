import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

export const getBlogs = createAsyncThunk(
  "storeFront/getBlogs",
  async ({ page, perPage }: any, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`web/blogs/blog-posts?page=${page}&perPage=${perPage}`);

      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);

export const getWebsiteSeo = createAsyncThunk(
  "storeFront/get-website-seo",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`web/store-setting/get-website-seo`);
      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch web pages"
      );
    }
  }
);

export const getBlogById = createAsyncThunk(
  "storeFront/getBlogById",
  async ({ id }: { id: any }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`web/blogs/blog-posts/${id}`);
      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch blogs by id"
      );
    }
  }
);
export const getWebPages = createAsyncThunk(
  "storeFront/getWebPages",
  async ({ page, perPage }: any, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`web/webpages/web-pages?page=${page}&perPage=${perPage}`);
      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch web pages"
      );
    }
  }
);

export const getWebPageById = createAsyncThunk(
  "storeFront/getWebPageById",
  async ({ id }: { id: any }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`web/webpages/web-pages/${id}`);
      console.log("Web Pages data by id: ", res.data);

      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch web pages by id"
      );
    }
  }
);

// 2. Initial State
const initialState = {
  blogs: [],
  singleBlog: [],
  webPages: [],
    websiteSeo: null,
  singleWebPage: [],
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
      })
      // 
      // get all web pages
      // 
      .addCase(getWebPages.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWebPages.fulfilled, (state, action) => {
        state.webPages = action?.payload;
        state.loading = false;

      })
      .addCase(getWebPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
        // get Website Seo 
      // 
      .addCase(getWebsiteSeo.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWebsiteSeo.fulfilled, (state, action) => {
        state.websiteSeo = action?.payload;
        state.loading = false;

      })
      .addCase(getWebsiteSeo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // get web page by id   
      .addCase(getWebPageById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWebPageById.fulfilled, (state, action) => {
        state.singleWebPage = action?.payload?.data;
        state.loading = false;
      }
      )
      .addCase(getWebPageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


  },
});

export default storeFrontSlice.reducer;
