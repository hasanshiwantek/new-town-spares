import React from "react";
import CategoriesSidebar from "./CategoriesSidebar";
import RecentPost from "./RecentPost";
import SupportTeam from "./SupportTeam";
const BlogSidebar = () => {
  return (
    <>
      <main className="hidden md:flex flex-col gap-5 py-10 2xl:w-[27.9%] 2xl:max-w-[480px]  xl:max-w-[360px] xl:w-[27.9%]  w-full  ">
        <CategoriesSidebar />
        <RecentPost />
        <SupportTeam />
      </main>
    </>
  );
};

export default BlogSidebar;
