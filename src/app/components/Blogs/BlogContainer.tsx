"use client";
import React, { useEffect, useState } from "react";
import OurLatestBlogs from "./OurLatestBlogs";
import GridCard from "./GridCard";
import BlogTrending from "./BlogTrending";
import BlogCategories from "./BlogCategories";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { getBlogs } from "@/redux/slices/storeFrontSlice";

const BlogContainer = () => {
  const [filters, setFilters] = useState({ page: 1, perPage: 20 });
const dispatch = useAppDispatch();
const { blogs, error,loading } = useAppSelector(
  (state: any) => state.storeFront
);
const blogPosts = blogs?.data;
const pagination = blogs?.pagination || null;
console.log("Blogs data from frontend: ", blogPosts);
  useEffect(() => {
    dispatch(getBlogs(filters));
  }, [dispatch]);

  return (
    <div>
      <OurLatestBlogs />
      {/* <GridCard /> */}
      <BlogCategories blogPosts={blogPosts} error={error} loading={loading} pagination={pagination} 
  filters={filters}
  setFilters={setFilters} />
      {/* <BlogTrending /> */}
    </div>
  );
};

export default BlogContainer;
