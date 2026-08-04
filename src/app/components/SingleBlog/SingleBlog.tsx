import React from "react";
import BlogHeader from "./BlogHeader";
import { decode } from "html-entities";

const SingleBlog = ({ blogPost }: { blogPost: any }) => {
  const decodedHtml = decode(
    blogPost?.body?.replace(/<pre[^>]*>/gi, "")?.replace(/<\/pre>/gi, ""),
  );
  return (
    <>
      <div className="flex flex-col gap-5 2xl:w-[74%]  xl:w-[74%] lg:w-[74%] md:w-[70%] w-full">
        {blogPost?.thumbnail && <BlogHeader blogPost={blogPost} />}
        {/* <TableofContents /> */}

        {/* Blog Content Sections */}

        <div className="flex flex-col gap-9 ">
          <div
            className={`max-w-none api-content-wrapper`}
            dangerouslySetInnerHTML={{ __html: decodedHtml }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
