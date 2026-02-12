import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";

import homeReducer from "./slices/homeSlice";
import authReducer from "./slices/authSlice";
import configReducer from "./slices/configSlice";
import cartSliceReducer from "./slices/cartSlice";
import currencyReducer from "./slices/currencySlice";
import storeFrontReducer from "./slices/storeFrontSlice";
import myaccountReducer from "./slices/myaccountSlice";
import recentReducer from "./slices/recentSlice";
import orderReducer from "./slices/orderslice";

// ✅ only cart persist hoga
const cartPersistConfig = {
  key: "cart",
  storage,
};

// ✅ only auth persist hoga
const authPersistConfig = {
  key: "auth",
  storage,
};


// ✅ only recent persist hoga
const recentPersistConfig = {
  key: "recent",
  storage,
};

// ✅ only order persist hoga
const orderPersistConfig = {
  key: "order",
  storage,
};

const rootReducer = combineReducers({
  home: homeReducer,
  currency: currencyReducer,
  auth: persistReducer(authPersistConfig, authReducer), // persisted
  config: configReducer,
  cart: persistReducer(cartPersistConfig, cartSliceReducer), // persisted
  recent: persistReducer(recentPersistConfig, recentReducer),
  order: persistReducer(orderPersistConfig, orderReducer),
  storeFront: storeFrontReducer,
  myaccount: myaccountReducer ,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist ke liye required
    }),
});

export const persistor = persistStore(store);

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
