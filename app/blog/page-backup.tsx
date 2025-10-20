import React from 'react';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Digital Marketing Blog | NSM Prime',
  description: 'Expert insights and strategies for digital marketing success',
};

// Load posts data
async function loadBlogData() {
  try {
    const postsPath = path.join(process.cwd(), 'public/data/posts.json');
    const postsData = await fs.promises.readFile(postsPath, 'utf-8');
    const postsJson = JSON.parse(postsData);
    const posts = Array.isArray(postsJson) ? postsJson : postsJson.posts || [];
    return posts;
  } catch (error) {
    console.error('Error loading blog data:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await loadBlogData();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Digital Marketing Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights, actionable strategies, and industry trends to help your business thrive in the digital landscape.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading blog posts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop&crop=faces'}
                  alt={post.featuredImage?.alt || post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {post.category || 'Digital Marketing'}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{post.readTime || 5} min read</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center">
                    <img
                      src={post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                      alt={post.author?.name || 'Author'}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">{post.author?.name || 'NSM Prime Team'}</p>
                      <p className="text-gray-500">
                        {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}