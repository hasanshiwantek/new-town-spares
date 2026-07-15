// components/ShipToSingleAddressModal.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import {
  resetMultiAddress,
  setIsMultiAddress,
} from "@/redux/slices/multiAddressSlice";
import { resetShippingRates } from "@/redux/slices/shippingSlice";
import React from "react";

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
      <DialogContent className="gap-0! border-none outline-none sm:max-w-[680px] py-[19px]! px-[48px]!">
        <DialogHeader>
          <DialogTitle className="text-[18px] py-[21px] px-[24px] font-normal text-gray-800">
            Ship to a Single Address Instead
          </DialogTitle>
        </DialogHeader>

        <p className="text-[13px] font-normal text-gray-600 px-[24px]">
          If you proceed, all progress for multiple addresses will be lost. This
          action cannot be undone.
        </p>

        <div className="flex justify-end py-[21px] px-[24px]">
          <button type="button" onClick={handleProceed} className="btn-primary rounded-sm! px-8!">
            Proceed
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShipToSingleAddressModal;
