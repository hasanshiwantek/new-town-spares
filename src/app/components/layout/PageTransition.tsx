// // file: components/layout/PageTransition.tsx
// "use client";

// import React from "react";
// import { usePathname } from "next/navigation";
// import { AnimatePresence, motion } from "framer-motion";

// export default function PageTransition({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();

//   return (
//     <AnimatePresence mode="wait" initial={false}>
//       <motion.main
//         key={pathname}
//         className={`flex-grow ${
//           pathname.includes("/auth")
//             ? ""
//             : "py-2 lg:px-[7%] xl:px-[7%] 2xl:px-[6%] md:px-[7%] px-[7%]"
//         }`}
//         initial={{ opacity: 0, y: 15 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{}} // You can customize exit transition if needed
//         transition={{ duration: 0.4, ease: "easeOut" }}
//       >
//         {children}
//       </motion.main>
//     </AnimatePresence>
//   );
// }

// file: components/layout/PageTransition.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className={`flex-grow ${
          pathname === "/" ||
          [
            "/auth",
            "/category",
            "/brand",
            "/privacyPolicy",
            "/payment-options",
            "/terms-conditions",
            "/shipping-policy",
            "/returnPolicy",
            "/contact-us",
            "/about-us",
          ].some((p) => pathname.includes(p))
            ? "w-full max-w-[1684px] mx-auto px-7 xl:px-28 pt-[12px] pb-[42px]"
            : // live's blog container is a flat 21px below 801, not the 5% the product
            // pages use (measured on newtownspares.com/blog/*)
            pathname.includes("/my-account") || pathname.includes("/blogs")
            ? "pt-[12px] pb-[42px] px-[21px] min-[801px]:px-[84px]"
            : "pt-[12px] pb-[42px] px-[5%] min-[801px]:px-[84px]"
        }`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        // exit={{}} // You can customize exit transition if needed
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
        <Toaster position="top-center" />
      </motion.div>
    </AnimatePresence>
  );
}
