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
        className="2xl:px-3 px-0 w-full xl:max-w-[1290px] 2xl:max-w-[1720px]"
      >
        {/* Breadcrumb Navigation with Schema markup */}
        <nav 
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
        </nav>

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
        <div className="flex gap-11 flex-row">
          <SingleBlog blogPost={singleBlog} />
          <BlogSidebar />
        </div>

        {/* Related posts section with Schema markup */}
        <section 
          className="xl:max-w-[1440px] 2xl:max-w-[1720px] py-10"
          aria-labelledby="related-posts-heading"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <h2 
            id="related-posts-heading"
            className="h1-secondary !text-[#4A4A4A] text-center mb-6"
            itemProp="name"
          >
            YOU MIGHT ALSO LIKE
          </h2>

          <div className="flex flex-wrap xl:flex-nowrap gap-10">
            {loading ? (
              <BlogSkeleton />
            ) : error ? (
              <div 
                className="w-full py-10 text-center text-red-500 font-medium"
                role="alert"
                aria-live="polite"
              >
                {error || "Something went wrong while fetching blogs."}
              </div>
            ) : blogPosts && blogPosts.length > 0 ? (
              blogPosts.slice(0, 3).map((blog: any, index: number) => (
                <article
                  key={blog.id || index}
                  className="relative w-full h-full xl:h-[28.1rem] xl:w-[32%] 2xl:h-[37.5rem] 2xl:w-[100%] rounded-lg overflow-hidden group"
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/BlogPosting"
                >
                  <meta itemProp="position" content={(index + 1).toString()} />
                  <meta itemProp="url" content={`/blogs/${blog.postUrl || blog.id}`} />
                  
                  {/* Blog thumbnail with proper Next.js Image */}
                  <Image
                    src={blog?.thumbnail}
                    alt={blog?.title || "Blog Image"}
                    width={547}
                    height={450}
                    className="w-full h-full object-cover object-center rounded-lg transition-transform duration-300 group-hover:scale-105"
                    itemProp="image"
                    loading="lazy"
                    quality={85}
                  />

                  {/* Blog title overlay */}
                  <div className="absolute left-4 bottom-3 md:bottom-8 xl:bottom-5 p-6 bg-gradient-to-t from-black/70 to-transparent w-full">
                    <Link 
                      href={`/blogs/${blog.id}`}
                      className="block"
                      aria-label={`Read more about ${blog?.title}`}
                    >
                      <h3 
                        className="text-white textxl sm:text-2xl md:text-5xl md:leading-14 font-medium xl:text-[27px] xl:leading-[33px] 2xl:text-[36px] 2xl:leading-[42px] line-clamp-2 transition-colors group-hover:text-blue-300"
                        itemProp="headline"
                      >
                        {blog?.title}
                      </h3>
                    </Link>
                    
                    {/* Hidden meta for related posts */}
                    {blog?.author && (
                      <meta itemProp="author" content={blog.author} />
                    )}
                    {blog?.createdAt && (
                      <meta itemProp="datePublished" content={blog.createdAt} />
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div 
                className="w-full py-10 text-center text-gray-500"
                role="status"
                aria-live="polite"
              >
                No blogs found.
              </div>
            )}
          </div>
        </section>
      </article>
    </>
  );
};

export default SingleBlogContainer;