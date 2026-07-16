import dayjs from "dayjs";
import Image from "next/image";

const BlogHeader = ({ blogPost }: { blogPost: any }) => {
  console.log("blogPost", blogPost);

  return (
    <section className="w-full bg-white">
      {/* Blog Title + Meta — live `header.blog-header` */}
      <div>
        {/* Title: live is 30px/36 with the link in #FD5430, margin 32px 0 11px */}
        <h1 className="text-[30px] leading-[36px] text-[#FD5430] mt-[32px] mb-[11px]">
          {blogPost?.title}
        </h1>

        {/* Meta Info — live: 14px/21 #333, margin 0 0 14px */}
        <div className="flex flex-wrap items-center text-[14px] leading-[21px] text-[#333333] mb-[14px]">
          <span>{dayjs(blogPost?.createdAt).format("MMM D, YYYY")}</span>
        </div>
      </div>

      {/* Blog Image — live uses `img-fluid` (width 100%, height auto), so the hero keeps
          the image's natural aspect ratio and is never cropped. width/height 0 + sizes is
          the Next.js recipe for a responsive image with an unknown intrinsic ratio. */}
      <Image
        src={blogPost?.thumbnail}
        alt={blogPost?.title}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto"
        priority
        quality={85}
      />
    </section>
  );
};

export default BlogHeader;
