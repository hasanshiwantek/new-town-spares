import React from "react";
import Providers from "../Providers";
import Footer from "./Footer";
import Header from "./Header";
import PageTransition from "./PageTransition";
interface LayoutWrapperProps {
  children: React.ReactNode;
  topBanner?: React.ReactNode;
  bottomBanner?: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  children,
  topBanner,
  bottomBanner,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Providers>
        {topBanner}
        <Header />
        <PageTransition>{children}</PageTransition>
        {bottomBanner}
        <Footer />
      </Providers>
    </div>
  );
};

export default LayoutWrapper;
