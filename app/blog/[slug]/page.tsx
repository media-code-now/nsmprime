import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

      <article style={{ minHeight: '100vh', backgroundColor: 'white' }}>
        {/* Hero Section */}
        <div className="position-relative overflow-hidden" style={{ height: '500px' }}>
          <img
            src={post.featuredImage.url}
            alt={post.featuredImage.alt}
            className="w-100 h-100"
            style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
          />
          <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
          <div className="position-absolute w-100 h-100 d-flex align-items-end" style={{ top: 0, left: 0 }}>
            <div className="container pb-5">
              <div className="text-white">
                <div className="d-flex align-items-center mb-3">
                  <span className="badge badge-primary px-3 py-2 rounded-pill">
                    {post.category}
                  </span>
                  <span className="mx-3 text-light">•</span>
                  <span className="text-light">{post.readTime} min read</span>
                </div>
                <h1 className="display-3 font-weight-bold mb-3" style={{ lineHeight: '1.2' }}>
                  {post.title}
                </h1>
                <p className="lead text-light" style={{ maxWidth: '800px' }}>
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-5" style={{ maxWidth: '900px' }}>
          {/* Author & Date */}
          <div className="d-flex align-items-center mb-4 pb-4 border-bottom">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              width={64}
              height={64}
              className="rounded-circle mr-3"
              style={{ width: '64px', height: '64px', objectFit: 'cover' }}
            />
            <div>
              <h3 className="h5 mb-1 text-dark font-weight-bold">{post.author.name}</h3>
              <p className="text-muted mb-1 small">{post.author.bio}</p>
              <div className="d-flex align-items-center text-muted small">
                <span>Published {publishDate}</span>
                <span className="mx-2">•</span>
                <span>{post.views} views</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="blog-content" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            <style>{`
              .blog-content h2 { margin-top: 2rem; margin-bottom: 1rem; font-weight: bold; }
              .blog-content h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: bold; }
              .blog-content p { margin-bottom: 1.5rem; text-align: justify; }
              .blog-content ul { margin-bottom: 1.5rem; padding-left: 2rem; }
              .blog-content li { margin-bottom: 0.5rem; }
            `}</style>
            <div dangerouslySetInnerHTML={{ 
              __html: post.content
                .replace(/\n\n/g, '</p><p class="mb-4">')
                .replace(/^/, '<p class="mb-4">')
                .replace(/$/, '</p>')
                .replace(/## (.*?)\n/g, '<h2 class="h3 mt-4 mb-3 font-weight-bold">$1</h2>')
                .replace(/### (.*?)\n/g, '<h3 class="h4 mt-3 mb-2 font-weight-bold">$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/- (.*?)\n/g, '<li class="mb-1">$1</li>')
                .replace(/(<li[^>]*>.*<\/li>)/g, '<ul class="mb-3 pl-4">$1</ul>')
            }} />
          </div>

          {/* Tags */}
          <div className="mt-5 pt-4 border-top">
            <h4 className="h5 font-weight-bold text-dark mb-3">Tags</h4>
            <div className="d-flex flex-wrap">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="badge badge-secondary mr-2 mb-2 px-3 py-2"
                  style={{ fontSize: '0.9rem' }}
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