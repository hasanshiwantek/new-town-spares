"use client";

import { CartQuoteSync } from "@/hooks/useCartQuote";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { Bounce, ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Prices the cart once for every cart total on the page */}
        <CartQuoteSync />
        {children}
        {/* Toastify container */}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </PersistGate>
    </Provider>
  );
}
