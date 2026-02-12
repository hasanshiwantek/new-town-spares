// app/blog/[id]/page.tsx
import React from "react";
import Script from "next/script";
import SingleBlogContainer from "@/app/components/SingleBlog/SingleBlogContainer";
import { getBlogByIdServer } from "@/lib/api/products";
import { Metadata } from "next";
import navlogo from "@/assets/navlogo.png";

const SITE_NAME = "New Town Spares";
const BASE_URL = "https://nts-ecommerce.vercel.app";
const TWITTER_HANDLE = "@newtownspares"; 
const LOGO_URL = `${BASE_URL}/${navlogo}`; 

export async function generateMetadata({ 
  params,
}: { 
  params: Promise<{ id: string }>; 
}): Promise<Metadata> {
  
  const { id } = await params; 
  const blog = await getBlogByIdServer(id); 

  if (!blog) {
    return {
      title: `Blog Post Not Found | ${SITE_NAME}`,
      description: "This blog post could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Clean and optimize description
  const cleanDescription = blog.metaDescription?.substring(0, 160) ||
    blog.body?.replace(/<[^>]*>/g, '').substring(0, 160) || 
    `Read ${blog.title} by ${blog.author} on ${SITE_NAME}.`;

  // URL Construction
  const url = `${BASE_URL}/blogs/${blog.postUrl}`; 
  const imageUrl = blog.thumbnail || `${BASE_URL}/default-blog-image.svg`;

  return {
    // Basic Meta
    title: {
      absolute: `${blog.title} | ${SITE_NAME} Blog`,
    },
    description: cleanDescription,
    keywords: blog.tags || `${blog.title}, ${blog.author}, auto parts, car spare parts, blog, ${SITE_NAME}`,
    authors: [
      { 
        name: blog.author,
        url: blog.authorUrl || `${BASE_URL}/author/${encodeURIComponent(blog.author)}`,
      }
    ],
    creator: blog.author,
    publisher: SITE_NAME,
    category: blog.category || 'Automotive',

    // Canonical URL
    alternates: {
      canonical: url,
    },

    // Open Graph
    openGraph: {
      title: blog.title,
      description: cleanDescription,
      url,
      siteName: SITE_NAME, 
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
          type: 'image/jpeg',
        },
      ],
      type: "article",
      authors: [blog.author],
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt || blog.createdAt,
      section: blog.category || 'Automotive',
      tags: blog.tags?.split(',').map((tag: string) => tag.trim()) || [],
      locale: 'en_US',
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: cleanDescription,
      images: [imageUrl],
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Additional Meta
    other: {
      'article:author': blog.author,
      'article:published_time': blog.createdAt,
      'article:modified_time': blog.updatedAt || blog.createdAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  
  const { id } = await params;
  const blog = await getBlogByIdServer(id);

  if (!blog) {
    return (
      <main className="text-center p-10">
        <h1 className="text-2xl font-bold">Blog Post Not Found</h1>
        <p className="mt-2 text-gray-600">
          The requested post with ID "{id}" does not exist.
        </p>
      </main>
    );
  }

  // Calculate reading time (average 200 words per minute)
  const wordCount = blog.body?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);

  // Clean blog body for JSON-LD (remove HTML tags)
  const cleanBody = blog.body?.replace(/<[^>]*>/g, '').substring(0, 500) || '';

  // Article JSON-LD Structured Data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    alternativeHeadline: blog.metaDescription || blog.title,
    image: {
      '@type': 'ImageObject',
      url: blog.thumbnail || `${BASE_URL}/default-blog-image.svg`,
      width: 1200,
      height: 630,
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: blog.author,
      url: blog.authorUrl || `${BASE_URL}/author/${encodeURIComponent(blog.author)}`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    description: blog.metaDescription || cleanBody,
    articleBody: cleanBody,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blogs/${blog.postUrl}`,
    },
    keywords: blog.tags || '',
    articleSection: blog.category || 'Automotive',
    inLanguage: 'en-US',
    ...(wordCount > 0 && {
      wordCount: wordCount,
      timeRequired: `PT${readingTime}M`,
    }),
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BASE_URL}/blogs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: `${BASE_URL}/blogs/${blog.postUrl}`,
      },
    ],
  };

  // Website Search Action JSON-LD
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      {/* Article Structured Data */}
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(articleJsonLd) 
        }}
        strategy="beforeInteractive"
      />

      {/* Breadcrumb Structured Data */}
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(breadcrumbJsonLd) 
        }}
        strategy="beforeInteractive"
      />

      {/* Website Search Structured Data */}
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(websiteJsonLd) 
        }}
        strategy="beforeInteractive"
      />

      {/* Main Content */}
      <main>
        <SingleBlogContainer singleBlog={blog} />
      </main>
    </>
  );
}