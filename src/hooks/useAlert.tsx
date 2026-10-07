"use client";

import { useState } from "react";
import AppAlertDialog from "@/components/common/alertDailog";

type AlertOptions = {
  title?: string;
  message: string;
  // Pass to show Cancel + confirm buttons; called when the user confirms
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export function useAlert() {
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  const showAlert = (options: AlertOptions) => {
    setAlert(options);
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const Alert = () => {
    if (!alert) return null;

    return (
      <AppAlertDialog
        open={true}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
        onClose={closeAlert}
      />
    );
  };

  return {
    showAlert,
    Alert,
  };
}
