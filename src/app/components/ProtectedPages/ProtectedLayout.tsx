"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { RootState } from "@/redux/store";
import { customerLogout, logout } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import dayjs from "dayjs";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, expireAt } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname || "/checkout")}`;
      router.replace(loginUrl);
      return;
    }

    if (!expireAt) return;

    const now = dayjs();
    const expiryTime = dayjs(expireAt);
    const timeoutDuration = expiryTime.diff(now);
    if (timeoutDuration <= 0) {
      dispatch(customerLogout())
        .unwrap()
        .then(() => {
          dispatch(logout());
          router.replace(
            `/auth/login?redirect=${encodeURIComponent(pathname || "/checkout")}`,
          );
        });
      return;
    }

    const timerId = setTimeout(() => {
      dispatch(customerLogout())
        .unwrap()
        .then(() => {
          dispatch(logout());
          router.replace(
            `/auth/login?redirect=${encodeURIComponent(pathname || "/checkout")}`,
          );
        });
    }, timeoutDuration);

    return () => clearTimeout(timerId); // cleanup
  }, [isAuthenticated, expireAt, dispatch, router, pathname]);

  // Loader while redirecting
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader border-7 border-[#F15939] border-t-transparent rounded-full w-32 h-32 animate-spin"></div>
      </div>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
}
