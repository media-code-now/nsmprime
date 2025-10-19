// blog-seo-validator.js
// CI Test Implementation for Blog Post SEO Checklist

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const axios = require('axios');

class BlogSEOValidator {
  constructor(htmlFile, config = {}) {
    this.htmlFile = htmlFile;
    this.config = config;
    this.dom = null;
    this.document = null;
    this.checklist = null;
    this.results = {
      critical: [],
      high: [],
      medium: [],
      passed: 0,
      failed: 0,
      score: 0
    };
  }

  async initialize() {
    // Load HTML file
    const htmlContent = fs.readFileSync(this.htmlFile, 'utf8');
    this.dom = new JSDOM(htmlContent);
    this.document = this.dom.window.document;

    // Load checklist
    const checklistPath = path.join(__dirname, 'blog-post-seo-checklist.json');
    this.checklist = JSON.parse(fs.readFileSync(checklistPath, 'utf8'));
  }

  // Test: Search Intent Match
  testSearchIntentMatch(primaryKeyword, targetWordCount = null) {
    const results = {
      testId: 'content_001',
      passed: true,
      errors: [],
      details: {}
    };

    // Check keyword in first 100 words
    const intro = this.getIntroText();
    const introWords = intro.split(' ').slice(0, 100).join(' ');
    
    if (!introWords.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      results.passed = false;
      results.errors.push('Primary keyword not found in first 100 words');
    }

    // Check content length
    const wordCount = this.getWordCount();
    results.details.wordCount = wordCount;

    if (targetWordCount && Math.abs(wordCount - targetWordCount) > targetWordCount * 0.2) {
      results.passed = false;
      results.errors.push(`Content length ${wordCount} not within 20% of target ${targetWordCount}`);
    }

    return results;
  }

  // Test: H1 Optimization
  testH1Optimization(primaryKeyword) {
    const results = {
      testId: 'heading_001',
      passed: true,
      errors: [],
      details: {}
    };

    const h1Elements = this.document.querySelectorAll('h1');
    
    // Exactly one H1
    if (h1Elements.length !== 1) {
      results.passed = false;
      results.errors.push(`Found ${h1Elements.length} H1 tags, expected exactly 1`);
      return results;
    }

    const h1Text = h1Elements[0].textContent.trim();
    results.details.h1Text = h1Text;
    results.details.h1Length = h1Text.length;

    // H1 length validation
    if (h1Text.length < 20 || h1Text.length > 70) {
      results.passed = false;
      results.errors.push(`H1 length ${h1Text.length} not between 20-70 characters`);
    }

    // Primary keyword in H1
    if (!h1Text.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      results.passed = false;
      results.errors.push('Primary keyword not found in H1');
    }

    return results;
  }

  // Test: H2 Structure
  testH2Structure(semanticKeywords = []) {
    const results = {
      testId: 'heading_002',
      passed: true,
      errors: [],
      details: {}
    };

    const h2Elements = this.document.querySelectorAll('h2');
    const wordCount = this.getWordCount();
    const minH2Count = wordCount > 800 ? 3 : 2;

    results.details.h2Count = h2Elements.length;
    results.details.wordCount = wordCount;

    // Minimum H2 count
    if (h2Elements.length < minH2Count) {
      results.passed = false;
      results.errors.push(`Found ${h2Elements.length} H2 tags, expected at least ${minH2Count} for ${wordCount} word article`);
    }

    // H2 length validation
    const longH2s = Array.from(h2Elements).filter(h2 => h2.textContent.length > 80);
    if (longH2s.length > 0) {
      results.passed = false;
      results.errors.push(`${longH2s.length} H2 tags exceed 80 character limit`);
    }

    // Semantic keyword coverage
    if (semanticKeywords.length > 0) {
      const h2Text = Array.from(h2Elements).map(h2 => h2.textContent.toLowerCase()).join(' ');
      const keywordMatches = semanticKeywords.filter(keyword => 
        h2Text.includes(keyword.toLowerCase())
      );
      
      if (keywordMatches.length === 0) {
        results.passed = false;
        results.errors.push('No semantic keywords found in H2 headings');
      }
    }

    return results;
  }

  // Test: Introduction Hook
  testIntroHook(primaryKeyword) {
    const results = {
      testId: 'content_002',
      passed: true,
      errors: [],
      details: {}
    };

    const intro = this.getIntroText();
    const wordCount = intro.split(' ').length;

    results.details.introText = intro.substring(0, 100) + '...';
    results.details.wordCount = wordCount;

    // Word count validation
    if (wordCount > 80) {
      results.passed = false;
      results.errors.push(`Intro has ${wordCount} words, expected ≤80`);
    }

    // Primary keyword in intro
    if (!intro.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      results.passed = false;
      results.errors.push('Primary keyword not found in introduction');
    }

    return results;
  }

  // Test: Internal Links to Service Pages
  testInternalLinks() {
    const results = {
      testId: 'links_001',
      passed: true,
      errors: [],
      details: {}
    };

    const serviceLinks = this.document.querySelectorAll(
      'a[href*="/services/"], a[href*="service"]'
    );

    results.details.serviceLinkCount = serviceLinks.length;

    // Service link count
    if (serviceLinks.length < 3 || serviceLinks.length > 7) {
      results.passed = false;
      results.errors.push(`Found ${serviceLinks.length} service links, expected 3-7`);
    }

    // Anchor text quality
    const poorAnchorTexts = ['click here', 'read more', 'here', 'link'];
    const badLinks = Array.from(serviceLinks).filter(link => 
      poorAnchorTexts.includes(link.textContent.toLowerCase().trim())
    );

    if (badLinks.length > 0) {
      results.passed = false;
      results.errors.push(`${badLinks.length} links use poor anchor text`);
    }

    // Same tab validation
    const newTabLinks = Array.from(serviceLinks).filter(link => 
      link.getAttribute('target') === '_blank'
    );

    if (newTabLinks.length > 0) {
      results.passed = false;
      results.errors.push(`${newTabLinks.length} internal links open in new tab`);
    }

    return results;
  }

  // Test: External Authority Citations
  testExternalLinks() {
    const results = {
      testId: 'links_002',
      passed: true,
      errors: [],
      details: {}
    };

    const externalLinks = this.document.querySelectorAll(
      'a[href^="http"]:not([href*="nsmprime.com"])'
    );

    results.details.externalLinkCount = externalLinks.length;

    // External link count
    if (externalLinks.length < 2 || externalLinks.length > 6) {
      results.passed = false;
      results.errors.push(`Found ${externalLinks.length} external links, expected 2-6`);
    }

    // New tab validation
    const sameTabLinks = Array.from(externalLinks).filter(link => 
      link.getAttribute('target') !== '_blank'
    );

    if (sameTabLinks.length > 0) {
      results.passed = false;
      results.errors.push(`${sameTabLinks.length} external links should open in new tab`);
    }

    // Security attributes
    const insecureLinks = Array.from(externalLinks).filter(link => 
      !link.getAttribute('rel') || !link.getAttribute('rel').includes('noopener')
    );

    if (insecureLinks.length > 0) {
      results.passed = false;
      results.errors.push(`${insecureLinks.length} external links missing rel="noopener"`);
    }

    return results;
  }

  // Test: FAQ Section
  testFAQSection() {
    const results = {
      testId: 'content_004',
      passed: true,
      errors: [],
      details: {}
    };

    const faqSection = this.document.querySelector('.faq, .frequently-asked-questions, #faq');
    
    if (!faqSection) {
      results.passed = false;
      results.errors.push('No FAQ section found');
      return results;
    }

    const faqItems = this.document.querySelectorAll('.faq-item, .faq-question');
    results.details.faqCount = faqItems.length;

    // FAQ count validation
    if (faqItems.length < 3 || faqItems.length > 7) {
      results.passed = false;
      results.errors.push(`Found ${faqItems.length} FAQ items, expected 3-7`);
    }

    // FAQ schema validation
    const schemaScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    const hasFAQSchema = Array.from(schemaScripts).some(script => 
      script.textContent.includes('FAQPage')
    );

    if (!hasFAQSchema) {
      results.passed = false;
      results.errors.push('Missing FAQPage schema markup');
    }

    return results;
  }

  // Test: Meta Title
  testMetaTitle(primaryKeyword) {
    const results = {
      testId: 'meta_001',
      passed: true,
      errors: [],
      details: {}
    };

    const titleElement = this.document.querySelector('title');
    
    if (!titleElement) {
      results.passed = false;
      results.errors.push('No title tag found');
      return results;
    }

    const title = titleElement.textContent.trim();
    results.details.title = title;
    results.details.length = title.length;

    // Title length validation
    if (title.length < 30 || title.length > 60) {
      results.passed = false;
      results.errors.push(`Title length ${title.length} not between 30-60 characters`);
    }

    // Primary keyword in first 30 characters
    if (!title.substring(0, 30).toLowerCase().includes(primaryKeyword.toLowerCase())) {
      results.passed = false;
      results.errors.push('Primary keyword not in first 30 characters of title');
    }

    return results;
  }

  // Test: Meta Description
  testMetaDescription(primaryKeyword) {
    const results = {
      testId: 'meta_002',
      passed: true,
      errors: [],
      details: {}
    };

    const metaDesc = this.document.querySelector('meta[name="description"]');
    
    if (!metaDesc) {
      results.passed = false;
      results.errors.push('No meta description found');
      return results;
    }

    const description = metaDesc.getAttribute('content').trim();
    results.details.description = description;
    results.details.length = description.length;

    // Description length validation
    if (description.length < 120 || description.length > 160) {
      results.passed = false;
      results.errors.push(`Description length ${description.length} not between 120-160 characters`);
    }

    // Primary keyword validation
    if (!description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      results.passed = false;
      results.errors.push('Primary keyword not found in meta description');
    }

    // CTA validation
    const ctaWords = ['learn', 'discover', 'get', 'find', 'start', 'contact', 'download'];
    const hasCTA = ctaWords.some(word => description.toLowerCase().includes(word));

    if (!hasCTA) {
      results.passed = false;
      results.errors.push('No call-to-action found in meta description');
    }

    return results;
  }

  // Test: Alt Text Optimization
  testAltText(primaryKeyword) {
    const results = {
      testId: 'image_001',
      passed: true,
      errors: [],
      details: {}
    };

    const images = this.document.querySelectorAll('img');
    results.details.imageCount = images.length;

    // All images have alt text
    const imagesWithoutAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
    if (imagesWithoutAlt.length > 0) {
      results.passed = false;
      results.errors.push(`${imagesWithoutAlt.length} images missing alt attributes`);
    }

    // Alt text length validation
    const imagesWithAlt = Array.from(images).filter(img => 
      img.hasAttribute('alt') && img.getAttribute('alt').trim() !== ''
    );

    const invalidAltLength = imagesWithAlt.filter(img => {
      const altLength = img.getAttribute('alt').length;
      return altLength < 5 || altLength > 125;
    });

    if (invalidAltLength.length > 0) {
      results.passed = false;
      results.errors.push(`${invalidAltLength.length} images have alt text outside 5-125 character range`);
    }

    // Featured image keyword check
    const featuredImage = this.document.querySelector(
      '.featured-image img, .hero-image img, article img:first-of-type'
    );

    if (featuredImage && featuredImage.getAttribute('alt')) {
      const featuredAlt = featuredImage.getAttribute('alt').toLowerCase();
      if (!featuredAlt.includes(primaryKeyword.toLowerCase())) {
        results.passed = false;
        results.errors.push('Featured image alt text missing primary keyword');
      }
    }

    return results;
  }

  // Test: Article Schema
  testArticleSchema() {
    const results = {
      testId: 'schema_001',
      passed: true,
      errors: [],
      details: {}
    };

    const schemaScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    
    let articleSchema = null;
    for (const script of schemaScripts) {
      try {
        const schemaData = JSON.parse(script.textContent);
        if (schemaData['@type'] === 'Article') {
          articleSchema = schemaData;
          break;
        }
      } catch (e) {
        // Invalid JSON, continue
      }
    }

    if (!articleSchema) {
      results.passed = false;
      results.errors.push('No Article schema found');
      return results;
    }

    // Required fields validation
    const requiredFields = ['headline', 'author', 'publisher', 'datePublished', 'mainEntityOfPage'];
    const missingFields = requiredFields.filter(field => !articleSchema.hasOwnProperty(field));

    if (missingFields.length > 0) {
      results.passed = false;
      results.errors.push(`Missing required schema fields: ${missingFields.join(', ')}`);
    }

    // Publisher logo validation
    if (!articleSchema.publisher?.logo?.url) {
      results.passed = false;
      results.errors.push('Publisher schema missing logo URL');
    }

    return results;
  }

  // Helper Methods
  getIntroText() {
    const selectors = [
      '.blog-intro p:first-child',
      'article p:first-of-type',
      '.post-content > p:first-child',
      'main p:first-of-type'
    ];

    for (const selector of selectors) {
      const element = this.document.querySelector(selector);
      if (element) {
        return element.textContent.trim();
      }
    }

    return '';
  }

  getWordCount() {
    const content = this.document.querySelector('article, .post-content, main');
    if (!content) return 0;

    const text = content.textContent.replace(/\s+/g, ' ').trim();
    return text.split(' ').length;
  }

  // Run all tests
  async runAllTests(config = {}) {
    await this.initialize();

    const {
      primaryKeyword = '',
      semanticKeywords = [],
      targetWordCount = null
    } = config;

    const tests = [
      () => this.testSearchIntentMatch(primaryKeyword, targetWordCount),
      () => this.testH1Optimization(primaryKeyword),
      () => this.testH2Structure(semanticKeywords),
      () => this.testIntroHook(primaryKeyword),
      () => this.testInternalLinks(),
      () => this.testExternalLinks(),
      () => this.testFAQSection(),
      () => this.testMetaTitle(primaryKeyword),
      () => this.testMetaDescription(primaryKeyword),
      () => this.testAltText(primaryKeyword),
      () => this.testArticleSchema()
    ];

    const results = {
      file: this.htmlFile,
      timestamp: new Date().toISOString(),
      config: config,
      tests: [],
      summary: {
        total: tests.length,
        passed: 0,
        failed: 0,
        critical_failed: 0,
        score: 0
      }
    };

    // Run each test
    for (const test of tests) {
      try {
        const result = test();
        results.tests.push(result);

        if (result.passed) {
          results.summary.passed++;
        } else {
          results.summary.failed++;
          
          // Check if critical test
          const criticalTests = this.checklist.blogPostSEOChecklist.testSuites.criticalChecks.tests;
          if (criticalTests.includes(result.testId)) {
            results.summary.critical_failed++;
          }
        }
      } catch (error) {
        results.tests.push({
          testId: 'unknown',
          passed: false,
          errors: [`Test execution error: ${error.message}`],
          details: {}
        });
        results.summary.failed++;
      }
    }

    // Calculate score
    const criticalWeight = 10;
    const highWeight = 5;
    const mediumWeight = 2;

    let totalScore = 0;
    let maxScore = 0;

    for (const test of results.tests) {
      const category = this.getTestCategory(test.testId);
      const weight = category === 'critical' ? criticalWeight : 
                    category === 'high' ? highWeight : mediumWeight;
      
      maxScore += weight;
      if (test.passed) {
        totalScore += weight;
      }
    }

    results.summary.score = Math.round((totalScore / maxScore) * 100);

    return results;
  }

  getTestCategory(testId) {
    const checklist = this.checklist.blogPostSEOChecklist;
    
    if (checklist.testSuites.criticalChecks.tests.includes(testId)) {
      return 'critical';
    }
    if (checklist.testSuites.highPriorityChecks.tests.includes(testId)) {
      return 'high';
    }
    return 'medium';
  }

  // Generate detailed report
  generateReport(results) {
    let report = `\n=== BLOG POST SEO VALIDATION REPORT ===\n`;
    report += `File: ${results.file}\n`;
    report += `Timestamp: ${results.timestamp}\n`;
    report += `Score: ${results.summary.score}/100\n`;
    report += `Tests: ${results.summary.passed}/${results.summary.total} passed\n`;
    
    if (results.summary.critical_failed > 0) {
      report += `⚠️  CRITICAL FAILURES: ${results.summary.critical_failed}\n`;
    }

    report += `\n--- TEST RESULTS ---\n`;

    for (const test of results.tests) {
      const status = test.passed ? '✅' : '❌';
      const category = this.getTestCategory(test.testId);
      
      report += `\n${status} [${category.toUpperCase()}] ${test.testId}\n`;
      
      if (test.errors.length > 0) {
        for (const error of test.errors) {
          report += `   • ${error}\n`;
        }
      }
      
      if (Object.keys(test.details).length > 0) {
        report += `   Details: ${JSON.stringify(test.details, null, 2)}\n`;
      }
    }

    return report;
  }
}

module.exports = BlogSEOValidator;

// CLI Usage Example
if (require.main === module) {
  const validator = new BlogSEOValidator(process.argv[2]);
  
  const config = {
    primaryKeyword: process.argv[3] || 'digital marketing',
    semanticKeywords: ['SEO', 'content marketing', 'social media'],
    targetWordCount: 1500
  };

  validator.runAllTests(config)
    .then(results => {
      console.log(validator.generateReport(results));
      
      // Exit with error code if critical tests failed
      if (results.summary.critical_failed > 0) {
        process.exit(1);
      }
      
      // Exit with warning code if score below threshold
      if (results.summary.score < 80) {
        process.exit(2);
      }
      
      process.exit(0);
    })
    .catch(error => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}