#!/usr/bin/env node

/**
 * Automated Blog Publishing System for NSM Prime
 * 
 * Runs continuously to automatically generate and publish new blog posts
 * Can be configured to run at specific intervals or times
 */

const { generateBlogPost, addNewPosts, CONFIG } = require('./blog-generator');
const { generateSitemap } = require('./sitemap-generator');
const cron = require('node-cron');

// Automation Configuration
const AUTO_CONFIG = {
  // Check every day at 9:00 AM, but only generate if 3+ days have passed
  schedule: '0 9 * * *',
  
  // How many posts to generate each time
  postsPerBatch: 1,
  
  // Minimum hours between posts (72 hours = 3 days)
  minHoursBetweenPosts: 72,
  
  // Enable/disable automation
  // Temporarily paused to focus on high-quality, human-edited long-form articles
  // per Google's "Helpful Content Update" guidelines against pure AI generation.
  enabled: false,
  
  // Update sitemap after generating posts
  updateSitemap: true,
  
  // Log file for automation activities
  logFile: 'blog-automation.log'
};

/**
 * Log automation activities
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  
  // Append to log file
  const fs = require('fs');
  try {
    fs.appendFileSync(AUTO_CONFIG.logFile, logMessage);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

/**
 * Check if enough time has passed since last post
 */
function canGenerateNewPost() {
  try {
    const fs = require('fs');
    if (!fs.existsSync(CONFIG.dataPath)) {
      return true; // No posts yet, can generate
    }
    
    const data = JSON.parse(fs.readFileSync(CONFIG.dataPath, 'utf8'));
    if (!data.posts || data.posts.length === 0) {
      return true; // No posts yet, can generate
    }
    
    // Check the most recent post
    const latestPost = data.posts[0];
    const latestPostTime = new Date(latestPost.publishDate);
    const now = new Date();
    const hoursSinceLastPost = (now - latestPostTime) / (1000 * 60 * 60);
    
    return hoursSinceLastPost >= AUTO_CONFIG.minHoursBetweenPosts;
  } catch (error) {
    log(`Error checking last post time: ${error.message}`);
    return true; // Default to allowing generation
  }
}

/**
 * Generate new blog posts automatically
 */
async function generateAutomaticPosts() {
  log('🤖 Starting automatic blog post generation...');
  
  try {
    // Check if we should generate new posts
    if (!canGenerateNewPost()) {
      log('⏰ Not enough time passed since last post. Skipping generation.');
      return;
    }
    
    // Generate new posts
    log(`📝 Generating ${AUTO_CONFIG.postsPerBatch} new blog post(s)...`);
    const newPosts = addNewPosts(AUTO_CONFIG.postsPerBatch);
    
    if (newPosts && newPosts.length > 0) {
      log(`✅ Successfully generated ${newPosts.length} new blog post(s)`);
      
      // Log the titles of generated posts
      newPosts.slice(0, AUTO_CONFIG.postsPerBatch).forEach((post, index) => {
        log(`   ${index + 1}. "${post.title}"`);
      });
      
      // Update sitemap if enabled
      if (AUTO_CONFIG.updateSitemap) {
        try {
          generateSitemap();
          log('🗺️ Sitemap updated successfully');
        } catch (error) {
          log(`❌ Failed to update sitemap: ${error.message}`);
        }
      }
      
      log('🎉 Automatic blog generation completed successfully!');
    } else {
      log('❌ No posts were generated');
    }
    
  } catch (error) {
    log(`❌ Error during automatic blog generation: ${error.message}`);
  }
}

/**
 * Start the automated blog generation system
 */
function startAutomation() {
  if (!AUTO_CONFIG.enabled) {
    log('🚫 Blog automation is disabled');
    return;
  }
  
  log('🚀 Starting NSM Prime Blog Automation System');
  log(`📅 Schedule: ${AUTO_CONFIG.schedule} (every 3 days at 9:00 AM)`);
  log(`📝 Posts per batch: ${AUTO_CONFIG.postsPerBatch}`);
  log(`⏰ Minimum hours between posts: ${AUTO_CONFIG.minHoursBetweenPosts}`);
  
  // Schedule the cron job
  const task = cron.schedule(AUTO_CONFIG.schedule, () => {
    generateAutomaticPosts();
  }, {
    scheduled: true,
    timezone: "America/Los_Angeles" // Las Vegas timezone
  });
  
  log('✅ Blog automation scheduled successfully');
  log('🔄 System running... Press Ctrl+C to stop');
  
  // Generate one post immediately if none exist
  setTimeout(() => {
    const fs = require('fs');
    try {
      if (!fs.existsSync(CONFIG.dataPath)) {
        log('📝 No existing posts found. Generating initial content...');
        generateAutomaticPosts();
      }
    } catch (error) {
      log(`Error checking for existing posts: ${error.message}`);
    }
  }, 5000); // Wait 5 seconds after startup
  
  return task;
}

/**
 * Command line interface
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'start':
      startAutomation();
      break;
      
    case 'generate':
      generateAutomaticPosts();
      break;
      
    case 'test':
      log('🧪 Testing blog generation...');
      generateAutomaticPosts();
      break;
      
    case 'status':
      const fs = require('fs');
      if (fs.existsSync(CONFIG.dataPath)) {
        const data = JSON.parse(fs.readFileSync(CONFIG.dataPath, 'utf8'));
        log(`📊 Current blog posts: ${data.posts.length}`);
        if (data.posts.length > 0) {
          const latest = data.posts[0];
          log(`📝 Latest post: "${latest.title}"`);
          log(`📅 Published: ${new Date(latest.publishDate).toLocaleString()}`);
        }
      } else {
        log('📊 No blog posts found');
      }
      break;
      
    case 'config':
      log('⚙️ Current configuration:');
      log(`   Schedule: ${AUTO_CONFIG.schedule}`);
      log(`   Posts per batch: ${AUTO_CONFIG.postsPerBatch}`);
      log(`   Min hours between posts: ${AUTO_CONFIG.minHoursBetweenPosts}`);
      log(`   Automation enabled: ${AUTO_CONFIG.enabled}`);
      log(`   Update sitemap: ${AUTO_CONFIG.updateSitemap}`);
      break;
      
    case 'help':
    default:
      console.log(`
🤖 NSM Prime Blog Automation System

Usage:
  node blog-automation-scheduler.js start     - Start continuous automation
  node blog-automation-scheduler.js generate  - Generate posts now
  node blog-automation-scheduler.js test      - Test generation (same as generate)
  node blog-automation-scheduler.js status    - Show current blog status
  node blog-automation-scheduler.js config    - Show current configuration
  node blog-automation-scheduler.js help      - Show this help

Examples:
  node blog-automation-scheduler.js start     - Run continuous automation
  node blog-automation-scheduler.js generate  - Generate a new post immediately
  node blog-automation-scheduler.js status    - Check how many posts exist

Schedule Format (cron):
  ${AUTO_CONFIG.schedule} = Every 3 days at 9:00 AM Las Vegas time
  
To run in background (Linux/Mac):
  nohup node blog-automation-scheduler.js start > blog-automation.log 2>&1 &
      `);
      break;
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('🛑 Blog automation system stopping...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('🛑 Blog automation system terminated');
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  startAutomation,
  generateAutomaticPosts,
  AUTO_CONFIG
};