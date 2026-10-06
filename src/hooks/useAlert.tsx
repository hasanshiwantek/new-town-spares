"use client";

import { useState } from "react";
import AppAlertDialog from "@/components/common/alertDailog";

type AlertOptions = {
  title?: string;
  message: string;
};

export function useAlert() {
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  const showAlert = ({ title, message }: AlertOptions) => {
    setAlert({
      title,
      message,
    });
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
        onClose={closeAlert}
      />
    );
  };

  return {
    showAlert,
    Alert,
  };
}