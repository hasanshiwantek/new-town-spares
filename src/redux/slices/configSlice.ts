// configSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfigState {
  storeId: number | null;
}

const initialState: ConfigState = {
  storeId: typeof window !== 'undefined' ? Number(localStorage.getItem('storeId')) || null : null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setStoreId: (state, action: PayloadAction<number>) => {
      state.storeId = action.payload;
      localStorage.setItem('storeId', action.payload.toString());
    },
    clearStoreId: (state) => {
      state.storeId = null;
      localStorage.removeItem('storeId');
    },
  },
});

export const { setStoreId, clearStoreId } = configSlice.actions;
export default configSlice.reducer;
