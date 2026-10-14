import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddressData {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface Destination {
  id: string;
  address: AddressData | null;
  allocatedItems: string[];
  selectedShippingMethod: string;
  showItems: boolean;
}

interface MultiAddressState {
  isMultiAddress: boolean;
  destinations: Destination[];
  completedDestinations: Destination[];
  orderComment: string;
  destShippingRates: Record<string, any[]>;
  // Destinations whose rates are being (re-)quoted — checkout shows a loader
  // and blocks payment until they're in
  destRatesLoading: Record<string, boolean>;
}

const initialState: MultiAddressState = {
  isMultiAddress: false,
  destinations: [
    {
      id: "dest-1",
      address: null,
      allocatedItems: [],
      selectedShippingMethod: "",
      showItems: true,
    },
  ],
  completedDestinations: [],
  orderComment: "",
  destShippingRates: {},
  destRatesLoading: {},
};

const multiAddressSlice = createSlice({
  name: "multiAddress",
  initialState,
  reducers: {
    setIsMultiAddress: (state, action: PayloadAction<boolean>) => {
      state.isMultiAddress = action.payload;
    },
    setDestinations: (state, action: PayloadAction<Destination[]>) => {
      state.destinations = action.payload;
    },
    addDestination: (state, action: PayloadAction<Destination>) => {
      state.destinations.push(action.payload);
    },
    removeDestination: (state, action: PayloadAction<string>) => {
      state.destinations = state.destinations.filter(
        (d) => d.id !== action.payload,
      );
      delete state.destRatesLoading[action.payload];
    },
    updateDestinationAddress: (
      state,
      action: PayloadAction<{ destId: string; address: AddressData }>,
    ) => {
      const dest = state.destinations.find(
        (d) => d.id === action.payload.destId,
      );
      if (dest) dest.address = action.payload.address;
    },
    updateDestinationShippingMethod: (
      state,
      action: PayloadAction<{ destId: string; method: string }>,
    ) => {
      const dest = state.destinations.find(
        (d) => d.id === action.payload.destId,
      );
      if (dest) dest.selectedShippingMethod = action.payload.method;
    },
    toggleShowItems: (state, action: PayloadAction<string>) => {
      const dest = state.destinations.find((d) => d.id === action.payload);
      if (dest) dest.showItems = !dest.showItems;
    },
    setCompletedDestinations: (state, action: PayloadAction<Destination[]>) => {
      state.completedDestinations = action.payload;
    },
    setOrderComment: (state, action: PayloadAction<string>) => {
      state.orderComment = action.payload;
    },
    resetMultiAddress: () => initialState,

    // ✅ Reducer add karo
    setDestShippingRatesAction: (
      state,
      action: PayloadAction<Record<string, any[]>>,
    ) => {
      state.destShippingRates = action.payload;
    },

    setDestShippingRate: (
      state,
      action: PayloadAction<{ destId: string; rates: any[] }>,
    ) => {
      state.destShippingRates = {
        ...state.destShippingRates,
        [action.payload.destId]: action.payload.rates,
      };
    },
    setDestRatesLoading: (
      state,
      action: PayloadAction<{ destId: string; loading: boolean }>,
    ) => {
      const { destId, loading } = action.payload;
      if (loading) state.destRatesLoading[destId] = true;
      else delete state.destRatesLoading[destId];
    },
    clearMultiAddressProgress: (state) => {
      state.destinations = [
        {
          id: "dest-1",
          address: null,
          allocatedItems: [],
          selectedShippingMethod: "",
          showItems: true,
        },
      ];
      state.completedDestinations = [];
      state.orderComment = "";
      state.destShippingRates = {};
      state.destRatesLoading = {};
      // isMultiAddress preserve karo
    },
  },
});

export const {
  setIsMultiAddress,
  setDestinations,
  addDestination,
  removeDestination,
  updateDestinationAddress,
  updateDestinationShippingMethod,
  toggleShowItems,
  setCompletedDestinations,
  setOrderComment,
  resetMultiAddress,
  setDestShippingRatesAction,
  setDestShippingRate,
  setDestRatesLoading,
  clearMultiAddressProgress,
} = multiAddressSlice.actions;

export default multiAddressSlice.reducer;
