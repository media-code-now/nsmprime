#!/usr/bin/env node

/**
 * Sitemap Generator for NSM Prime
 * Generates sitemap.xml with all blog posts and static pages
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: 'https://nsmprime.com',
  dataPath: path.join(__dirname, 'data/posts.json'),
  sitemapPath: path.join(__dirname, 'sitemap.xml'),
  staticPages: [
    { url: '/', changefreq: 'weekly', priority: '1.0' },
    { url: '/about.html', changefreq: 'monthly', priority: '0.8' },
    { url: '/services.html', changefreq: 'monthly', priority: '0.9' },
    { url: '/web-development.html', changefreq: 'monthly', priority: '0.8' },
    { url: '/digital-marketing.html', changefreq: 'monthly', priority: '0.8' },
    { url: '/photography.html', changefreq: 'monthly', priority: '0.7' },
    { url: '/video-production.html', changefreq: 'monthly', priority: '0.7' },
    { url: '/sponsered-ads.html', changefreq: 'monthly', priority: '0.8' },
    { url: '/graphic-design.html', changefreq: 'monthly', priority: '0.7' },
    { url: '/seo-hub.html', changefreq: 'weekly', priority: '0.9' },
    { url: '/blog-hub.html', changefreq: 'daily', priority: '0.9' },
    { url: '/grid-blog.html', changefreq: 'daily', priority: '0.8' },
    { url: '/contacts.html', changefreq: 'monthly', priority: '0.7' },
    { url: '/privacy-policy.html', changefreq: 'yearly', priority: '0.3' }
  ]
};

/**
 * Load blog posts from data file
 */
function loadBlogPosts() {
  try {
    if (!fs.existsSync(CONFIG.dataPath)) {
      console.log('No blog posts data file found');
      return [];
    }
    
    const data = fs.readFileSync(CONFIG.dataPath, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.posts || [];
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

/**
 * Format date for sitemap
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

/**
 * Generate sitemap XML
 */
function generateSitemap() {
  console.log('🗺️  Generating sitemap...');
  
  const posts = loadBlogPosts();
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  CONFIG.staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${CONFIG.baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add blog posts
  posts.forEach(post => {
    const postDate = formatDate(post.modifiedDate || post.publishDate);
    sitemap += `  <url>
    <loc>${CONFIG.baseUrl}/blog/?slug=${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;

  // Write sitemap file
  try {
    fs.writeFileSync(CONFIG.sitemapPath, sitemap);
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`📊 Static pages: ${CONFIG.staticPages.length}`);
    console.log(`📝 Blog posts: ${posts.length}`);
    console.log(`📍 Total URLs: ${CONFIG.staticPages.length + posts.length}`);
    console.log(`💾 Saved to: ${CONFIG.sitemapPath}`);
  } catch (error) {
    console.error('❌ Error writing sitemap:', error);
    throw error;
  }
}

/**
 * Generate robots.txt file
 */
function generateRobotsTxt() {
  console.log('🤖 Generating robots.txt...');
  
  const robotsContent = `# NSM Prime Media Group - Robots.txt
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Crawl delay for politeness
Crawl-delay: 1

# Disallow admin/private areas
Disallow: /bat/
Disallow: /build/
Disallow: /out/
Disallow: /*.json$
Disallow: /*.config.js$

# Allow specific important files
Allow: /data/posts.json

# Popular crawlers - no restrictions
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /
`;

  const robotsPath = path.join(__dirname, 'robots.txt');
  
  try {
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('✅ robots.txt generated successfully!');
    console.log(`💾 Saved to: ${robotsPath}`);
  } catch (error) {
    console.error('❌ Error writing robots.txt:', error);
    throw error;
  }
}

/**
 * Command line interface
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'generate':
    case 'sitemap':
      generateSitemap();
      break;
      
    case 'robots':
      generateRobotsTxt();
      break;
      
    case 'all':
      generateSitemap();
      generateRobotsTxt();
      break;
      
    case 'help':
    default:
      console.log(`
🗺️  NSM Prime Sitemap Generator

Usage:
  node sitemap-generator.js generate   - Generate sitemap.xml
  node sitemap-generator.js robots     - Generate robots.txt
  node sitemap-generator.js all        - Generate both files
  node sitemap-generator.js help       - Show this help

Examples:
  node sitemap-generator.js generate   - Create sitemap with all pages and blog posts
  node sitemap-generator.js all        - Create both sitemap.xml and robots.txt
      `);
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSitemap,
  generateRobotsTxt,
  CONFIG
};