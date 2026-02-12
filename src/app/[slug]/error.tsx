"use client";

import { useEffect } from "react";
import Link from "next/link";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("🚨 Product Page Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
        <span className="text-3xl">⚠️</span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
        Oops! Something went wrong
      </h2>

      {/* Subtext */}
      <p className="mt-3 text-gray-600 max-w-md">
        We couldn’t load this product right now. It might be a network issue or
        a temporary glitch. Please try again, or explore other products.
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          🔄 Try Again
        </button>
        <Link
          href="/products"
          className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          🛍 Browse Products
        </Link>
      </div>
    </div>
  );
}
