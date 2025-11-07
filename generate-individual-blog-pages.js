#!/usr/bin/env node

/**
 * Generate Individual Blog Post HTML Files
 * 
 * Creates individual HTML files for each blog post to enable direct URLs
 * like /blog/post-slug.html instead of /blog/?slug=post-slug
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    dataPath: './data/posts.json',
    templatePath: './blog/index.html',
    outputDir: './blog/',
    baseUrl: 'https://nsmprime.com'
};

/**
 * Load blog posts data
 */
function loadPosts() {
    try {
        const data = JSON.parse(fs.readFileSync(CONFIG.dataPath, 'utf8'));
        return data.posts || [];
    } catch (error) {
        console.error('Error loading posts:', error);
        return [];
    }
}

/**
 * Load the blog template
 */
function loadTemplate() {
    try {
        return fs.readFileSync(CONFIG.templatePath, 'utf8');
    } catch (error) {
        console.error('Error loading template:', error);
        return '';
    }
}

/**
 * Generate HTML content for a specific post
 */
function generatePostHTML(post, template) {
    let html = template;
    
    // Replace dynamic meta tags
    html = html.replace('id="page-title">Blog Post | NSM Prime</title>', 
        `id="page-title">${post.metaTitle || post.title} | NSM Prime</title>`);
    
    html = html.replace('id="page-description" content="Digital marketing insights and strategies from NSM Prime experts."', 
        `id="page-description" content="${post.metaDescription || post.excerpt}"`);
    
    html = html.replace('id="page-keywords" content="digital marketing, SEO, PPC, social media, Las Vegas"', 
        `id="page-keywords" content="${post.tags ? post.tags.join(', ') : 'digital marketing, Las Vegas'}"`);
    
    // Set canonical URL
    html = html.replace('id="page-canonical" href=""', 
        `id="page-canonical" href="${CONFIG.baseUrl}/blog/${post.slug}.html"`);
    
    // Open Graph tags
    html = html.replace('id="og-title" content=""', 
        `id="og-title" content="${post.title}"`);
    
    html = html.replace('id="og-description" content=""', 
        `id="og-description" content="${post.excerpt}"`);
    
    html = html.replace('id="og-image" content=""', 
        `id="og-image" content="${post.featuredImage ? post.featuredImage.url : CONFIG.baseUrl + '/images/og-default.jpg'}"`);
    
    html = html.replace('id="og-url" content=""', 
        `id="og-url" content="${CONFIG.baseUrl}/blog/${post.slug}.html"`);
    
    // Twitter Card tags
    html = html.replace('id="twitter-title" content=""', 
        `id="twitter-title" content="${post.title}"`);
    
    html = html.replace('id="twitter-description" content=""', 
        `id="twitter-description" content="${post.excerpt}"`);
    
    html = html.replace('id="twitter-image" content=""', 
        `id="twitter-image" content="${post.featuredImage ? post.featuredImage.url : CONFIG.baseUrl + '/images/twitter-card.jpg'}"`);
    
    // Add post-specific data as JSON-LD structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.featuredImage ? post.featuredImage.url : CONFIG.baseUrl + "/images/og-default.jpg",
        "author": {
            "@type": "Person",
            "name": post.author.name,
            "url": CONFIG.baseUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": "NSM Prime Media Group",
            "logo": {
                "@type": "ImageObject",
                "url": CONFIG.baseUrl + "/images/logo-default-216x80.png"
            }
        },
        "datePublished": post.publishDate,
        "dateModified": post.modifiedDate,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${CONFIG.baseUrl}/blog/${post.slug}.html`
        }
    };
    
    // Insert structured data before closing head tag
    html = html.replace('</head>', 
        `    <script type="application/ld+json">\n    ${JSON.stringify(structuredData, null, 4)}\n    </script>\n  </head>`);
    
    return html;
}

/**
 * Generate individual blog post files
 */
function generateBlogPages() {
    console.log('🚀 Generating individual blog post HTML files...');
    
    const posts = loadPosts();
    const template = loadTemplate();
    
    if (!template) {
        console.error('❌ Could not load blog template');
        return;
    }
    
    if (posts.length === 0) {
        console.error('❌ No blog posts found');
        return;
    }
    
    let generatedCount = 0;
    
    posts.forEach(post => {
        try {
            const html = generatePostHTML(post, template);
            const filename = `${post.slug}.html`;
            const filepath = path.join(CONFIG.outputDir, filename);
            
            fs.writeFileSync(filepath, html, 'utf8');
            console.log(`✅ Generated: ${filename}`);
            generatedCount++;
            
        } catch (error) {
            console.error(`❌ Error generating ${post.slug}.html:`, error.message);
        }
    });
    
    console.log(`\n🎉 Successfully generated ${generatedCount} individual blog post files!`);
    console.log(`📁 Files saved to: ${CONFIG.outputDir}`);
    console.log(`\n📋 Generated files:`);
    
    posts.forEach(post => {
        console.log(`   - ${post.slug}.html -> "${post.title}"`);
    });
    
    return generatedCount;
}

/**
 * Update blog loader to use direct URLs
 */
function updateBlogLoader() {
    console.log('\n🔄 Updating blog loader to use direct URLs...');
    
    const loaderPath = './js/blog-loader.js';
    
    try {
        let content = fs.readFileSync(loaderPath, 'utf8');
        
        // Replace the query parameter URLs with direct URLs
        content = content.replace(/blog\/\?slug=\$\{post\.slug\}/g, `blog/\${post.slug}.html`);
        
        fs.writeFileSync(loaderPath, content, 'utf8');
        console.log('✅ Blog loader updated successfully!');
        
    } catch (error) {
        console.error('❌ Error updating blog loader:', error.message);
    }
}

/**
 * Main execution function
 */
function main() {
    console.log('🌟 NSM Prime Blog Page Generator\n');
    
    const generatedCount = generateBlogPages();
    
    if (generatedCount > 0) {
        updateBlogLoader();
        
        console.log('\n✨ All done! Blog posts now have direct URLs:');
        console.log('   Example: https://nsmprime.com/blog/google-ads-optimization-maximizing-roi-for-las-vegas-businesses.html');
        console.log('\n🔗 Users can now access blog posts directly without query parameters!');
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    generateBlogPages,
    updateBlogLoader,
    CONFIG
};