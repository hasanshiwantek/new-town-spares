import dayjs from "dayjs";
import Image from "next/image";

const BlogHeader = ({ blogPost }: { blogPost: any }) => {
  console.log("blogPost", blogPost);

  return (
    <section className="w-full bg-white">
      <div>
        <h1 className="text-[30px] leading-[36px] text-[#FD5430] mt-[32px] mb-[11px]">
          {blogPost?.title}
        </h1>
        <div className="flex flex-wrap items-center text-[14px] leading-[21px] text-[#333333] mb-[14px]">
          <span>{dayjs(blogPost?.createdAt).format("MMM D, YYYY")}</span>
        </div>
      </div>
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
