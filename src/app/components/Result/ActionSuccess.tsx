"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";

const ActionSuccess = () => {
    const router = useRouter();
        const auth = useAppSelector((state: RootState) => state?.auth);
    const handleShopping = () => {
        router.push("/");
    };
    return (
        <main className="flex flex-col gap-8 w-full ">
            {/* Container: max-width 1170px, centered */}
            <div className="w-full max-w-[1170px] mx-auto px-4 lg:px-0 flex flex-col gap-6">
                {/* Heading */}
                <div className="w-full">
                    <h1 className="text-[28px] mt-1 text-[#8b8b8b] font-light">Your account has been created
                    </h1>
                    <div className=" p-0.5 gap-3 flex justify-center items-center  mt-1 text-[#545454]">
                        <div className="flex flex-col  items-center">
                            <p className="text-[14px]   font-light text-center">
                                Thank you for creating your account at Server Blink LLC. Your account details have been emailed to <span className="font-bold">{auth?.user?.email}</span>
                            </p>
                            <button onClick={handleShopping} className="btn-primary px-[30px]">
                                CONTINUE TO SHOPPING
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ActionSuccess;
