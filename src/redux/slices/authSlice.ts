import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { baseURL, storeId } from "@/lib/axiosInstance";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  password_confirmation?: string;
  companyName?: string;
  addressLine1?: string;
  addressLine2?: string;
  suburb?: string;
  country?: string;
  state?: string;
  zip?: string;
}

interface AuthState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  token: string | null;
  expireAt?: string | null;
  loginloading: boolean;
  registerLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  stores: { storeId: number; name?: string }[];
}

const initialState: AuthState = {
  user: null,
  token: null,
  expireAt: null,
  loginloading: false,
  registerLoading: false,
  error: null,
  isAuthenticated: false,
  stores: [],
};

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: any, thunkAPI) => {
    try {
      const res = await axiosInstance.post("customer-login", data);

      return res.data;
    } catch (err: any) {

      console.groupEnd();
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);
// customer profile thunk
export const customerProfile = createAsyncThunk(
  "auth/customer-profile",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("web/customer-profile");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Register thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData: RegisterPayload, thunkAPI) => {
    try {
      const res = await axiosInstance.post("user/register", formData);
      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Update Password thunk
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ data }: { data: any }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("auth/change-password", data);
      return res.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Password Updation failed"
      );
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.expireAt = null;
      state.isAuthenticated = false;
      // localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(loginUser.pending, (state) => {
        state.loginloading = true;
        state.error = null;
      })
      .addCase(customerProfile.pending, (state) => {
        state.loginloading = true;
        state.error = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.error = null;
      })

      // Fulfilled - login
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, customer, token, expireAt } = action.payload.data || action.payload;
        state.loginloading = false;
        state.user = user || customer;
        state.token = token;
        state.expireAt = expireAt;
        state.isAuthenticated = true;
        // state.stores = action.payload.stores.map((store: any) => ({
        //   storeId: store.id,
        //   name: store.name,
        // }));

        // localStorage.setItem("token", action.payload.token);
        // if (action.payload.stores?.length === 1) {
        //   localStorage.setItem("storeId", action.payload.stores[0].id.toString());
        // }
      })

      // Fulfilled - register
      .addCase(registerUser.fulfilled, (state, action) => {
        const { user, customer, token, expireAt } = action.payload.data || action.payload;
        state.registerLoading = false;
        state.user = customer || user;
        state.token = token;
        state.expireAt = expireAt;
        state.isAuthenticated = true;
      })
      .addCase(customerProfile.fulfilled, (state, action) => {

        const { user, customer, token, expireAt } = action.payload
        state.loginloading = false;
        state.user = user || customer;
        state.token = token;
        state.expireAt = expireAt;
        state.isAuthenticated = true;
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiry", expireAt);
        localStorage.setItem("user", JSON.stringify(customer));
      })
      // Rejected
      .addCase(loginUser.rejected, (state, action) => {
        state.loginloading = false;
        state.error = action.payload as string;
      })
      .addCase(customerProfile.rejected, (state, action) => {
        state.loginloading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
