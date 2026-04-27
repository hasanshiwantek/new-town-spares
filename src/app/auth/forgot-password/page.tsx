import ForgotPasswordPage from '@/app/components/Auth/ForgotPassword';
import ProtectedRoute from '@/app/components/ProtectedPages/ProtectedRoute';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Forgot Password - New Town Spares",
    description:
        "Reset your New Town Spares password to regain access to your account.",
    keywords: [
        "forgot password",
        "password reset",
        "new town spares",
        "customer login",
        "account access",
        "order tracking"
    ],
    robots: { index: true, follow: true },
};


const page = () => {
    return (
        <ProtectedRoute>
            <div>
                <ForgotPasswordPage />
            </div>
        </ProtectedRoute>
    )
}

export default page