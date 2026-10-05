// configSlice.ts
import { getFromStorage, removeFromStorage, setInStorage } from '@/utils/storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfigState {
  storeId: number | null;
}

const initialState: ConfigState = {
  storeId: typeof window !== 'undefined' ? Number(getFromStorage('storeId')) || null : null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setStoreId: (state, action: PayloadAction<number>) => {
      state.storeId = action.payload;
      setInStorage('storeId', action.payload.toString());
    },
    clearStoreId: (state) => {
      state.storeId = null;
      removeFromStorage('storeId');
    },
  },
});

export const { setStoreId, clearStoreId } = configSlice.actions;
export default configSlice.reducer;
