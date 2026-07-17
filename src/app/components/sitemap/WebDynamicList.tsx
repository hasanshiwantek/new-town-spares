"use client"
import React, { useState, useEffect } from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks';
import { RootState } from '@/redux/store';
import Link from 'next/link'

const WebDynamicList = ({ webPages }: { webPages: any[] }) => {
    const auth = useAppSelector((state: RootState) => state?.auth);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("persist:auth");
        const parsedAuth = user ? JSON.parse(user) : null;
        const parsedToken = parsedAuth?.token ? JSON.parse(parsedAuth.token) : null;
        setToken(parsedToken);
    }, [auth]);

    const visiblePages = webPages
        ?.filter((page: any) => !page.restrictToCustomersOnly || token)
        .filter((item: any) => item?.showInNavigation);

    return (
        <section className="mb-8">
            <h2 className="text-[22px] text-[#545454] mb-2">• Pages</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
                {visiblePages?.map((page: any, i: number) => (
                    <li key={i}>
                        {page?.pageType == "2" ? (
                            <Link href={page?.link || "#"} target="_blank" rel="noopener noreferrer" className="text-[#333333] text-[14px] underline">
                                {page?.pageName}
                            </Link>
                        ) : (
                            <Link href={page?.slugWithUrl || page?.pageUrl || "#"} className="text-[#333333] text-[14px] underline">
                                {page?.pageName}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default WebDynamicList