"use client";
import React from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import Link from "next/link";

const AccountInfoBar = () => {
  const auth = useAppSelector((state: RootState) => state?.auth);
  const isLoggedIn = Boolean(auth?.isAuthenticated);
  if (!isLoggedIn) return null;

  const firstName = auth?.user?.firstName;

  const cardClass =
    "flex items-center gap-[16.5px] p-[21px] bg-white shadow-[0_0_1px_0_rgba(0,0,0,0.5)]";
  const labelClass = "text-[#333333] text-[14px] leading-[16.8px]";
  const linkClass =
    "text-[#333333] text-[14px] leading-[21px] font-semibold underline hover:text-[#FD5430] transition-colors duration-200";
  const iconClass = "w-[30px] h-[30px] shrink-0";

  return (
    <div className="grid gap-[16.5px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Welcome */}
      <div className={cardClass}>
        <svg className={iconClass} fill="#333333" viewBox="0 0 448 512">
          <path d="M224 256a128 128 0 1 0 0-256 128 128 0 0 0 0 256zm89.6 32h-16.7a174.3 174.3 0 0 1-145.8 0h-16.7A134.4 134.4 0 0 0 0 422.4V464a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
        </svg>
        <div>
          <p className={labelClass}>
            Welcome back{firstName ? `, ${firstName}` : ""}
          </p>
          <Link href="/my-account/orders" className={linkClass}>
            Go to your account
          </Link>
        </div>
      </div>

      {/* Order History */}
      <div className={cardClass}>
        <svg className={iconClass} fill="#333333" viewBox="0 0 512 512">
          <path d="M504 255.53C504.25 392.17 392.82 503.9 256.18 504a246.96 246.96 0 0 1-155.82-54.91 23.98 23.98 0 0 1-1.84-35.6l11.27-11.28c8.6-8.6 22.35-9.55 31.89-1.98A183.25 183.25 0 0 0 256 440c101.7 0 184-82.31 184-184 0-101.7-82.31-184-184-184a183.36 183.36 0 0 0-126.07 49.93l50.76 50.76c10.08 10.08 2.94 27.31-11.32 27.31H24a16 16 0 0 1-16-16V38.63c0-14.26 17.23-21.4 27.31-11.32L84.7 76.7A247.16 247.16 0 0 1 256 8c136.81 0 247.75 110.78 248 247.53zm-180.91 78.79l9.82-12.63a24 24 0 0 0-4.2-33.68L288 256.35V152a24 24 0 0 0-24-24h-16a24 24 0 0 0-24 24v135.65l65.4 50.88a24 24 0 0 0 33.69-4.21z" />
        </svg>
        <div>
          <p className={labelClass}>Order History</p>
          <Link href="/my-account/orders" className={linkClass}>
            Go to your orders
          </Link>
        </div>
      </div>

      {/* Need Help */}
      <div className={cardClass}>
        <svg className={iconClass} fill="#333333" viewBox="0 0 512 512">
          <path d="M493.4 24.6l-104-24a24.16 24.16 0 0 0-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6a23.97 23.97 0 0 0-28-6.9l-112 48a24.29 24.29 0 0 0-14 27.6l24 104A24 24 0 0 0 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" />
        </svg>
        <div>
          <p className={labelClass}>Need help?</p>
          <Link href="tel:2096516864" className={linkClass}>
            Call us: (209) 651-6864
          </Link>
        </div>
      </div>

      {/* Message */}
      <div className={cardClass}>
        <svg className={iconClass} fill="#333333" viewBox="0 0 28 28">
          <path d="M0 23.5V11.1q.69.76 1.58 1.35 5.65 3.85 7.76 5.4.9.65 1.45 1.02t1.48.75 1.72.38h.03q.8 0 1.72-.38t1.47-.75 1.45-1.03q2.65-1.92 7.78-5.39.89-.6 1.56-1.36V23.5q0 1.03-.73 1.77T25.5 26h-23q-1.03 0-1.77-.73T0 23.5zM0 6.84q0-1.21.65-2.03t1.85-.8h23q1.02 0 1.76.73T28 6.5q0 1.24-.77 2.36t-1.9 1.92l-7.31 5.08q-.16.1-.67.48t-.84.6-.82.5-.9.42-.77.14h-.03q-.36 0-.79-.14t-.9-.42-.8-.5-.85-.6-.66-.48l-4.1-2.85-3.2-2.23q-.97-.66-1.83-1.8T0 6.84z" />
        </svg>
        <div>
          <p className={labelClass}>Drop us a message</p>
          <Link href="/my-account/messages" className={linkClass}>
            Go to your messages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoBar;
