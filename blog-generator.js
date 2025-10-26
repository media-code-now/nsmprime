#!/usr/bin/env node

/**
 * Automated Blog Generation System for NSM Prime
 * 
 * This script automatically generates new blog posts about digital marketing topics,
 * adds them to the blog data, and can be scheduled to run automatically.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  dataPath: path.join(__dirname, 'public/data/posts.json'),
  maxPosts: 20, // Keep only the latest 20 posts
  categories: [
    'SEO',
    'Social Media Marketing',
    'Web Development',
    'PPC Advertising',
    'Content Marketing',
    'Digital Analytics',
    'Email Marketing',
    'Local SEO'
  ],
  authors: [
    {
      name: "Sarah Martinez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
      bio: "SEO Specialist with 8+ years experience in local search optimization"
    },
    {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Digital Marketing Strategist specializing in data-driven campaigns"
    },
    {
      name: "Jessica Rodriguez",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      bio: "Social Media Expert helping businesses grow their online presence"
    },
    {
      name: "David Thompson",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      bio: "Web Development and UX specialist with focus on conversion optimization"
    }
  ]
};

// Blog post templates with current digital marketing topics
const BLOG_TEMPLATES = {
  'SEO': [
    {
      titleTemplate: "Advanced SEO Strategies for {year}: What Las Vegas Businesses Need to Know",
      topics: ["Core Web Vitals", "E-A-T optimization", "AI-powered SEO", "Voice search optimization", "Local SEO updates"],
      excerpt: "Stay ahead of the competition with the latest SEO strategies that are driving results for Las Vegas businesses in {year}."
    },
    {
      titleTemplate: "Local SEO Mastery: Dominating {location} Search Results in {year}",
      topics: ["Google Business Profile optimization", "Local citations", "Review management", "Local link building"],
      excerpt: "Complete guide to local SEO strategies that help {location} businesses rank higher in local search results."
    }
  ],
  'Social Media Marketing': [
    {
      titleTemplate: "Social Media ROI: Measuring Success for {location} Businesses",
      topics: ["Analytics setup", "Conversion tracking", "ROI calculation", "Attribution modeling"],
      excerpt: "Learn how to properly measure and optimize your social media ROI with proven strategies and tools."
    },
    {
      titleTemplate: "{year} Social Media Trends: What Works for Local Businesses",
      topics: ["Video content", "Stories and Reels", "Community building", "Influencer partnerships"],
      excerpt: "Discover the social media trends that are driving engagement and conversions for local businesses in {year}."
    }
  ],
  'Web Development': [
    {
      titleTemplate: "Website Performance Optimization: Speed Up Your {location} Business Site",
      topics: ["Core Web Vitals", "Image optimization", "Caching strategies", "CDN implementation"],
      excerpt: "Comprehensive guide to optimizing website performance for better user experience and search rankings."
    },
    {
      titleTemplate: "Mobile-First Design: Why Your {location} Business Website Needs It",
      topics: ["Responsive design", "Mobile UX", "Touch optimization", "Mobile conversion rates"],
      excerpt: "Learn why mobile-first design is crucial for business success and how to implement it effectively."
    }
  ],
  'PPC Advertising': [
    {
      titleTemplate: "Google Ads Optimization: Maximizing ROI for {location} Businesses",
      topics: ["Keyword research", "Ad copy optimization", "Bid strategies", "Landing page optimization"],
      excerpt: "Advanced Google Ads strategies to increase conversions and reduce costs for local businesses."
    },
    {
      titleTemplate: "PPC vs SEO: Finding the Right Balance for {location} Marketing",
      topics: ["Budget allocation", "Timeline expectations", "Synergy strategies", "Performance metrics"],
      excerpt: "Strategic guide to balancing paid and organic search for maximum digital marketing impact."
    }
  ],
  'Content Marketing': [
    {
      titleTemplate: "Content Marketing Strategy: Building Authority for {location} Businesses",
      topics: ["Content planning", "Topic research", "Distribution channels", "Performance measurement"],
      excerpt: "Complete content marketing framework to establish thought leadership and drive business growth."
    }
  ],
  'Digital Analytics': [
    {
      titleTemplate: "GA4 Mastery: Essential Analytics for {location} Business Owners",
      topics: ["GA4 setup", "Conversion tracking", "Custom reports", "Data interpretation"],
      excerpt: "Master Google Analytics 4 to make data-driven decisions that grow your business."
    }
  ]
};

// Unsplash image collections for different topics
const IMAGE_COLLECTIONS = {
  'SEO': [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&q=80",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=450&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop&q=80"
  ],
  'Social Media Marketing': [
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=450&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=450&fit=crop&q=80"
  ],
  'Web Development': [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=450&fit=crop&q=80"
  ],
  'PPC Advertising': [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=450&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=450&fit=crop&q=80"
  ],
  'Content Marketing': [
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=450&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop&q=80"
  ],
  'Digital Analytics': [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&q=80"
  ]
};

/**
 * Generate a unique ID for a blog post
 */
function generateId() {
  return Math.floor(Date.now() / 1000).toString();
}

/**
 * Generate a slug from a title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Generate comprehensive blog content based on template and topics
 */
function generateBlogContent(title, topics, category) {
  const introduction = `In today's rapidly evolving digital landscape, ${category.toLowerCase()} has become more crucial than ever for business success. This comprehensive guide will walk you through the latest strategies and best practices that are delivering real results for businesses.`;

  const sections = topics.map((topic, index) => {
    return `

## ${index + 1}. ${topic}

${topic} is a critical component of any successful ${category.toLowerCase()} strategy. Here's what you need to know:

- **Best Practices**: Implement proven techniques that industry leaders are using to achieve superior results
- **Common Mistakes**: Avoid the pitfalls that can derail your efforts and waste your budget
- **Tools & Resources**: Leverage the right tools to streamline your workflow and maximize efficiency
- **Measurement**: Track the right metrics to ensure you're meeting your business objectives

### Implementation Strategy

To effectively implement ${topic} in your business:

1. **Assessment**: Start by evaluating your current situation and identifying areas for improvement
2. **Planning**: Develop a strategic approach that aligns with your business goals
3. **Execution**: Implement changes systematically to ensure optimal results
4. **Optimization**: Continuously monitor and refine your approach based on performance data

### Expected Results

When properly implemented, ${topic} can lead to:
- Increased visibility and brand awareness
- Higher quality traffic and leads
- Improved conversion rates
- Better return on investment
- Sustainable long-term growth`;
  }).join('');

  const conclusion = `

## Conclusion

Mastering ${category.toLowerCase()} requires dedication, strategic thinking, and continuous learning. By implementing these strategies and staying current with industry trends, you'll be well-positioned to achieve your business objectives and outperform your competition.

Remember that success in ${category.toLowerCase()} doesn't happen overnight. It requires consistent effort, regular optimization, and a willingness to adapt to changing market conditions. Start with the fundamentals, measure your results, and gradually expand your efforts as you see positive outcomes.

For businesses looking to accelerate their ${category.toLowerCase()} success, consider working with experienced professionals who can help you navigate the complexities and avoid common pitfalls. The investment in expert guidance often pays for itself through improved results and avoided mistakes.`;

  return introduction + sections + conclusion;
}

/**
 * Generate relevant tags based on category and content
 */
function generateTags(category, topics) {
  const baseTags = {
    'SEO': ['SEO', 'Search Engine Optimization', 'Google Rankings', 'Organic Traffic'],
    'Social Media Marketing': ['Social Media', 'Digital Marketing', 'Content Strategy', 'Engagement'],
    'Web Development': ['Web Development', 'Website Design', 'UX/UI', 'Performance'],
    'PPC Advertising': ['PPC', 'Google Ads', 'Paid Advertising', 'ROI'],
    'Content Marketing': ['Content Marketing', 'Blogging', 'Content Strategy', 'Brand Authority'],
    'Digital Analytics': ['Analytics', 'Data Analysis', 'Google Analytics', 'Metrics'],
    'Email Marketing': ['Email Marketing', 'Newsletter', 'Automation', 'Lead Nurturing'],
    'Local SEO': ['Local SEO', 'Google My Business', 'Local Search', 'Las Vegas']
  };

  const categoryTags = baseTags[category] || ['Digital Marketing'];
  const topicTags = topics.slice(0, 2); // Add first 2 topics as tags
  const generalTags = ['Las Vegas Business', 'Marketing Strategy'];

  return [...categoryTags, ...topicTags, ...generalTags].slice(0, 8);
}

/**
 * Generate a new blog post
 */
function generateBlogPost() {
  const currentYear = new Date().getFullYear();
  const location = 'Las Vegas';
  
  // Select random category and template
  const categories = Object.keys(BLOG_TEMPLATES);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const templates = BLOG_TEMPLATES[category];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Generate title and content
  const title = template.titleTemplate
    .replace('{year}', currentYear.toString())
    .replace('{location}', location);
  
  const slug = generateSlug(title);
  const excerpt = template.excerpt
    .replace('{year}', currentYear.toString())
    .replace('{location}', location);
  
  const content = generateBlogContent(title, template.topics, category);
  const tags = generateTags(category, template.topics);
  
  // Select random author and image
  const author = CONFIG.authors[Math.floor(Math.random() * CONFIG.authors.length)];
  const images = IMAGE_COLLECTIONS[category] || IMAGE_COLLECTIONS['SEO'];
  const featuredImage = images[Math.floor(Math.random() * images.length)];
  
  // Generate dates
  const now = new Date();
  const publishDate = now.toISOString();
  
  return {
    id: generateId(),
    title,
    slug,
    excerpt,
    content,
    author,
    publishDate,
    modifiedDate: publishDate,
    readTime: Math.floor(content.length / 200) + Math.floor(Math.random() * 5) + 5, // Estimate reading time
    featuredImage: {
      url: featuredImage,
      alt: `${category} strategy illustration`,
      width: 800,
      height: 450
    },
    tags,
    category,
    isFeatured: Math.random() < 0.3, // 30% chance of being featured
    metaTitle: title,
    metaDescription: excerpt,
    views: Math.floor(Math.random() * 500) + 50,
    likes: Math.floor(Math.random() * 50) + 5,
    shares: Math.floor(Math.random() * 25) + 2
  };
}

/**
 * Load existing blog posts
 */
function loadExistingPosts() {
  try {
    if (!fs.existsSync(CONFIG.dataPath)) {
      return { posts: [] };
    }
    
    const data = fs.readFileSync(CONFIG.dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading existing posts:', error);
    return { posts: [] };
  }
}

/**
 * Save blog posts to file
 */
function savePosts(data) {
  try {
    // Ensure directory exists
    const dir = path.dirname(CONFIG.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(CONFIG.dataPath, JSON.stringify(data, null, 2));
    console.log('✅ Blog posts saved successfully');
  } catch (error) {
    console.error('❌ Error saving posts:', error);
    throw error;
  }
}

/**
 * Add new blog posts and maintain maximum count
 */
function addNewPosts(count = 1) {
  console.log(`🚀 Generating ${count} new blog post(s)...`);
  
  const data = loadExistingPosts();
  
  // Generate new posts
  for (let i = 0; i < count; i++) {
    const newPost = generateBlogPost();
    data.posts.unshift(newPost); // Add to beginning
    console.log(`📝 Generated: "${newPost.title}"`);
  }
  
  // Keep only the latest posts
  if (data.posts.length > CONFIG.maxPosts) {
    const removed = data.posts.splice(CONFIG.maxPosts);
    console.log(`🗑️  Removed ${removed.length} older post(s) to maintain limit of ${CONFIG.maxPosts}`);
  }
  
  // Sort by publish date (newest first)
  data.posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  
  savePosts(data);
  
  console.log(`✅ Successfully added ${count} new blog post(s)`);
  console.log(`📊 Total posts: ${data.posts.length}`);
  
  return data.posts;
}

/**
 * Command line interface
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'generate':
      const count = parseInt(args[1]) || 1;
      addNewPosts(count);
      break;
      
    case 'list':
      const data = loadExistingPosts();
      console.log(`📚 Current blog posts (${data.posts.length}):`);
      data.posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title} (${post.category})`);
      });
      break;
      
    case 'help':
    default:
      console.log(`
🤖 NSM Prime Blog Generator

Usage:
  node blog-generator.js generate [count]  - Generate new blog posts (default: 1)
  node blog-generator.js list              - List current blog posts
  node blog-generator.js help              - Show this help

Examples:
  node blog-generator.js generate          - Generate 1 new post
  node blog-generator.js generate 3        - Generate 3 new posts
  node blog-generator.js list              - Show all current posts
      `);
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateBlogPost,
  addNewPosts,
  loadExistingPosts,
  CONFIG
};