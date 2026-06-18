import ResetPassword from "@/app/components/Auth/ResetPassword";
import ProtectedRoute from "@/app/components/ProtectedPages/ProtectedRoute";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Reset Password",
    description:
        "Reset your New Town Spares account password via email.",
    robots: { index: false, follow: true },
};

export default function ResetPasswordPage() {
    return (
        <ProtectedRoute>
            <div>
                <ResetPassword />
            </div>
        </ProtectedRoute>
    );
}
