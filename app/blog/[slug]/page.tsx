import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

// Blog Post interface
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

// Load all posts
async function loadPosts(): Promise<BlogPost[]> {
  try {
    const postsPath = path.join(process.cwd(), 'public/data/posts.json');
    const postsData = await fs.promises.readFile(postsPath, 'utf-8');
    const postsJson = JSON.parse(postsData);
    return Array.isArray(postsJson) ? postsJson : postsJson.posts || [];
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

// Find post by slug
async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await loadPosts();
  return posts.find(post => post.slug === slug) || null;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await loadPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | NSM Prime Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.modifiedDate,
      authors: [post.author.name],
      images: [
        {
          url: post.featuredImage.url,
          width: post.featuredImage.width,
          height: post.featuredImage.height,
          alt: post.featuredImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage.url],
    },
  };
}

// Blog Post Page Component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Format date
  const publishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Include original site CSS */}
      <link
        rel="stylesheet"
        type="text/css"
        href="//fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,300;0,600;0,800;1,800&family=Open+Sans:ital,wght@0,300;0,400;1,400&display=swap"
      />
      <link rel="stylesheet" href="/css/bootstrap.css" />
      <link rel="stylesheet" href="/css/style.css" />
      <link rel="stylesheet" href="/css/fonts.css" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featuredImage.url,
            "author": {
              "@type": "Person",
              "name": post.author.name,
              "description": post.author.bio,
            },
            "publisher": {
              "@type": "Organization",
              "name": "NSM Prime",
              "url": "https://nsmprime.com",
            },
            "datePublished": post.publishDate,
            "dateModified": post.modifiedDate,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://nsmprime.com/blog/${post.slug}`,
            },
            "url": `https://nsmprime.com/blog/${post.slug}`,
            "keywords": post.tags.join(", "),
            "articleSection": post.category,
            "wordCount": post.content.split(' ').length,
          }),
        }}
      />

      <article className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="text-white">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="mx-3 text-gray-300">•</span>
                  <span className="text-gray-300">{post.readTime} min read</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {post.title}
                </h1>
                <p className="text-xl text-gray-200 max-w-3xl">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Author & Date */}
          <div className="flex items-center mb-8 pb-8 border-b border-gray-200">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{post.author.name}</h3>
              <p className="text-gray-600 mb-1">{post.author.bio}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>Published {publishDate}</span>
                <span className="mx-2">•</span>
                <span>{post.views} views</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-800 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Social Share & Engagement */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-gray-500">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {post.views} views
              </div>
              <div className="flex items-center text-gray-500">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {post.likes} likes
              </div>
              <div className="flex items-center text-gray-500">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                {post.shares} shares
              </div>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <a
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Blog
            </a>
          </div>
        </div>
      </article>
    </>
  );
}