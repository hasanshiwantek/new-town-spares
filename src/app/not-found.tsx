import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "404 - Page Not Found | New Town Spares",
  description:
    "The page you're looking for doesn't exist. Return to New Town Spares homepage or browse our electronics, connectors, cables, and computer accessories.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "404 - Page Not Found | New Town Spares",
    description:
      "The page you're looking for doesn't exist. Return to New Town Spares homepage.",
    url: "https://nts-ecommerce.vercel.app/404",
    siteName: "New Town Spares",
    type: "website",
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-16">
      <div className="max-w-4xl w-full text-center">
        {/* 404 Number with Animation */}
        <div className="mb-8 relative">
          <h1 className="text-[120px] md:text-[180px] lg:text-[220px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f15939] via-[#e84949] to-[#f15939] animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-[#f15939] opacity-5 blur-3xl animate-pulse"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <h2 className="h1-lg mb-4 text-[#2a2a2a]">
            Oops! Page Not Found
          </h2>
          <p className="h5-20px-regular text-[#666666] mb-8 max-w-2xl mx-auto">
            The page you're looking for seems to have wandered off. Don't worry,
            we'll help you find your way back to our amazing products!
          </p>

          {/* Illustration or Icon */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[#f15939]/10 to-[#e84949]/5 flex items-center justify-center">
                <svg
                  className="w-24 h-24 md:w-32 md:h-32 text-[#f15939]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              className="btn-primary !px-8 !py-4 !text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Go to Homepage
            </Link>
            <Link
              href="/products"
              className="btn-outline-primary !px-8 !py-4 !text-lg font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Browse Products
            </Link>
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-200 pt-8">
            <p className="h6-regular text-[#666666] mb-4">Quick Links:</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link
                href="/products"
                className="text-[#f15939] hover:text-[#e84949] hover:underline transition-colors h6-regular"
              >
                Products
              </Link>
              <Link
                href="/blogs"
                className="text-[#f15939] hover:text-[#e84949] hover:underline transition-colors h6-regular"
              >
                Blogs
              </Link>
              <Link
                href="/cart"
                className="text-[#f15939] hover:text-[#e84949] hover:underline transition-colors h6-regular"
              >
                Cart
              </Link>
              <Link
                href="/checkout"
                className="text-[#f15939] hover:text-[#e84949] hover:underline transition-colors h6-regular"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#f15939] opacity-5 rounded-full blur-xl hidden md:block"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#e84949] opacity-5 rounded-full blur-xl hidden md:block"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-[#f15939] opacity-5 rounded-full blur-xl hidden lg:block"></div>
        <div className="absolute top-1/3 right-5 w-24 h-24 bg-[#e84949] opacity-5 rounded-full blur-xl hidden lg:block"></div>
      </div>
    </div>
  );
}

