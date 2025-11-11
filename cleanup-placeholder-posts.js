#!/usr/bin/env node

/**
 * Clean up blog posts with placeholder content
 * Removes posts that only have "Full article content here..." as content
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    dataPath: './data/posts.json',
    backupPath: './data/posts-backup.json'
};

/**
 * Load blog posts data
 */
function loadPosts() {
    try {
        const data = JSON.parse(fs.readFileSync(CONFIG.dataPath, 'utf8'));
        return data;
    } catch (error) {
        console.error('Error loading posts:', error);
        return { posts: [] };
    }
}

/**
 * Save posts data
 */
function savePosts(data) {
    try {
        fs.writeFileSync(CONFIG.dataPath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error saving posts:', error);
        return false;
    }
}

/**
 * Create backup of current posts
 */
function createBackup(data) {
    try {
        fs.writeFileSync(CONFIG.backupPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅ Backup created: ${CONFIG.backupPath}`);
        return true;
    } catch (error) {
        console.error('Error creating backup:', error);
        return false;
    }
}

/**
 * Check if a post has only placeholder content
 */
function hasPlaceholderContent(post) {
    const content = post.content || '';
    return content.trim() === 'Full article content here...';
}

/**
 * Clean up posts with placeholder content
 */
function cleanupPosts() {
    console.log('🧹 NSM Prime Blog Content Cleanup\n');
    
    const data = loadPosts();
    const originalCount = data.posts.length;
    
    if (originalCount === 0) {
        console.log('❌ No posts found to process');
        return;
    }
    
    console.log(`📊 Found ${originalCount} total blog posts`);
    
    // Create backup
    if (!createBackup(data)) {
        console.log('❌ Failed to create backup. Aborting cleanup.');
        return;
    }
    
    // Find posts with placeholder content
    const placeholderPosts = data.posts.filter(hasPlaceholderContent);
    const validPosts = data.posts.filter(post => !hasPlaceholderContent(post));
    
    console.log(`\n🔍 Analysis Results:`);
    console.log(`   📝 Posts with real content: ${validPosts.length}`);
    console.log(`   🗑️  Posts with placeholder content: ${placeholderPosts.length}`);
    
    if (placeholderPosts.length === 0) {
        console.log('\n✨ Great! No posts with placeholder content found.');
        return;
    }
    
    console.log(`\n🗑️  Posts to be removed:`);
    placeholderPosts.forEach((post, index) => {
        console.log(`   ${index + 1}. "${post.title}" (ID: ${post.id})`);
    });
    
    // Update data with only valid posts
    data.posts = validPosts;
    
    // Save cleaned data
    if (savePosts(data)) {
        console.log(`\n✅ Cleanup completed successfully!`);
        console.log(`📊 Posts removed: ${placeholderPosts.length}`);
        console.log(`📊 Posts remaining: ${validPosts.length}`);
        console.log(`💾 Data saved to: ${CONFIG.dataPath}`);
        console.log(`🔄 Backup available at: ${CONFIG.backupPath}`);
        
        return placeholderPosts.length;
    } else {
        console.log('\n❌ Failed to save cleaned data');
        return 0;
    }
}

/**
 * Clean up corresponding HTML files for removed posts
 */
function cleanupHtmlFiles(removedPosts) {
    if (!removedPosts || removedPosts.length === 0) {
        return;
    }
    
    console.log(`\n🧹 Cleaning up corresponding HTML files...`);
    
    removedPosts.forEach(post => {
        const htmlFile = `./blog/${post.slug}.html`;
        
        try {
            if (fs.existsSync(htmlFile)) {
                fs.unlinkSync(htmlFile);
                console.log(`   ✅ Removed: ${htmlFile}`);
            }
        } catch (error) {
            console.log(`   ❌ Failed to remove: ${htmlFile} - ${error.message}`);
        }
    });
}

/**
 * Update sitemap after cleanup
 */
function updateSitemap() {
    console.log(`\n🗺️  Updating sitemap...`);
    
    try {
        const { generateSitemap } = require('./sitemap-generator');
        generateSitemap();
        console.log(`✅ Sitemap updated successfully`);
    } catch (error) {
        console.log(`❌ Failed to update sitemap: ${error.message}`);
    }
}

/**
 * Main execution function
 */
function main() {
    const data = loadPosts();
    const placeholderPosts = data.posts.filter(hasPlaceholderContent);
    
    const removedCount = cleanupPosts();
    
    if (removedCount > 0) {
        cleanupHtmlFiles(placeholderPosts);
        updateSitemap();
        
        console.log(`\n🎉 Blog cleanup completed!`);
        console.log(`   Removed ${removedCount} posts with placeholder content`);
        console.log(`   Your blog now contains only posts with real content`);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    cleanupPosts,
    hasPlaceholderContent,
    CONFIG
};