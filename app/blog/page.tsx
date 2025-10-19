import React from 'react';
import { Metadata } from 'next';
import BlogClient from './BlogClient';
import fs from 'fs';
import path from 'path';

// Types
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishDate: string;
  modifiedDate: string;
  readTime: number;
  featuredImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  tags: string[];
  category: string;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  views: number;
  likes: number;
  shares: number;
}

interface TrendingPost {
  id: string;
  title: string;
  slug: string;
  trendingScore: number;
  views: number;
  engagement: number;
  publishDate: string;
}

// Metadata
export const metadata: Metadata = {
  title: 'Digital Marketing Insights & Strategies | NSM Prime Blog',
  description: 'Expert insights, actionable strategies, and industry trends to help your business thrive in the digital landscape. Latest articles on SEO, web development, social media marketing, and PPC optimization.',
  keywords: ['digital marketing', 'SEO', 'web development', 'social media marketing', 'PPC', 'content marketing', 'online advertising'],
  authors: [{ name: 'NSM Prime Team' }],
  openGraph: {
    title: 'Digital Marketing Insights & Strategies | NSM Prime Blog',
    description: 'Expert insights, actionable strategies, and industry trends to help your business thrive in the digital landscape.',
    url: 'https://nsmprime.com/blog',
    siteName: 'NSM Prime',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Digital Marketing Insights Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Insights & Strategies | NSM Prime Blog',
    description: 'Expert insights, actionable strategies, and industry trends to help your business thrive in the digital landscape.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=630&q=80']
  },
  alternates: {
    canonical: 'https://nsmprime.com/blog'
  }
};

// Load data at build time
async function loadBlogData() {
  try {
    const postsPath = path.join(process.cwd(), 'public/data/posts.json');
    const trendingPath = path.join(process.cwd(), 'public/data/trending.json');

    const postsData = await fs.promises.readFile(postsPath, 'utf-8');
    const trendingData = await fs.promises.readFile(trendingPath, 'utf-8');

    const postsJson = JSON.parse(postsData);
    const trendingJson = JSON.parse(trendingData);

    // Handle both array and object formats
    const posts: BlogPost[] = Array.isArray(postsJson) ? postsJson : postsJson.posts || [];
    const trendingPosts: TrendingPost[] = Array.isArray(trendingJson) ? trendingJson : trendingJson.trending || [];

    return { posts, trendingPosts };
  } catch (error) {
    console.error('Error loading blog data:', error);
    return { posts: [], trendingPosts: [] };
  }
}

// Main Blog Page Component (Server Component)
export default async function BlogPage() {
  const { posts, trendingPosts } = await loadBlogData();

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "NSM Prime Digital Marketing Blog",
            "description": "Expert insights, actionable strategies, and industry trends to help your business thrive in the digital landscape.",
            "url": "https://nsmprime.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "NSM Prime",
              "url": "https://nsmprime.com"
            },
            "blogPost": posts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "author": {
                "@type": "Person",
                "name": post.author.name
              },
              "datePublished": post.publishDate,
              "dateModified": post.modifiedDate,
              "image": post.featuredImage.url,
              "url": `https://nsmprime.com/blog/${post.slug}`
            }))
          })
        }}
      />

      <BlogClient posts={posts} trendingPosts={trendingPosts} />
    </>
  );
}