import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import advanceSearchReducer from "./slices/advanceSearchSlice";
import authReducer from "./slices/authSlice";
import cartsSliceReducer from "./slices/cartsSlice";
import configReducer from "./slices/configSlice";
import contactReducer from "./slices/contactSlice";
import couponReducer from "./slices/couponSlice";
import currencyReducer from "./slices/currencySlice";
import homeReducer from "./slices/homeSlice";
import multiAddressReducer from "./slices/multiAddressSlice";
import myaccountReducer from "./slices/myaccountSlice";
import orderMessageReducer from "./slices/OrderMessage";
import orderReducer from "./slices/orderslice";
import recentReducer from "./slices/recentSlice";
import scriptReducer from "./slices/scriptSlice";
import shippingZoneReducer from "./slices/shippingSlice";
import storeFrontReducer from "./slices/storeFrontSlice";
import uiReducer from "./slices/uiSlice";

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

// ✅ only order persist hoga
const couponPersistConfig = {
  key: "coupon",
  storage,
};

// ✅ only selected currency persisted
const currencyPersistConfig = {
  key: "currency",
  storage,
  whitelist: ["selectedCurrency"],
};

const rootReducer = combineReducers({
  home: homeReducer,
  currency: persistReducer(currencyPersistConfig, currencyReducer),
  auth: persistReducer(authPersistConfig, authReducer), // persisted
  config: configReducer,
  // cart: persistReducer(cartPersistConfig, cartSliceReducer), // persisted
  recent: persistReducer(recentPersistConfig, recentReducer),
  order: persistReducer(orderPersistConfig, orderReducer),
  coupon: couponReducer,
  storeFront: storeFrontReducer,
  myaccount: myaccountReducer,
  shippingZone: shippingZoneReducer,
  multiAddress: multiAddressReducer,
  contact: contactReducer,
  advanceSearch: advanceSearchReducer,
  scripts: scriptReducer,
  carts: cartsSliceReducer,
  customerMessage: orderMessageReducer,
  ui: uiReducer,
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
