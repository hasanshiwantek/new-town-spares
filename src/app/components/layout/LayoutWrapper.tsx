import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import Providers from "../Providers";
interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <Providers>
      <Header />
      <PageTransition>{children}</PageTransition>
      <Footer />
      </Providers>
    </div>
  );
};

export default LayoutWrapper;
