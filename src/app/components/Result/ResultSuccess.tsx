"use client"
import React from "react";
const ResultSuccess = () => {
    return (
        <main className="flex flex-col gap-8 w-full">
            <div className="w-full max-w-[1170px] mx-auto px-4 lg:px-0 flex flex-col items-center gap-6">
                <div className="w-full flex flex-col items-center">
                    <h1 className="text-[28px] mt-1 text-[#333] font-normal text-center">Thanks for Subscribing!</h1>
                    <div className="border-none items-center p-3 flex gap-3 mt-5 text-[#545454] bg-[#d5ffd8] max-w-[750px] w-full">
                        <svg className="text-[#008a06] fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
                        <h1 className="text-[14px] font-light">
                            Thank you for joining our mailing list. You'll be sent the next issue of our newsletter shortly
                        </h1>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ResultSuccess;