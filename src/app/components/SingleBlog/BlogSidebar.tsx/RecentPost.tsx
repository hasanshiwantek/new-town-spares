"use client";
import { useAppSelector } from "@/hooks/useReduxHooks";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

const RecentPost = () => {
  const { blogs } = useAppSelector(
    (state: any) => state.storeFront,
  );
  const blogPosts = blogs?.data;
  return (
    <>
      {/* Live: 28px/33.6 #333, no margins */}
      <h3 className="text-[28px] leading-[33.6px] text-[#333333]">
        Popular Blogs
      </h3>
      <section className="w-full flex justify-center">
        <div className="w-full">
          <div>
            {blogPosts?.filter((item: any) => item?.thumbnail)?.map((blog: any) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="flex items-center bg-white p-[7px] mt-[14px] mx-[-10.5px] shadow-[0_0_1px_0_rgba(51,51,51,0.5)]"
              >
                <div className="w-[33.33%] shrink-0 px-[10.5px]">
                  {blog?.thumbnail && (
                    <Image
                      src={blog?.thumbnail}
                      alt={blog?.title}
                      width={0}
                      height={0}
                      sizes="100px"
                      className="w-full h-auto"
                    />
                  )}
                </div>
                <div className="w-[66.67%] px-[10.5px] text-left">
                  <h3 className="text-[13px] leading-[15.6px] uppercase text-black line-clamp-2">
                    {blog?.title}
                  </h3>
                  <p className="text-[13px] leading-[19.5px] text-[#333333]">
                    Posted {dayjs(blog?.createdAt).format("MMM DD, YYYY")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RecentPost;
