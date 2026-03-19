"use client";
import React, { useEffect } from "react";
import SingleBlog from "@/app/components/SingleBlog/SingleBlog";
import BlogSidebar from "@/app/components/SingleBlog/BlogSidebar.tsx/BlogSidebar";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { getBlogs } from "@/redux/slices/storeFrontSlice";
import BlogSkeleton from "../loader/BlogSkeleton";

interface SingleBlogContainerProps {
  singleBlog: {
    id: string;
    title: string;
    body: string;
    thumbnail: string;
    author: string;
    createdAt: string;
    updatedAt?: string;
    tags?: string;
    category?: string;
    metaDescription?: string;
    postUrl: string;
  };
}

const SingleBlogContainer = ({ singleBlog }: SingleBlogContainerProps) => {
  const dispatch = useAppDispatch();
  const { blogs, error, loading } = useAppSelector(
    (state: any) => state.storeFront
  );
  const blogPosts = blogs?.data;

  useEffect(() => {
    dispatch(getBlogs({ page: 1, perPage: 20 }));
  }, [dispatch]);

  // Calculate reading time
  const wordCount = singleBlog?.body?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Article wrapper with Schema.org markup */}
      <article 
        itemScope 
        itemType="https://schema.org/BlogPosting"
        className="w-full"
      >
        {/* Breadcrumb Navigation with Schema markup */}
        <div className="mb-6 text-sm md:text-base">
          <Link href="/" className="hover:text-[#F15939] transition-colors mx-1 text-[#333333] text-[13px] underline">
            Home
          </Link>{" "}
          / <span className="mx-1 text-[#333333] text-[13px] underline">Blog</span>
          / <span className="mx-1 text-[#333333] text-[13px]">{singleBlog?.title}</span>
        </div>
        {/* <nav 
          className="flex items-center mb-6"
          aria-label="Breadcrumb"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link 
              href="/" 
              className="h5-20px-regular transition-colors hover:text-blue-600"
              itemProp="item"
            >
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </span>
          
          <ChevronRight className="mx-2 w-5 h-5 text-gray-400" aria-hidden="true" />
          
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link 
              href="/blogs" 
              className="h5-20px-regular transition-colors hover:text-blue-600"
              itemProp="item"
            >
              <span itemProp="name">Blogs</span>
            </Link>
            <meta itemProp="position" content="2" />
          </span>
          
          <ChevronRight className="mx-2 w-5 h-5 text-gray-400" aria-hidden="true" />
          
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="h5-regular" itemProp="name">{singleBlog?.title}</span>
            <meta itemProp="position" content="3" />
          </span>
        </nav> */}

        {/* Hidden meta data for SEO */}
        <meta itemProp="headline" content={singleBlog?.title} />
        <meta itemProp="description" content={singleBlog?.metaDescription || ''} />
        <meta itemProp="datePublished" content={singleBlog?.createdAt} />
        {singleBlog?.updatedAt && (
          <meta itemProp="dateModified" content={singleBlog.updatedAt} />
        )}
        <meta itemProp="author" content={singleBlog?.author} />
        <meta itemProp="image" content={singleBlog?.thumbnail} />
        <meta itemProp="inLanguage" content="en-US" />
        {singleBlog?.tags && <meta itemProp="keywords" content={singleBlog.tags} />}
        {readingTime > 0 && <meta itemProp="timeRequired" content={`PT${readingTime}M`} />}
        {wordCount > 0 && <meta itemProp="wordCount" content={wordCount.toString()} />}

        {/* Main content with sidebar */}
        <div className="flex flex-row">
          <SingleBlog blogPost={singleBlog} />
          <BlogSidebar />
        </div>

   
      </article>
    </>
  );
};

export default SingleBlogContainer;