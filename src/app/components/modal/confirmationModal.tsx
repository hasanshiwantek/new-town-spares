"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { AlertTriangle, ShieldCheck, ShieldOff } from "lucide-react";

type ConfirmVariant = "enable" | "disable" | "warning";

export default function ConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  loading,
  variant = "enable",
  title,
  description,
}: {
  open: boolean;
  loading?: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: () => void;
  variant?: ConfirmVariant;
  title?: string;
  description?: string;
}) {
  const config = {
    enable: {
      icon: <ShieldCheck className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-50",
      title: title || "Enable this feature?",
      description:
        description ||
        "Are you sure you want to enable this? This will take effect immediately.",
      confirmLabel: "Enable",
      confirmClass: "bg-[#031033] hover:bg-[#031033] text-white",
    },
    disable: {
      icon: <ShieldOff className="w-5 h-5 text-red-500" />,
      iconBg: "bg-red-50",
      title: title || "Disable this feature?",
      description:
        description ||
        "Are you sure you want to disable this? This will take effect immediately.",
      confirmLabel: "Disable",
      confirmClass: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />,
      iconBg: "bg-yellow-50",
      title: title || "Are you sure?",
      description:
        description ||
        "This action cannot be undone. Please confirm to proceed.",
      confirmLabel: "CONFIRM",
      confirmClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
  };

  const c = config[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]! p-0 overflow-hidden">
        <div className="bg-white px-6 py-12 sm:px-10 sm:py-14 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-confirmation">
            <span className="text-6xl font-extrabold leading-none text-confirmation">
              !
            </span>
          </div>

          {/* Title */}
          <DialogTitle className="text-xl sm:text-2xl font-medium  text-confirmation-text">
            {c.title}
          </DialogTitle>

          {/* Description */}
          <DialogDescription className="mt-2 text-base sm:text-lg text-confirmation-text">
            {c.description}
          </DialogDescription>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="min-w-[123px] bg-confirmation hover:bg-confirmation px-10 py-3 h-auto text-xl font-bold text-white rounded-none border-0 shadow-none ring-0 focus:ring-0 focus-visible:ring-0"
            >
              CANCEL
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="min-w-[85px] bg-confirmation hover:bg-confirmation px-10 py-3 h-auto text-xl font-bold text-white rounded-none border-0 shadow-none ring-0 focus:ring-0 focus-visible:ring-0"
            >
              {loading ? "Please wait..." : c.confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
