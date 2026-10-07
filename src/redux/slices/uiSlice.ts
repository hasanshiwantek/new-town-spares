import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProductView = "list" | "grid";

interface UiState {
  productView: ProductView;
}

const initialState: UiState = {
  productView: "grid",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setProductView: (state, action: PayloadAction<ProductView>) => {
      state.productView = action.payload;
    },
  },
});

export const { setProductView } = uiSlice.actions;
export default uiSlice.reducer;