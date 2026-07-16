"use client";
import BlogSidebar from "@/app/components/SingleBlog/BlogSidebar.tsx/BlogSidebar";
import SingleBlog from "@/app/components/SingleBlog/SingleBlog";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { getBlogs } from "@/redux/slices/storeFrontSlice";
import Link from "next/link";
import { useEffect } from "react";

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
    (state: any) => state.storeFront,
  );
  const blogPosts = blogs?.data;

  useEffect(() => {
    dispatch(getBlogs({ page: 1, perPage: 20 }));
  }, [dispatch]);

  // Calculate reading time
  const wordCount =
    singleBlog?.body?.replace(/<[^>]*>/g, "").split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
        <div className="hidden min-[551px]:block mt-[9px] mb-[21px] text-[13px] leading-[19.5px] text-[#333333]">
          <Link href="/" className="underline">
            Home
          </Link>
          <span className="mx-[10.5px]">/</span>
          <Link href="/blogs" className="underline">
            Blog
          </Link>
          <span className="mx-[10.5px]">/</span>
          <span>{singleBlog?.title}</span>
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
        <meta
          itemProp="description"
          content={singleBlog?.metaDescription || ""}
        />
        <meta itemProp="datePublished" content={singleBlog?.createdAt} />
        {singleBlog?.updatedAt && (
          <meta itemProp="dateModified" content={singleBlog.updatedAt} />
        )}
        <meta itemProp="author" content={singleBlog?.author} />
        <meta itemProp="image" content={singleBlog?.thumbnail} />
        <meta itemProp="inLanguage" content="en-US" />
        {singleBlog?.tags && (
          <meta itemProp="keywords" content={singleBlog.tags} />
        )}
        {readingTime > 0 && (
          <meta itemProp="timeRequired" content={`PT${readingTime}M`} />
        )}
        {wordCount > 0 && (
          <meta itemProp="wordCount" content={wordCount.toString()} />
        )}
        <div className="flex flex-col md:flex-row justify-between mx-[-10.5px]">
          <SingleBlog blogPost={singleBlog} />
          <BlogSidebar />
        </div>
      </article>
    </>
  );
};

export default SingleBlogContainer;
