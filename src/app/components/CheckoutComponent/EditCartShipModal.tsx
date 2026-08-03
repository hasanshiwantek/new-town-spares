// components/EditCartShipModal.tsx
"use client";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { resetMultiAddress, setIsMultiAddress } from "@/redux/slices/multiAddressSlice";
import { resetShippingRates } from "@/redux/slices/shippingSlice";
import { CHECKOUT_STORAGE_KEY } from "./CheckoutComponent";
import { useRouter } from "next/navigation";

interface EditCartShipModalProps {
    open: boolean;
    onClose: () => void;
}

const EditCartShipModal: React.FC<EditCartShipModalProps> = ({
    open,
    onClose,
}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleProceed = () => {
        // dispatch(clearMultiAddressProgress());
        dispatch(resetMultiAddress());
        dispatch(resetShippingRates());
        dispatch(setIsMultiAddress(false));
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);
        router.push("/cart");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
                        Edit Cart
                    </DialogTitle>
                </DialogHeader>

                <p className="text-[16px] text-center text-gray-600 mt-1">
                    New items will default to Shipping Destination #1. Reallocate if you want them shipped to other destinations.
                </p>

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={handleProceed}
                        className="btn-primary"
                    >
                        Confirm
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditCartShipModal;