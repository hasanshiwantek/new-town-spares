// src/redux/slices/cartsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { CHECKOUT_STORAGE_KEY } from "@/app/components/CheckoutComponent/CheckoutComponent";
export interface CartItem {
    productId: any;
    quantity: number;
    // baki jo bhi props product ke andar aate hain unhe dynamically allow karenge
    [key: string]: any;
}
interface ShippingRates {
    country: string;
    state: string;
    city: string;
    zip: string;
    cartIds: number[]; // ya string[]
    rate: any
}
interface CartState {
    items: CartItem[];
    loading: boolean;
    cartLoading: boolean;
    error: any;
}

export const addCart = createAsyncThunk(
    "cart/addCart",
    async ({ data }: { data: CartItem }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`web/cart/add-cart`, data);

            return res.data;
        } catch (err: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to add cart"
            );
        }
    }
);
export const cartTransfer = createAsyncThunk(
    "cart/addCart",
    async ({ data }: any, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`web/cart/transfer`);
            return res.data;
        } catch (err: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to add cart"
            );
        }
    }
);



export const fetchCartList = createAsyncThunk(
    "cart/fetchCartList",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`web/cart/list`);
            return res.data;
        } catch (err: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to add cart"
            );
        }
    }
);

export const updateCart = createAsyncThunk(
    "cart/update",
    async ({ id, data }: { id: string | number; data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `web/cart/update/${id}`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const fetchOrderDetails = createAsyncThunk(
    "cart/fetchOrderDetails",
    async ({ orderId }: { orderId: any }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`web/orders/order-details`, { orderId });
            return res.data;
        } catch (err: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch order details"
            );
        }
    }
);

export const deleteCart = createAsyncThunk(
    "account/updatecustomer",
    async ({ id }: { id: string | number; }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(
                `web/cart/delete/${id}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const removeProducts = createAsyncThunk(
    "account/updatecustomer",
    async (
        { product_ids }: { product_ids: number[] },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.delete(
                "web/cart/cart-remove-product",
                {
                    data: { product_ids },
                }
            );

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);



// Helper function to save cart into checkout localStorage
const saveCartToCheckoutStorage = (items: CartItem[]) => {
    try {
        const savedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
        if (!savedData) return;

        const checkoutData = JSON.parse(savedData);
        checkoutData._cartItems = items.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            // Add any other fields you need
        }));

        localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutData));
    } catch (e) {
       
    }
};




const initialState: CartState = {
    items: [],
    loading: false,
    cartLoading: false,
    error: null as string | any,
};

const cartsSlice = createSlice({
    name: "carts",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<any>) => {
            const newProduct = action.payload;
            const existingItem = state.items.find(
                (item) => item.id === newProduct.id
            );

            if (existingItem) {
                // ✅ increase by selected quantity
                existingItem.quantity += newProduct.quantity || 1;
            } else {
                // ✅ add new product with selected quantity
                state.items.push({
                    ...newProduct,
                    quantity: newProduct.quantity || 1,
                });
                saveCartToCheckoutStorage(state.items); // ✅ Save to localStorage whenever cart is updated
            }
        },


        removeFromCart: (state, action: PayloadAction<string | number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            saveCartToCheckoutStorage(state.items);
        },

        increaseQty: (state, action: PayloadAction<string | number>) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
            saveCartToCheckoutStorage(state.items);
        },

        decreaseQty: (state, action: PayloadAction<string | number>) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
            saveCartToCheckoutStorage(state.items);
        },
        updateQty: (
            state,
            action: PayloadAction<{ id: string | number; quantity: number }>
        ) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((i) => i.id === id);
            if (item) {
                item.quantity = quantity < 1 ? 1 : quantity;
            }
            saveCartToCheckoutStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveCartToCheckoutStorage(state.items);
        },
        // ✅ Restore Cart from localStorage
        restoreCart: (state, action: PayloadAction<any[]>) => {
            state.items = action.payload.map((item) => ({
                ...item,
                quantity: Number(item.quantity) || 1,
            }));
        },
    },

    extraReducers: (builder) => {
        builder

            // add
            .addCase(addCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCart.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed add cart";
            })



            // update
            .addCase(updateCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed update cart";
            })



            // get
            .addCase(fetchCartList.pending, (state) => {
                state.cartLoading = true;
            })
            .addCase(fetchCartList.fulfilled, (state, action) => {
                state.cartLoading = false;
                state.items = action.payload?.data?.map((item: any) => ({
                    ...item.product,
                    cartItemId: item.id,
                    quantity: item.quantity,
                })) ?? [];
            })
            .addCase(fetchCartList.rejected, (state, action) => {
                state.cartLoading = false;
                state.error = action.error.message || "Failed add cart";
            })


            // delete
            .addCase(deleteCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCart.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed update cart";
            })




    },
    // ✅ NEW: Restore cart from localStorage

});

export const {
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    updateQty,
    clearCart,
    restoreCart
} = cartsSlice.actions;

export default cartsSlice.reducer;
