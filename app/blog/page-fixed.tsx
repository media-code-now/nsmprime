import React from 'react';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Digital Marketing Blog | NSM Prime',
  description: 'Expert insights, actionable strategies, and industry trends to help your business thrive in the digital landscape.',
  openGraph: {
    title: 'Digital Marketing Insights & Strategies | NSM Prime Blog',
    description: 'Expert insights, actionable strategies, and industry trends to help your business thrive in the digital landscape.',
    type: 'website',
    url: 'https://nsmprime.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Insights & Strategies | NSM Prime Blog',
    description: 'Expert insights, actionable strategies, and industry trends to help your business thrive in the digital landscape.',
  },
};

// Blog Post interface
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
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

// Load posts data
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

export default async function BlogPage() {
  const posts = await loadBlogData();

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
              "image": post.featuredImage.url,
              "url": `https://nsmprime.com/blog/${post.slug}`
            }))
          })
        }}
      />

      {/* Blog Content using Bootstrap classes */}
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div className="container py-5">
            <div className="text-center">
              <h1 className="display-4 mb-3" style={{ fontWeight: 'bold', color: '#212529' }}>
                Digital Marketing Insights & Strategies
              </h1>
              <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                Expert insights, actionable strategies, and industry trends to help your business thrive in the digital landscape.
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="container py-5">
          {posts.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted h5">Loading blog posts...</p>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              {posts.filter(post => post.isFeatured).length > 0 && (
                <div className="mb-5">
                  <h2 className="h3 mb-4" style={{ fontWeight: 'bold', color: '#212529' }}>
                    Featured Articles
                  </h2>
                  <div className="row">
                    {posts.filter(post => post.isFeatured).slice(0, 3).map(post => (
                      <div key={post.id} className="col-lg-4 col-md-6 mb-4">
                        <div className="card h-100 shadow-sm">
                          <img
                            src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop'}
                            alt={post.featuredImage?.alt || post.title}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          <div className="card-body d-flex flex-column">
                            <div className="mb-2">
                              <span className="badge badge-primary mr-2">{post.category}</span>
                              <small className="text-muted">{post.readTime} min read</small>
                            </div>
                            <h5 className="card-title">
                              <a href={`/blog/${post.slug}`} className="text-decoration-none text-dark">
                                {post.title}
                              </a>
                            </h5>
                            <p className="card-text text-muted flex-grow-1">{post.excerpt}</p>
                            <div className="d-flex align-items-center mt-auto">
                              <img
                                src={post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                                alt={post.author?.name || 'Author'}
                                className="rounded-circle mr-2"
                                style={{ width: '32px', height: '32px' }}
                              />
                              <div>
                                <small className="text-dark font-weight-medium">
                                  {post.author?.name || 'NSM Prime Team'}
                                </small>
                                <br />
                                <small className="text-muted">
                                  {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Recently'}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Posts */}
              <div className="mb-5">
                <h2 className="h3 mb-4" style={{ fontWeight: 'bold', color: '#212529' }}>
                  Latest Articles ({posts.length})
                </h2>
                <div className="row">
                  {posts.map(post => (
                    <div key={post.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-sm">
                        <img
                          src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop'}
                          alt={post.featuredImage?.alt || post.title}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body d-flex flex-column">
                          <div className="mb-2">
                            <span className="badge badge-secondary mr-2">{post.category}</span>
                            <small className="text-muted">{post.readTime} min read</small>
                          </div>
                          <h5 className="card-title">
                            <a href={`/blog/${post.slug}`} className="text-decoration-none text-dark">
                              {post.title}
                            </a>
                          </h5>
                          <p className="card-text text-muted flex-grow-1">{post.excerpt}</p>
                          
                          {/* Tags */}
                          <div className="mb-2">
                            {post.tags?.slice(0, 3).map(tag => (
                              <span key={tag} className="badge badge-light mr-1 mb-1">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="d-flex align-items-center mt-auto">
                            <img
                              src={post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                              alt={post.author?.name || 'Author'}
                              className="rounded-circle mr-2"
                              style={{ width: '32px', height: '32px' }}
                            />
                            <div>
                              <small className="text-dark font-weight-medium">
                                {post.author?.name || 'NSM Prime Team'}
                              </small>
                              <br />
                              <small className="text-muted">
                                {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Recently'}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}