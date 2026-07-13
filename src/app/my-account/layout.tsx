// app/my-account/layout.tsx
import React from "react";
import MyAccountTabs from "../components/layout/MyAccountLayoutWrapper";
import ProtectedLayout from "../components/ProtectedPages/ProtectedLayout";

const MyAccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProtectedLayout>
        <div className="max-w-[1684px] mx-auto pt-[9px] pb-[21px]">
          {/* Client component for breadcrumb + tabs */}
          <MyAccountTabs />

          {/* Tab content */}
          <div>{children}</div>
        </div>
      </ProtectedLayout>
    </>
  );
};

export default MyAccountLayout;
