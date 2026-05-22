import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddressData {
    firstName: string; lastName: string; company: string; phone: string;
    address1: string; address2: string; city: string; state: string;
    country: string; zip: string;
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
}

const initialState: MultiAddressState = {
    isMultiAddress: false,
    destinations: [
        { id: "dest-1", address: null, allocatedItems: [], selectedShippingMethod: "", showItems: true },
    ],
    completedDestinations: [],
    orderComment: "",
    destShippingRates: {},
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
            state.destinations = state.destinations.filter((d) => d.id !== action.payload);
        },
        updateDestinationAddress: (state, action: PayloadAction<{ destId: string; address: AddressData }>) => {
            const dest = state.destinations.find((d) => d.id === action.payload.destId);
            if (dest) dest.address = action.payload.address;
        },
        updateDestinationShippingMethod: (state, action: PayloadAction<{ destId: string; method: string }>) => {
            const dest = state.destinations.find((d) => d.id === action.payload.destId);
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
        setDestShippingRatesAction: (state, action: PayloadAction<Record<string, any[]>>) => {
            state.destShippingRates = action.payload;
        },
        clearMultiAddressProgress: (state) => {
            state.destinations = [
                { id: "dest-1", address: null, allocatedItems: [], selectedShippingMethod: "", showItems: true },
            ];
            state.completedDestinations = [];
            state.orderComment = "";
            state.destShippingRates = {};
            // isMultiAddress preserve karo
        },
    },
});

export const {
    setIsMultiAddress, setDestinations, addDestination, removeDestination,
    updateDestinationAddress, updateDestinationShippingMethod, toggleShowItems,
    setCompletedDestinations, setOrderComment, resetMultiAddress, setDestShippingRatesAction,
    clearMultiAddressProgress,
} = multiAddressSlice.actions;

export default multiAddressSlice.reducer;