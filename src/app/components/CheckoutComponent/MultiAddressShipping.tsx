"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, X, Info } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import {
    addDestination as addDestinationAction,
    removeDestination as removeDestinationAction,
    updateDestinationAddress,
    updateDestinationShippingMethod,
    toggleShowItems,
    setCompletedDestinations,
    setOrderComment,
    setDestinations,
} from "@/redux/slices/multiAddressSlice";
import { calculatePackage } from "./Shippingstep";
import { fetchShippingRates } from "@/redux/slices/shippingSlice";
import { setDestShippingRatesAction } from "@/redux/slices/multiAddressSlice";

interface CartItem {
    id: string | number; name: string; quantity: number; price: number;
    image?: { url?: string; path?: string }[];
}
interface ShippingRate {
    method_id: string; service_type: string; service_name: string;
    display_name: string; total_charge: number; is_fedex: boolean;
}
interface AddressData {
    firstName: string; lastName: string; company: string; phone: string;
    address1: string; address2: string; city: string; state: string;
    country: string; zip: string;
}
interface Destination {
    id: string; address: AddressData | null;
    allocatedItems: string[]; selectedShippingMethod: string; showItems: boolean;
}
interface MultiAddressShippingProps {
    cart: CartItem[]; shippingRates: ShippingRate[];
    onComplete: (destinations: Destination[]) => void;
    onSingleAddress: () => void; onContinue: () => void;
}

const emptyAddress: AddressData = {
    firstName: "", lastName: "", company: "", phone: "",
    address1: "", address2: "", city: "", state: "", country: "", zip: "",
};

const AddressModal: React.FC<{
    open: boolean; value: AddressData;
    onChange: (v: AddressData) => void; onSave: () => void; onClose: () => void;
}> = ({ open, value, onChange, onSave, onClose }) => {
    const [errors, setErrors] = useState<Record<string, string>>({});  // ✅ add

    const countryList = useMemo(() =>
        Country.getAllCountries().map((c) => ({ name: c.name, code: c.isoCode })), []);
    const stateList = useMemo(() => {
        if (!value.country) return [];
        return State.getStatesOfCountry(value.country).map((s) => ({ name: s.name, code: s.isoCode }));
    }, [value.country]);
    const cityList = useMemo(() => {
        if (!value.country || !value.state) return [];
        return City.getCitiesOfState(value.country, value.state).map((c) => ({ name: c.name }));
    }, [value.country, value.state]);

    // ✅ add
    const handleSave = () => {
        const e: Record<string, string> = {};
        if (!value.firstName.trim()) e.firstName = "First name is required";
        if (!value.lastName.trim()) e.lastName = "Last name is required";
        if (!value.address1.trim()) e.address1 = "Address is required";
        if (!value.country.trim()) e.country = "Country is required";
        if (!value.city.trim()) e.city = "City is required";
        if (!value.state.trim()) e.state = "State is required";
        if (!value.zip.trim()) e.zip = "Zip code is required";
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setErrors({});
        onSave();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto bg-[#eeeeee]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-center text-gray-800">Add Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[16px] text-gray-700 mb-1 block">First Name <span className="text-red-500">*</span></label>
                            <Input value={value.firstName} onChange={(e) => { onChange({ ...value, firstName: e.target.value }); setErrors(p => ({ ...p, firstName: "" })); }} className={`h-[42px] bg-white ${errors.firstName ? "border-red-500" : ""}`} />
                            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label className="text-[16px] text-gray-700 mb-1 block">Last Name <span className="text-red-500">*</span></label>
                            <Input value={value.lastName} onChange={(e) => { onChange({ ...value, lastName: e.target.value }); setErrors(p => ({ ...p, lastName: "" })); }} className={`h-[42px] bg-white ${errors.lastName ? "border-red-500" : ""}`} />
                            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="text-[16px] text-gray-700 mb-1 flex justify-between"><span>Company Name</span><span className="text-gray-400">(Optional)</span></label>
                        <Input value={value.company} onChange={(e) => onChange({ ...value, company: e.target.value })} className="h-[42px] bg-white max-w-full" />
                    </div>
                    <div>
                        <label className="text-[16px] text-gray-700 mb-1 flex justify-between"><span>Phone Number</span><span className="text-gray-400">(Optional)</span></label>
                        <Input value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} className="h-[42px] bg-white max-w-full" />
                    </div>
                    <div>
                        <label className="text-[16px] text-gray-700 mb-1 block">Address Line 1 <span className="text-red-500">*</span></label>
                        <Input value={value.address1} onChange={(e) => { onChange({ ...value, address1: e.target.value }); setErrors(p => ({ ...p, address1: "" })); }} className={`h-[42px] bg-white max-w-full ${errors.address1 ? "border-red-500" : ""}`} />
                        {errors.address1 && <p className="text-xs text-red-500 mt-1">{errors.address1}</p>}
                    </div>
                    <div>
                        <label className="text-[16px] text-gray-700 mb-1 flex justify-between"><span>Address Line 2</span><span className="text-gray-400">(Optional)</span></label>
                        <Input value={value.address2} onChange={(e) => onChange({ ...value, address2: e.target.value })} className="h-[42px] bg-white max-w-full" />
                    </div>
                    <div>
                        <label className="text-[16px] text-gray-700 mb-1 block">City <span className="text-red-500">*</span></label>
                        <Input value={value.city} onChange={(e) => { onChange({ ...value, city: e.target.value }); setErrors(p => ({ ...p, city: "" })); }} className={`h-[42px] bg-white max-w-full ${errors.city ? "border-red-500" : ""}`} />
                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    {/* <div>
                        <label className="text-[16px] text-gray-700 mb-1 block">City <span className="text-red-500">*</span></label>
                        <Select value={value.city} onValueChange={(v) => onChange({ ...value, city: v })}>
                            <SelectTrigger className="h-[42px] bg-white max-w-full"><SelectValue placeholder="Select a city" /></SelectTrigger>
                            <SelectContent>{cityList.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}

                    </div> */}
                    <div>
                        <label className="text-[16px] text-gray-700 mb-1 block">Country</label>
                        <Select value={value.country} onValueChange={(v) => onChange({ ...value, country: v, state: "", city: "", zip: "" })}>
                            <SelectTrigger className="h-[42px] bg-white max-w-full"><SelectValue placeholder="Select a country" /></SelectTrigger>
                            <SelectContent>{countryList.map((c) => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                        {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}

                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[16px] text-gray-700 mb-1 flex justify-between"><span>State/Province</span>{!stateList.length && <span className="text-gray-400">(Optional)</span>}</label>
                            {/* <label className="text-[16px] text-gray-700 mb-1 flex justify-between"><span>State/Province</span></label> */}
                            {stateList.length > 0 ? <Select value={value.state} onValueChange={(v) => onChange({ ...value, state: v, })}>
                                <SelectTrigger className="h-[42px] bg-white"><SelectValue placeholder="Select a state" /></SelectTrigger>
                                <SelectContent>{stateList.map((s) => <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>)}</SelectContent>
                            </Select> : <Input value={value.state} onChange={(e) => { onChange({ ...value, state: e.target.value }); setErrors(p => ({ ...p, state: "" })); }} className={`h-[42px] bg-white max-w-full ${errors.state ? "border-red-500" : ""}`} />
                            }
                            {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                        </div>
                        <div>
                            <label className="text-[16px] text-gray-700 mb-1 block">Postal Code</label>
                            <Input value={value.zip} onChange={(e) => onChange({ ...value, zip: e.target.value })} className="h-[42px] bg-white" />
                            {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={handleSave} className="btn-primary">Save Address</button>  {/* ✅ onSave → handleSave */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
const AllocateModal: React.FC<{
    open: boolean; cart: CartItem[]; destinations: Destination[];
    currentDestId: string;
    onAllocate: (allocations: { itemId: string | number; qty: number }[]) => void;
    onClose: () => void;
}> = ({ open, cart, destinations, currentDestId, onAllocate, onClose }) => {
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!open) return;
        const dest = destinations.find((d) => d.id === currentDestId);
        const init: Record<string, number> = {};
        cart.forEach((item) => {
            init[String(item.id)] = dest?.allocatedItems.filter(
                (s) => s.split("-")[0] === String(item.id)
            ).length || 0;
        });
        setQuantities(init);
    }, [open, currentDestId, destinations]);

    const getLeft = (itemId: string | number) => {
        const item = cart.find((c) => c.id === itemId);
        if (!item) return 0;
        const elsewhereSlots = new Set<string>();
        destinations.filter((d) => d.id !== currentDestId).forEach((d) => {
            d.allocatedItems.filter((s) => s.split("-")[0] === String(itemId)).forEach((s) => elsewhereSlots.add(s));
        });
        return item.quantity - elsewhereSlots.size;
    };

    const totalLeft = cart.reduce((sum, item) => sum + getLeft(item.id), 0);
    const destIndex = destinations.findIndex((d) => d.id === currentDestId);
    const currentDest = destinations.find((d) => d.id === currentDestId);

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-[640px] bg-white p-0 overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-center">Destination #{destIndex + 1}</h2>
                    {currentDest?.address && (
                        <p className="text-[16px] text-gray-500 text-center mt-1">
                            {currentDest.address.firstName} {currentDest.address.lastName},{" "}
                            {currentDest.address.address1},{" "}
                            {currentDest.address.city && `${currentDest.address.city}, `}
                            {currentDest.address.state && `${currentDest.address.state}, `}
                            {currentDest.address.country}
                            {currentDest.address.zip && `, ${currentDest.address.zip}`}
                        </p>
                    )}
                </div>
                <div className="px-6 py-3 bg-gray-50 border-b flex justify-between items-center">
                    <span className="text-[16px] text-gray-600">{totalLeft} item{totalLeft !== 1 ? "s" : ""} left to allocate</span>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => { const c: Record<string, number> = {}; cart.forEach((i) => { c[String(i.id)] = 0; }); setQuantities(c); }} className="text-[16px] text-red-600 hover:underline">Clear all</button>
                        <button type="button" onClick={() => { const a: Record<string, number> = {}; cart.forEach((i) => { a[String(i.id)] = getLeft(i.id); }); setQuantities(a); }} className="text-[16px] text-red-600 hover:underline">Select all items left</button>
                    </div>
                </div>
                <div className="px-6 py-2 bg-gray-50 border-b grid grid-cols-12 text-[16px] font-medium text-gray-600">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-3 text-center">Left to allocate</div>
                    <div className="col-span-3 text-center">Quantity</div>
                </div>
                <div className="overflow-y-auto max-h-[320px]">
                    {cart.map((item) => {
                        const left = getLeft(item.id);
                        const qty = quantities[String(item.id)] ?? 0;
                        const img = item.image?.[0]?.url || item.image?.[0]?.path || "";
                        return (
                            <div key={String(item.id)} className="grid grid-cols-12 gap-2 px-6 py-4 border-b items-center">
                                <div className="col-span-6 flex items-center gap-3">
                                    {img ? <img src={img} alt={item.name} className="w-12 h-12 object-contain border rounded flex-shrink-0" /> : <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0" />}
                                    <span className="text-[16px] text-gray-700 line-clamp-3">{item.name}</span>
                                </div>
                                <div className="col-span-3 text-center text-[16px] text-gray-600">{left}</div>
                                <div className="col-span-3 flex justify-center">
                                    <input type="number" min={0} max={left} value={qty}
                                        onChange={(e) => { const v = Math.min(Math.max(0, parseInt(e.target.value) || 0), left); setQuantities((prev) => ({ ...prev, [String(item.id)]: v })); }}
                                        className="w-16 h-9 border border-gray-300 rounded text-center text-[16px]" />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-[16px] border border-gray-300 rounded text-gray-600 hover:bg-gray-100">CANCEL</button>
                    <button type="button" onClick={() => { onAllocate(cart.map((item) => ({ itemId: item.id, qty: quantities[String(item.id)] || 0 }))); onClose(); }} className="px-6 py-2 text-[16px] bg-gray-200 text-gray-600 rounded hover:bg-gray-300 font-medium uppercase">ALLOCATE</button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const MultiAddressShipping = ({
    cart, shippingRates, onComplete, globalShippingRates, onSingleAddress, onContinue,
}: any) => {
    const dispatch = useAppDispatch();

    // ✅ Redux state
    const { destinations, orderComment } = useAppSelector((state) => state.multiAddress);

    // ✅ Local UI state only (modal controls)
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [allocateModalOpen, setAllocateModalOpen] = useState(false);
    const [editingDestId, setEditingDestId] = useState<string | null>(null);
    const [editingAddress, setEditingAddress] = useState<AddressData>(emptyAddress);
    const [destShippingRates, setDestShippingRates] = useState<Record<string, any[]>>({});
    const [destRatesLoading, setDestRatesLoading] = useState<Record<string, boolean>>({});

    const unallocatedCount = useMemo(() => {
        const allocatedPerItem: Record<string, Set<string>> = {};
        destinations.forEach((d) => {
            d.allocatedItems.forEach((slot) => {
                const itemId = slot.split("-")[0];
                if (!allocatedPerItem[itemId]) allocatedPerItem[itemId] = new Set();
                allocatedPerItem[itemId].add(slot);
            });
        });
        return cart.reduce((sum: any, item: any) => {
            const allocated = allocatedPerItem[String(item.id)]?.size || 0;
            return sum + Math.max(item.quantity - allocated, 0);
        }, 0);
    }, [destinations, cart]);
    const fetchRatesForDest = async (destId: string, address: AddressData) => {
        if (!address.country || !address.city) return;

        setDestRatesLoading((prev) => ({ ...prev, [destId]: true }));

        try {
            // ✅ Calculate package for this destination's allocated items only
            const dest = destinations.find((d) => d.id === destId);
            const allocatedCartItems = dest?.allocatedItems.reduce((acc: any[], slot) => {
                const itemId = slot.split("-")[0];
                const cartItem = cart.find((c: any) => String(c.id) === itemId);
                if (cartItem) {
                    const existing = acc.find((i) => i.id === cartItem.id);
                    if (existing) existing.quantity += 1;
                    else acc.push({ ...cartItem, quantity: 1 });
                }
                return acc;
            }, []) || cart;

            const pkg = calculatePackage(allocatedCartItems.length > 0 ? allocatedCartItems : cart);

            const res = await dispatch(fetchShippingRates({
                data: {
                    destination: {
                        country_code: address.country,
                        city: address.city,
                        state: address.state || "",
                        postal_code: address.zip || "",
                    },
                    package: pkg,
                },
            })).unwrap();

            // ✅ Store rates per destination
            setDestShippingRates((prev) => ({
                ...prev,
                [destId]: res?.rates || res || [],
            }));

            const rates = res?.rates || [];

            // ✅ Redux dispatch karo — local setState nahi
            dispatch(setDestShippingRatesAction({
                ...destShippingRates,
                [destId]: rates,
            }));
        } catch (err) {
            console.error("Failed to fetch rates for dest:", destId, err);
            setDestShippingRates((prev) => ({ ...prev, [destId]: [] }));
        } finally {
            setDestRatesLoading((prev) => ({ ...prev, [destId]: false }));
        }
    };
    const canContinue = useMemo(() =>
        unallocatedCount === 0 &&
        destinations.every((d) => d.address && d.allocatedItems.length > 0 && d.selectedShippingMethod),
        [unallocatedCount, destinations]
    );

    const openAddressModal = (destId: string, existing?: AddressData) => {
        setEditingDestId(destId);
        setEditingAddress(existing ? { ...existing } : { ...emptyAddress });
        setAddressModalOpen(true);
    };

    const saveAddress = () => {
        if (!editingDestId) return;
        dispatch(updateDestinationAddress({ destId: editingDestId, address: editingAddress }));
        fetchRatesForDest(editingDestId, editingAddress);
        setAddressModalOpen(false);
        setEditingDestId(null);
    };

    const handleAddDestination = () => {
        const newId = `dest-${Date.now()}`;
        dispatch(addDestinationAction({ id: newId, address: null, allocatedItems: [], selectedShippingMethod: "", showItems: true }));
        openAddressModal(newId);
    };
    const getActiveRates = (destId: string) => {
        const rates = destShippingRates[destId];
        if (rates && rates.length > 0) return rates;
        if (globalShippingRates?.length > 0) return globalShippingRates;
        return defaultRates;
    };
    const handleRemoveDestination = (destId: string) => {
        dispatch(removeDestinationAction(destId));
    };

    const allocateItems = (allocations: { itemId: string | number; qty: number }[]) => {
        if (!editingDestId) return;
        const updatedDestinations = destinations.map((d) => {
            if (d.id === editingDestId) {
                const withoutThese = d.allocatedItems.filter(
                    (slot) => !allocations.some((a) => slot.split("-")[0] === String(a.itemId))
                );
                const otherSlotCount: Record<string, number> = {};
                destinations.forEach((od) => {
                    if (od.id === editingDestId) return;
                    od.allocatedItems.forEach((slot) => {
                        const id = slot.split("-")[0];
                        otherSlotCount[id] = (otherSlotCount[id] || 0) + 1;
                    });
                });
                const newSlots = allocations.flatMap(({ itemId, qty }) => {
                    const offset = otherSlotCount[String(itemId)] || 0;
                    return Array.from({ length: qty }, (_, i) => `${itemId}-${offset + i}`);
                });
                return { ...d, allocatedItems: [...withoutThese, ...newSlots] };
            }
            return d;
        });
        dispatch(setDestinations(updatedDestinations));
    };

    const getGrouped = (slots: string[]) => {
        const map: Record<string, number> = {};
        slots.forEach((s) => { const id = s.split("-")[0]; map[id] = (map[id] || 0) + 1; });
        return map;
    };

    const defaultRates: ShippingRate[] = [
        { method_id: "own", service_type: "own", service_name: "", display_name: "Ship on my own/company shipping account (mention shipping account on order comments)", total_charge: 0, is_fedex: false },
        { method_id: "flat", service_type: "flat", service_name: "", display_name: "Flat Rate for under 10 LBS*", total_charge: 10, is_fedex: false },
    ];
    const activeRates = shippingRates?.length > 0 ? shippingRates : defaultRates;
    const lastDest = destinations[destinations.length - 1];
    const lastDestComplete = !!(
        lastDest?.address &&
        lastDest?.allocatedItems.length > 0 &&
        lastDest?.selectedShippingMethod
    );
    useEffect(() => {
        destinations.forEach((dest) => {
            if (dest.address && !destShippingRates[dest.id]) {
                // Rates nahi hain — re-fetch karo
                fetchRatesForDest(dest.id, dest.address);
            }
        });
    }, []);
    return (
        <div className="space-y-4">
            {/* Allocation status */}
            {unallocatedCount > 0 ? (
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded p-3 text-[16px] text-gray-700">
                    <Info size={16} className="text-gray-500 flex-shrink-0" />
                    <span>{unallocatedCount} item{unallocatedCount > 1 ? "s" : ""} left to allocate</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded p-3 text-[16px] text-green-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">All items are allocated.</span>
                </div>
            )}

            {/* Destinations */}
            {destinations.map((dest, index) => {
                const grouped = getGrouped(dest.allocatedItems);
                const totalAllocatedSlots = dest.allocatedItems.length;
                const activeRates = getActiveRates(dest.id);       // ✅ per dest rates
                const isLoadingRates = destRatesLoading[dest.id];
                return (
                    <div key={dest.id} className="border border-gray-300 rounded ">
                        <div className="flex items-center justify-between px-4 pt-4 pb-2">
                            <h4 className="font-bold text-2xl text-gray-800">Destination #{index + 1}</h4>
                            {destinations.length > 1 && (
                                <button type="button" onClick={() => handleRemoveDestination(dest.id)} className="text-gray-400 hover:text-gray-600">
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <div className="px-4 pb-4 space-y-3">
                            {dest.address ? (
                                <div className="flex items-start gap-2">
                                    <p className="text-[1rem] text-gray-600 flex-1 leading-snug">
                                        {dest.address.firstName} {dest.address.lastName},{" "}
                                        {dest.address.address1},{" "}
                                        {dest.address.city && `${dest.address.city}, `}
                                        {dest.address.state && `${dest.address.state}, `}
                                        {dest.address.country}
                                        {dest.address.zip && `, ${dest.address.zip}`}
                                    </p>
                                    <button type="button" onClick={() => openAddressModal(dest.id, dest.address!)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5">
                                        <Pencil size={13} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-[1rem] text-gray-600 font-medium">No shipping address entered</span>
                                    <button type="button" onClick={() => openAddressModal(dest.id)} className="text-[1rem] text-red-600 hover:underline">Enter shipping address</button>
                                </div>
                            )}

                            {dest.address && (
                                <>
                                    {totalAllocatedSlots > 0 ? (
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[1rem] font-bold text-gray-800">
                                                    {totalAllocatedSlots} item{totalAllocatedSlots > 1 ? "s" : ""} allocated
                                                </span>
                                                <div className="flex gap-4 text-[1rem]">
                                                    <button type="button" onClick={() => dispatch(toggleShowItems(dest.id))} className="text-xs text-red-600 hover:underline">
                                                        {dest.showItems ? "Hide items ▲" : "Show items ▼"}
                                                    </button>
                                                    <button type="button" onClick={() => { setEditingDestId(dest.id); setAllocateModalOpen(true); }} className="text-xs text-red-600 hover:underline">
                                                        Reallocate items
                                                    </button>
                                                </div>
                                            </div>
                                            {dest.showItems && (
                                                <div className="mt-1 space-y-0.5">
                                                    {Object.entries(grouped).map(([itemId, count]) => {
                                                        const item = cart.find((c: any) => String(c.id) === itemId);
                                                        return item ? <p key={itemId} className="text-[1rem] text-gray-600">{count} x {item.name}</p> : null;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[1rem] font-bold text-gray-700">No item allocated</span>
                                            <button type="button" onClick={() => { setEditingDestId(dest.id); setAllocateModalOpen(true); }} className="text-[1rem] text-red-600 hover:underline">Allocate items</button>
                                        </div>
                                    )}

                                    {totalAllocatedSlots > 0 && (
                                        <div>
                                            <h5 className="text-[1rem] font-bold text-gray-800 mb-2">Shipping Method</h5>
                                            {/* <div className="space-y-2">
                                                {activeRates.map((rate: any) => (
                                                    <label key={rate.service_type} className="flex items-center gap-2 text-[16px] text-gray-700 cursor-pointer">
                                                        <input type="radio" name={`shipping-${dest.id}`} value={rate.service_type}
                                                            checked={dest.selectedShippingMethod === rate.service_type}
                                                            onChange={() => dispatch(updateDestinationShippingMethod({ destId: dest.id, method: rate.service_type }))}
                                                            className="accent-blue-600" />
                                                        <span>{rate.display_name} — {rate.total_charge === 0 ? "$0.00" : `$${Number(rate.total_charge).toFixed(2)}`}</span>
                                                    </label>
                                                ))}
                                            </div> */}
                                            {isLoadingRates ? (
                                                <div className="space-y-2">
                                                    {[1, 2].map((i) => (
                                                        <div key={i} className="flex items-center gap-3 animate-pulse">
                                                            <div className="w-4 h-4 bg-gray-200 rounded-full" />
                                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                                            <div className="h-4 bg-gray-200 rounded w-12 ml-auto" />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {activeRates.map((rate: any) => (
                                                        <label key={rate.service_type} className="flex items-center gap-2 text-[1rem] text-gray-700 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name={`shipping-${dest.id}`}
                                                                value={rate.service_type}
                                                                checked={dest.selectedShippingMethod === rate.service_type}
                                                                onChange={() =>
                                                                    dispatch(updateDestinationShippingMethod({
                                                                        destId: dest.id,
                                                                        method: rate.service_type,
                                                                    }))
                                                                }
                                                                className="accent-blue-600"
                                                            />
                                                            <span className="flex-1 items-center text-[14px] font-normal">
                                                                {rate.is_fedex && (
                                                                    <span>
                                                                        FedEx
                                                                    </span>
                                                                )}
                                                                {rate.is_fedex ? `(${rate.service_name})` : rate.display_name}
                                                            </span>
                                                            <span className="font-semibold text-gray-900">
                                                                {rate.total_charge === 0 ? "$0.00" : `$${Number(rate.total_charge).toFixed(2)}`}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                );
            })}

            {unallocatedCount > 0 && (<button type="button"
                disabled={!lastDestComplete}
                onClick={handleAddDestination} className="bg-[var(--primary-color)] text-white text-[16px] font-medium px-3 py-2 uppercase hover:opacity-90">
                ADD NEW DESTINATION
            </button>)

            }
            {!lastDestComplete && destinations.length > 0 && (
                <p className="text-[13px] text-red-500 flex items-center gap-1">
                    <span>✕</span>
                    Please complete the address, item allocation, and method selection for Destination #{destinations.length}.
                </p>
            )}
            <div className="flex flex-col">
                <label className="text-[16px] font-medium text-gray-700 mb-1">Order Comments</label>
                <textarea rows={2} value={orderComment}
                    onChange={(e) => dispatch(setOrderComment(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-[16px] focus:outline-none resize-none" />
            </div>

            <button type="button"
                onClick={() => {
                    if (canContinue) {
                        dispatch(setCompletedDestinations(destinations));
                        //  onComplete(destinations); 
                        onComplete(destinations, destShippingRates);
                        onContinue();
                    }
                }}
                disabled={!canContinue}
                className={`px-6 py-2 text-[16px] font-medium uppercase ${canContinue ? "bg-[var(--primary-color)] text-white cursor-pointer hover:opacity-90" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                CONTINUE
            </button>

            <AddressModal open={addressModalOpen} value={editingAddress} onChange={setEditingAddress} onSave={saveAddress}
                onClose={() => { setAddressModalOpen(false); setEditingDestId(null); }} />
            <AllocateModal open={allocateModalOpen} cart={cart} destinations={destinations} currentDestId={editingDestId || ""}
                onAllocate={allocateItems} onClose={() => { setAllocateModalOpen(false); setEditingDestId(null); }} />
        </div>
    );
};

export default MultiAddressShipping;
