'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDebounce } from '../../hooks/useDebounce';

// Types (reused from main component)
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

interface FAQItem {
  question: string;
  answer: string;
}

// Components
const BlogCard = ({ post, priority = false }: { post: BlogPost; priority?: boolean }) => (
  <article className="blog-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="relative overflow-hidden rounded-t-lg">
      <Link href={`/blog/${post.slug}`} aria-label={`Read article: ${post.title}`}>
        <Image
          src={post.featuredImage.url}
          alt={post.featuredImage.alt}
          width={post.featuredImage.width}
          height={post.featuredImage.height}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />
      </Link>
      {post.isFeatured && (
        <span 
          className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium"
          aria-label="Featured article"
        >
          Featured
        </span>
      )}
    </div>
    
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-blue-600 font-medium">{post.category}</span>
        <span className="text-gray-300">•</span>
        <time 
          dateTime={post.publishDate}
          className="text-sm text-gray-500"
        >
          {new Date(post.publishDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        <span className="text-gray-300">•</span>
        <span className="text-sm text-gray-500">{post.readTime} min read</span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
        <Link href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={post.author.avatar}
            alt={`${post.author.name} avatar`}
            width={32}
            height={32}
            className="rounded-full"
            loading="lazy"
          />
          <span className="text-sm text-gray-700 font-medium">{post.author.name}</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </article>
);

const TrendingCard = ({ post, rank }: { post: TrendingPost; rank: number }) => (
  <article className="trending-card flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div 
      className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm"
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </div>
    
    <div className="flex-grow">
      <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
        <Link href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
      </h4>
      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
        <span>{post.views.toLocaleString()} views</span>
        <span>•</span>
        <time dateTime={post.publishDate}>
          {new Date(post.publishDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </time>
      </div>
    </div>
  </article>
);

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search articles..."
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="relative max-w-md">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg 
        className="h-5 w-5 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
    </div>
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      aria-label="Search articles"
    />
  </div>
);

const TagFilter = ({ 
  tags, 
  selectedTags, 
  onTagToggle 
}: {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}) => (
  <div className="tag-filter">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Topic</h3>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagToggle(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTags.includes(tag)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-pressed={selectedTags.includes(tag)}
          aria-label={`Filter by ${tag}`}
        >
          {tag}
        </button>
      ))}
    </div>
  </div>
);

const FAQSection = ({ faqs }: { faqs: FAQItem[] }) => (
  <section className="faq-section bg-gray-50 rounded-lg p-8" aria-labelledby="faq-heading">
    <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-6">
      Frequently Asked Questions
    </h2>
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <details key={index} className="bg-white rounded-lg shadow-sm">
          <summary className="p-4 cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
            {faq.question}
          </summary>
          <div className="px-4 pb-4 text-gray-600">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  </section>
);

// Client Blog Component
interface BlogClientProps {
  posts: BlogPost[];
  trendingPosts: TrendingPost[];
}

export default function BlogClient({ posts, trendingPosts }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // FAQ data
  const faqs: FAQItem[] = [
    {
      question: "How often do you publish new digital marketing content?",
      answer: "We publish new digital marketing insights and industry updates every Tuesday and Friday. Our content covers SEO strategies, web development trends, social media marketing, and PPC optimization techniques."
    },
    {
      question: "Can I request specific topics for future blog posts?",
      answer: "Absolutely! We welcome topic suggestions from our readers. Contact us through our form or social media with your digital marketing questions, and we'll consider them for future articles."
    },
    {
      question: "Do you offer digital marketing consultations beyond the blog content?",
      answer: "Yes, we provide comprehensive digital marketing services including SEO audits, website development, PPC management, and social media strategy. Contact us to discuss how we can help grow your business."
    },
    {
      question: "Are your digital marketing strategies suitable for small businesses?",
      answer: "Our content caters to businesses of all sizes, with particular focus on actionable strategies for small and medium businesses. We provide scalable solutions that grow with your business."
    },
    {
      question: "How can I stay updated with your latest digital marketing insights?",
      answer: "Subscribe to our newsletter for weekly digital marketing tips, follow us on social media, or bookmark our blog. We also offer RSS feeds for easy content syndication."
    }
  ];

  // Get unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = debouncedSearchTerm === '' || 
        post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => post.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [posts, debouncedSearchTerm, selectedTags]);

  // Categorize posts
  const featuredPosts = useMemo(() =>
    filteredPosts.filter(post => post.isFeatured).slice(0, 3),
    [filteredPosts]
  );

  const latestPosts = useMemo(() =>
    filteredPosts
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 6),
    [filteredPosts]
  );

  // Handle tag filtering
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Digital Marketing Insights & Strategies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights, actionable strategies, and industry trends to help your business thrive in the digital landscape.
          </p>
        </header>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search articles, topics, or keywords..."
              />
            </div>
            <div className="flex-grow">
              <TagFilter
                tags={allTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            </div>
          </div>
          
          {selectedTags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Active filters:</span>
                {selectedTags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {tag}
                  </span>
                ))}
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            {(searchTerm || selectedTags.length > 0) && (
              <>
                {' '}matching your criteria
              </>
            )}
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12" aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="text-3xl font-bold text-gray-900 mb-8">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} priority={index < 2} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Posts */}
        {latestPosts.length > 0 && (
          <section className="mb-12" aria-labelledby="latest-heading">
            <h2 id="latest-heading" className="text-3xl font-bold text-gray-900 mb-8">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Trending Posts Sidebar */}
        {trendingPosts.length > 0 && (
          <aside className="mb-12" aria-labelledby="trending-heading">
            <h2 id="trending-heading" className="text-3xl font-bold text-gray-900 mb-8">
              Trending This Week
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {trendingPosts.slice(0, 5).map((post, index) => (
                  <TrendingCard key={post.id} post={post} rank={index + 1} />
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* FAQ Section */}
        <FAQSection faqs={faqs} />

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              No articles found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or removing some filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTags([]);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}