// myAccountSlice.ts
import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface AccountState {
  order: any | null;
  address: any | null;
  loading: boolean;
  error: string | null;
  customerAddresses: any | null;
}

const initialState: AccountState = {
  order: null,
  address: null,
  loading: false,
   customerAddresses: null,
  error: null,
};

// Async thunk to fetch account details (POST request)
export const postAccountDetails = createAsyncThunk(
  "account/postAccountDetails",
  async (data:any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("dashboard/customers/account-settings", data);
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(   error.response?.data?.message  || error.message);
    }
  }
);

export const fetchAccountOrders = createAsyncThunk(
  "account/fetchAccountOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("dashboard/customers/my-orders");
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(   error.response?.data?.message  || error.message);
    }
  }
);

export const fetchAccountAddress = createAsyncThunk(
  "account/fetchAccountAddress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("dashboard/customers/my-addresses");
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(   error.response?.data?.message  || error.message);
    }
  }
);
export const fetchCustomerAddress = createAsyncThunk(
  "account/customer-address",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("dashboard/customer-address/list");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// Async thunk to update customer details (PUT request)

export const addCustomerAddress = createAsyncThunk(
  "account/addCustomerAddress",
  async ({ id, data }: { id: string | number; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `dashboard/customer-address/store`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatecustomer = createAsyncThunk(
  "account/updatecustomer",
  async ({ id, data }: { id: string | number; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `dashboard/customers/update-customer/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// export const deletecustomeraddress = createAsyncThunk(
//   "account/updatecustomer",
//   async ({ id }: { id: string | number; }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.delete(
//         `dashboard/customers/delete-my-address/${id}`

//       );
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );
export const deletecustomeraddress = createAsyncThunk(
  "account/deletecustomeraddress",
  async ({ id }: { id: string | number; }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `dashboard/customer-address/delete/${id}`

      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const updateCustomerAddress = createAsyncThunk(
  "account/updateCustomerAddress",
  async ({ id, data }: { id: string | number; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `dashboard/customer-address/update/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



const myAccountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountOrders.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
      state.order = action.payload;
      })
      .addCase(fetchAccountOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAccountAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountAddress.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
      state.address = action.payload;
      
       
      })
      .addCase(fetchAccountAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        
      })
        .addCase(fetchCustomerAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerAddress.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.customerAddresses = action.payload?.data?.customer_addresses;
      })
      .addCase(fetchCustomerAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
        // addCustomerAddress
      .addCase(addCustomerAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomerAddress.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
      })
      .addCase(addCustomerAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

     // updateCustomerAddress
      .addCase(updateCustomerAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerAddress.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
      })
      .addCase(updateCustomerAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(updatecustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatecustomer.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
      })
      .addCase(updatecustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(postAccountDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postAccountDetails.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
      })
      .addCase(postAccountDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default myAccountSlice.reducer;
