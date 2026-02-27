import Image from "next/image";
import React from "react";

const blogs = [
  {
    id: 1,
    date: "Dec 08, 2025",
    title:
      "2025 Chip Crisis: Why Server Memory, SSDs and GPUs Are Entering the Worst Shortage Yet",
    desc:
      "A Crisis Deeper Than 2020–2022 The 2025 hardware crisis marks a new chapter of earlier shortage expe...",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    id: 2,
    date: "Jun 28, 2024",
    title: "Cisco N2K-C2232PP10GE & N3K-C3048-FAN Cooling Tech",
    desc:
      "In the dynamic world of network hardware, the efficiency and reliability of cooling systems are para...",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
  },
  {
    id: 3,
    date: "Jun 28, 2024",
    title: "Cisco N9K-C9300-FAN2-B & N9K-C9300-FAN3 Cooling Fans",
    desc:
      "In the dynamic world of network technology, maintaining the optimal performance of network devices i...",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704",
  },
  {
    id: 4,
    date: "Jun 28, 2024",
    title: "Cisco Power Cables: CAB-9K12A-NA & CAB-AC-2800W-TWLK",
    desc:
      "In the dynamic landscape of modern technology, a robust and reliable network is the backbone of any...",
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c",
  },
];

const BlogHome = () => {
  return (
    <div className="bg-gray-50 py-12">
      {/* Heading */}
      <h2 className="text-[2.1rem] text-center mb-10">Blogs</h2>

      {/* Grid */}
      <div className="w-full mx-auto grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white transition duration-300 overflow-hidden border-1"
          >
            {/* Image */}
<div className="relative h-72 w-full overflow-hidden group">
  <Image
    src={`${blog.image}?auto=format&fit=crop&w=800&q=80`}
    alt={blog.title}
    fill
    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
    sizes="(max-width: 768px) 100vw,
           (max-width: 1200px) 50vw,
           384px"
    priority={blog.id === 1}
  />
</div>
            {/* Content */}
            <div className="p-3">
              <p className="text-[13px] text-gray-500 mb-2">{blog.date}</p>

              <h3 className="text-xl text-gray-500 mb-3 hover:text-blue-600 cursor-pointer">
                {blog.title}
              </h3>

              <p className="text-[14px] text-gray-600 text-sm">{blog.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="text-center mt-6">
        <button className="text-[14px] font-medium underline">
          View All Articles
        </button>
      </div>
    </div>
  );
};

export default BlogHome;