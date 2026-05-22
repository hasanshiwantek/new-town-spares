// components/ShipToSingleAddressModal.tsx
"use client";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { clearMultiAddressProgress, resetMultiAddress, setIsMultiAddress } from "@/redux/slices/multiAddressSlice";
import { resetShippingRates } from "@/redux/slices/shippingSlice";

interface ShipToSingleAddressModalProps {
    open: boolean;
    onClose: () => void;
}

const ShipToSingleAddressModal: React.FC<ShipToSingleAddressModalProps> = ({
    open,
    onClose,
}) => {
    const dispatch = useAppDispatch();

    const handleProceed = () => {
        // dispatch(clearMultiAddressProgress());
        dispatch(resetMultiAddress());
        dispatch(resetShippingRates());
        dispatch(setIsMultiAddress(false));
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
                        Ship To A Single Address Instead
                    </DialogTitle>
                </DialogHeader>

                <p className="text-[16px] text-center text-gray-600 mt-1">
                    If you proceed, all progress for multiple addresses will be lost. This action cannot be undone.
                </p>

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={handleProceed}
                        className="btn-primary"
                    >
                        Proceed
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShipToSingleAddressModal;