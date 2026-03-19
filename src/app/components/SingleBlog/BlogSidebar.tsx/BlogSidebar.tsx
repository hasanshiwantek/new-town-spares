import React from "react";
import CategoriesSidebar from "./CategoriesSidebar";
import RecentPost from "./RecentPost";
import SupportTeam from "./SupportTeam";
const BlogSidebar = () => {
  return (
    <>
      <main className="hidden md:flex flex-col gap-5 mt-20 2xl:w-[27.9%] xl:w-[25.9%] lg:w-[27.9%] w-full">
        {/* <CategoriesSidebar /> */}
        <RecentPost />
        {/* <SupportTeam /> */}
      </main>
    </>
  );
};

export default BlogSidebar;
