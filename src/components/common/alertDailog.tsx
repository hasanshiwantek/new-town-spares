"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AlertDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  // When set, the dialog becomes a confirm dialog with a Cancel button
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function AppAlertDialog({
  open,
  title = "Alert",
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
}: AlertDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* px sizes: the site's root font-size is 12px, so rem classes render small */}
          <AlertDialogTitle className="text-[22px]! leading-[1.3] font-normal text-[#333333]">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-[15px]! leading-[1.6] text-[#545454]">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {onConfirm && (
            <AlertDialogCancel
              onClick={onClose}
              className="h-[38px] px-[22px] text-[14px]!"
            >
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className="bg-confirmation text-white h-[38px] px-[22px] text-[14px]!"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
