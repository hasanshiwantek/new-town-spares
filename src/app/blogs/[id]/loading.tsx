// File: app/blog/[id]/loading.tsx

import React from 'react';

// Tailwind CSS classes for animations and color
const shimmer = 'animate-pulse bg-gray-200';
const titleClass = `${shimmer} h-10 w-3/4 mb-4 rounded-lg`;
const subTitleClass = `${shimmer} h-6 w-1/4 mb-10 rounded-lg`;
const textLineClass = `${shimmer} h-4 rounded-lg`;
const imagePlaceholderClass = `${shimmer} w-full h-96 rounded-lg mb-8`;
const sidebarItemClass = `${shimmer} h-4 w-3/4 rounded-lg`;

const Loading = () => {
  return (
    // Outer container matching the main component's styling
    <main className="2xl:px-3 px-0 w-full xl:max-w-[1290px] 2xl:max-w-[1720px] mx-auto py-8">
      
      {/* 1. Breadcrumb Skeleton (nav) */}
      <nav className="flex items-center mb-10">
        <div className={`${subTitleClass} !w-16 !h-4`}></div> {/* Home */}
        <div className="mx-2 w-5 h-5 text-gray-400"></div> {/* ChevronRight */}
        <div className={`${subTitleClass} !w-16 !h-4`}></div> {/* Blogs */}
        <div className="mx-2 w-5 h-5 text-gray-400"></div> {/* ChevronRight */}
        <div className={`${subTitleClass} !w-40 !h-4`}></div> {/* Blog Title */}
      </nav>

      {/* 2. Main Content & Sidebar Layout */}
      <div className="flex gap-11 flex-col xl:flex-row">
        
        {/* Main Blog Post Area (approx 70% width) */}
        <div className="flex-grow"> 
            
            {/* Title */}
            <div className={`${titleClass} !w-full max-w-xl`}></div>
            
            {/* Date/Author */}
            <div className={`${subTitleClass} !w-1/3 !h-4 mb-12`}></div>
            
            {/* Main Image Placeholder */}
            <div className={`${imagePlaceholderClass}`}></div>

            {/* Content Body */}
            <div className="space-y-4">
                <div className={textLineClass}></div>
                <div className={`${textLineClass} w-11/12`}></div>
                <div className={`${textLineClass} w-10/12`}></div>
                <div className={`${textLineClass} w-8/12`}></div>
                
                {/* Second Paragraph Block */}
                <div className={`${textLineClass} !mt-10`}></div>
                <div className={`${textLineClass} w-9/12`}></div>
            </div>
        </div>

        {/* Sidebar Area (BlogSidebar) */}
        <div className="xl:w-[350px] w-full shrink-0">
          <div className="p-6 border rounded-lg space-y-6">
            <div className={`${titleClass} !h-7 !w-2/3 mx-auto mb-8`}></div> {/* Sidebar Title */}
            
            {/* Sidebar Items */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className={`${shimmer} h-12 w-12 rounded-full`}></div> {/* Thumbnail */}
                <div className="flex-1 space-y-2">
                  <div className={`${sidebarItemClass} !w-full !h-4`}></div>
                  <div className={`${sidebarItemClass} !w-1/2 !h-3`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 3. YOU MIGHT ALSO LIKE Skeleton (Related Posts) */}
      <div className="py-20">
        <div className={`${titleClass} !h-12 !w-1/3 mx-auto mb-10`}></div> {/* Section Title */}

        <div className="flex gap-10 flex-col sm:flex-row">
            {/* Three Related Post Cards */}
            {[...Array(3)].map((_, i) => (
                <div key={i} className="w-full">
                    {/* Image Placeholder */}
                    <div className={`${imagePlaceholderClass} h-64`}></div> 
                    {/* Title */}
                    <div className={`${textLineClass} !mt-4`}></div>
                    {/* Excerpt */}
                    <div className={`${textLineClass} w-3/4 !mt-2`}></div>
                </div>
            ))}
        </div>
      </div>
    </main>
  );
}

export default Loading;