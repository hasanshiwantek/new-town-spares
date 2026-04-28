"use client";
import React from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import Link from "next/link";

const AccountInfoBar = () => {
    const auth = useAppSelector((state: RootState) => state?.auth);
    const isLoggedIn = Boolean(auth?.isAuthenticated);
    if (!isLoggedIn) return null;
    return (
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-4">

            {/* Welcome */}
            <div className="flex items-center gap-3 px-5 py-4 border border-gray-200  bg-white">
                <svg className="w-8 h-8 shrink-0" fill="#333333" stroke="none" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4-1.8 4-4s-1.3-4-4-4-4 1.8-4 4 1.3 4 4 4zm0 2c-4.4 0-8 2.7-8 6h16c0-3.3-3.6-6-8-6z" />
                </svg>
                <div>
                    <p className="text-[#333333] text-[1rem] mb-0.5">Welcome back, Ulric</p>
                    <Link href="/my-account/orders" className="text-[#333333] text-[1rem] font-semibold underline hover:text-[#FD5430] transition-colors duration-200">Go to your account</Link>
                </div>
            </div>

            {/* Order History */}
            <div className="flex items-center gap-3 px-5 py-4 border border-gray-200  bg-white">
                <svg className="w-8 h-8 shrink-0" fill="none" stroke="#333333" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3" /><path d="M3.05 11a9 9 0 1 0 .5-3" /><path d="M3 4v4h4" />
                </svg>
                <div>
                    <p className="text-[#333333] text-[1rem] mb-0.5">Order History</p>
                    <Link href="/my-account/orders" className="text-[#333333] text-[1rem] font-semibold underline hover:text-[#FD5430] transition-colors duration-200" >Go to your orders</Link>
                </div>
            </div>

            {/* Need Help */}
            <div className="flex items-center gap-3 px-5 py-4 border border-gray-200  bg-white">
                <svg className="w-8 h-8 shrink-0" fill="#333333" stroke="none" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.8 19.8 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
                </svg>
                <div>
                    <p className="text-[#333333] text-[1rem] mb-0.5">Need help?</p>
                    <Link href="tel:2096516864" className="text-[#333333] text-[1rem] font-semibold underline hover:text-[#FD5430] transition-colors duration-200">Call us: (209) 651-6864</Link>
                </div>
            </div>

            {/* Message */}
            <div className="flex items-center gap-3 px-5 py-4 border border-gray-200  bg-white">
                <svg className="w-8 h-8 shrink-0" fill="#333333" stroke="none" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <div>
                    <p className="text-[#333333] text-[1rem] mb-0.5">Drop us a message</p>
                    <Link href="/contact-us" className="text-[#333333] text-[1rem] font-semibold underline hover:text-[#FD5430] transition-colors duration-200">Go to your messages</Link>
                </div>
            </div>

        </div>
    );
};

export default AccountInfoBar;