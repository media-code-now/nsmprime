import React from 'react';
import { Metadata } from 'next';
import BlogSimple from './BlogSimple';
import fs from 'fs';
import path from 'path';

// Metadata
export const metadata: Metadata = {
  title: 'Digital Marketing Blog | NSM Prime',
  description: 'Expert insights and strategies for digital marketing success',
  openGraph: {
    title: 'Digital Marketing Blog | NSM Prime',
    description: 'Expert insights and strategies for digital marketing success',
    type: 'website',
    url: 'https://nsmprime.com/blog',
  },
};

// Simple Blog Post interface
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string;
  readTime: number;
  featuredImage: {
    url: string;
    alt: string;
  };
  tags: string[];
  category: string;
  isFeatured: boolean;
}

// Load data function
async function loadBlogData() {
  try {
    const postsPath = path.join(process.cwd(), 'public/data/posts.json');
    const postsData = await fs.promises.readFile(postsPath, 'utf-8');
    const postsJson = JSON.parse(postsData);
    const posts: BlogPost[] = Array.isArray(postsJson) ? postsJson : postsJson.posts || [];
    return posts;
  } catch (error) {
    console.error('Error loading blog data:', error);
    return [];
  }
}

// Main component
export default async function BlogPageSimple() {
  const posts = await loadBlogData();

  return <BlogSimple posts={posts} />;
}