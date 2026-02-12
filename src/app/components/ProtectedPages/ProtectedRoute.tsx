"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RootState } from "@/redux/store";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated]);
     
  if (isAuthenticated === undefined || isAuthenticated === null || isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader border-7 border-[#F15939] border-t-transparent rounded-full w-32 h-32 animate-spin"></div>
      </div>
    );
  }
  return <>{children}</>; // ✅ must return children inside a fragment or div
}