'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDebounce } from '../../hooks/useDebounce';

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

interface FAQItem {
  question: string;
  answer: string;
}

// Schema components
const BreadcrumbSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://nsmprime.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://nsmprime.com/blog"
          }
        ]
      })
    }}
  />
);

const FAQSchema = ({ faqs }: { faqs: FAQItem[] }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      })
    }}
  />
);

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

// Main Blog Page Component
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [postsResponse, trendingResponse] = await Promise.all([
          fetch('/data/posts.json'),
          fetch('/data/trending.json')
        ]);

        if (!postsResponse.ok || !trendingResponse.ok) {
          throw new Error('Failed to load blog data');
        }

        const postsData = await postsResponse.json();
        const trendingData = await trendingResponse.json();

        setPosts(postsData.posts || []);
        setTrendingPosts(trendingData.trending || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  // Get section data
  const featuredPosts = useMemo(() => 
    filteredPosts.filter(post => post.isFeatured).slice(0, 3), 
    [filteredPosts]
  );

  const latestPosts = useMemo(() => 
    filteredPosts
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 8), 
    [filteredPosts]
  );

  const topicCategories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    filteredPosts.forEach(post => {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
    });
    return Array.from(categoryMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);
  }, [filteredPosts]);

  // Event handlers
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blog</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbSchema />
      <FAQSchema faqs={faqs} />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Digital Marketing Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert insights, proven strategies, and the latest trends in SEO, web development, 
              social media marketing, and digital growth tactics from Las Vegas industry leaders.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <section className="mb-12" aria-label="Search and filter options">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search articles..."
            />
            
            <div className="flex items-center gap-4">
              {(selectedTags.length > 0 || debouncedSearchTerm) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Filters
                </button>
              )}
              <span className="text-sm text-gray-500">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="mt-6">
              <TagFilter
                tags={allTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            </div>
          )}
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16" aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="text-3xl font-bold text-gray-900 mb-8">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} priority={index === 0} />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Latest Posts */}
            <section aria-labelledby="latest-heading">
              <h2 id="latest-heading" className="text-3xl font-bold text-gray-900 mb-8">
                Latest Articles
              </h2>
              {latestPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {latestPosts.map(post => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear filters to see all articles
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Trending Posts */}
            {trendingPosts.length > 0 && (
              <section aria-labelledby="trending-heading">
                <h2 id="trending-heading" className="text-2xl font-bold text-gray-900 mb-6">
                  Trending This Week
                </h2>
                <div className="space-y-4">
                  {trendingPosts.slice(0, 5).map((post, index) => (
                    <TrendingCard key={post.id} post={post} rank={index + 1} />
                  ))}
                </div>
              </section>
            )}

            {/* Topics Grid */}
            {topicCategories.length > 0 && (
              <section aria-labelledby="topics-heading">
                <h2 id="topics-heading" className="text-2xl font-bold text-gray-900 mb-6">
                  Popular Topics
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {topicCategories.map(([category, count]) => (
                    <Link
                      key={category}
                      href={`/blog/category/${category.toLowerCase()}`}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                    >
                      <h3 className="font-medium text-gray-900">{category}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {count} article{count !== 1 ? 's' : ''}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Newsletter Signup */}
            <section className="bg-blue-50 rounded-lg p-6" aria-labelledby="newsletter-heading">
              <h2 id="newsletter-heading" className="text-xl font-bold text-gray-900 mb-4">
                Stay Updated
              </h2>
              <p className="text-gray-600 mb-4">
                Get weekly digital marketing insights and exclusive tips delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Subscribe
                </button>
              </form>
            </section>
          </aside>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <FAQSection faqs={faqs} />
        </div>
      </main>
    </div>
  );
}