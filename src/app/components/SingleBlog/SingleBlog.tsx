import React from "react";
import BlogHeader from "./BlogHeader";
import TableofContents from "./TableofContents";
import FeaturedHBATable from "./FeaturedHBATable";
import Image from "next/image";
import Blogimg2 from "@/assets/blog/blogImage2.png";
import CommentForm from "./CommentForm";
// import css from "../../../styles/blog/BlogContent.module.css"

const SingleBlog = ({ blogPost }: { blogPost: any }) => {
  console.log("Blogpost data: ", blogPost);

  return (
    <>
      <div className="flex flex-col gap-5  py-5 px-3 lg:w-[72.5%] 2xl:w-[76.1%]  xl:w-[76.8%] w-full">
        <BlogHeader blogPost={blogPost} />
        {/* <TableofContents /> */}

        {/* Blog Content Sections */}

        <div className="flex flex-col gap-7">
          <section id="overview" className="scroll-mt-[140px]">
            <h2 className="text-xl md:text-[25px] text-[#333333] mb-3">Overview</h2>
            <p className="text-[15px] text-[#333333]">
              Host Bus Adapters (HBAs) are essential components in modern data
              storage, facilitating high-speed communication between servers and
              storage devices. This comprehensive guide explores HBA types, key
              features, and their critical role in optimizing data center
              performance. Discover how HBAs ensure efficient data transfer and
              enhance overall system reliability.
            </p>
          </section>

          <section id="understanding-hba" className="scroll-mt-[140px]">
            <h2 className="text-xl md:text-[25px] text-[#333333] mb-3">Understanding Host Bus Adapters</h2>
            <p className="text-[15px] text-[#333333]">
              HBAs are critical for connecting computers to storage devices...
            </p>
          </section>

          <section id="evolution-hba" className="scroll-mt-[140px]">
            <h2 className="text-xl md:text-[25px] text-[#333333] mb-3">The Evolution of HBA Technology</h2>
            <p className="text-[15px] text-[#333333]">
              The evolution of HBA technology has significantly enhanced data
              storage capabilities. Modern HBAs support advanced features such
              as PCIe Gen4 and NVMe, providing faster data transfer rates and
              reduced latency. These advancements enable businesses to handle
              increasing data volumes and demanding workloads with greater
              efficiency.
            </p>
          </section>

   

          <section id="evolution-hba" className="scroll-mt-[140px]">
            <h2 className="text-xl md:text-[25px] text-[#333333] mb-3">The Evolution of HBA Technology</h2>
            <p className="text-[15px] text-[#333333]">
              The evolution of HBA technology has significantly enhanced data
              storage capabilities. Modern HBAs support advanced features such
              as PCIe Gen4 and NVMe, providing faster data transfer rates and
              reduced latency. These advancements enable businesses to handle
              increasing data volumes and demanding workloads with greater
              efficiency.
            </p>

            <div className="w-full mt-6 relative aspect-[16/9] h-auto 2xl:h-[554px]">
              <Image
                src={Blogimg2}
                alt="Host Bus Adapter chip"
                fill
                className="object-contain rounded-md object-center 2xl:h-[554px]"
                priority
                sizes="100vw"
              />
            </div>
          </section>

          <section id="evolution-hba" className="scroll-mt-[140px]">
            <h2 className="text-xl md:text-[25px] text-[#333333] mb-3">The Evolution of HBA Technology</h2>
            <p className="text-[15px] text-[#333333]">
              The evolution of HBA technology has significantly enhanced data
              storage capabilities. Modern HBAs support advanced features such
              as PCIe Gen4 and NVMe, providing faster data transfer rates and
              reduced latency. These advancements enable businesses to handle
              increasing data volumes and demanding workloads with greater
              efficiency. Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Temporibus officiis tempora nisi consequatur nulla
              consectetur saepe iure sunt distinctio sint corporis quisquam
              dolore, magni laudantium maxime, ex rem blanditiis excepturi?
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis delectus ab veniam reiciendis deleniti a voluptates
              sapiente assumenda sit. Eaque obcaecati voluptas similique, cumque
              ullam et officia doloribus beatae fugiat!
            </p>
          </section>

          <section id="conclusion" className="scroll-mt-[140px]">
            <h2 className="text-xl md:text-[25px] text-[#333333] mb-3">Conclusion</h2>
            <p className="text-[15px] text-[#333333]">
              Host Bus Adapters (HBAs) are essential components in modern data
              storage, facilitating high-speed communication between servers and
              storage devices. This comprehensive guide explores HBA types, key
              features, and their critical role in optimizing data center
              performance. Discover how HBAs ensure efficient data transfer and
              enhance overall system reliability.
            </p>
          </section>


          {/* <div
            className={`max-w-none api-content-wrapper`}
            dangerouslySetInnerHTML={{ __html: blogPost?.body }}
          >
          </div > */}
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
