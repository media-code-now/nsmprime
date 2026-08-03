// programmatic-seo-generator.js
// Implementation code for generating scaled local SEO pages

class ProgrammaticSEOGenerator {
  constructor(templateConfig) {
    this.config = templateConfig.programmaticSEOTemplate;
    this.generatedPages = new Set();
    this.contentFingerprints = new Map();
  }

  // Generate a single page based on parameters
  generatePage(location, businessType, industryCategory) {
    const pageData = {
      location,
      businessType,
      industryCategory,
      locationSlug: this.createSlug(location),
      businessTypeSlug: this.createSlug(businessType),
      pageId: this.createPageId(location, businessType)
    };

    // Apply duplication guards
    const variationIndex = this.calculateVariationIndex(pageData);
    
    return {
      url: this.generateURL(pageData),
      title: this.generateTitle(pageData, variationIndex),
      metaDescription: this.generateMetaDescription(pageData, variationIndex),
      content: this.generateContent(pageData, variationIndex),
      schema: this.generateSchema(pageData),
      internalLinks: this.generateInternalLinks(pageData)
    };
  }

  // Create unique page identifier
  createPageId(location, businessType) {
    return `${this.createSlug(location)}-${this.createSlug(businessType)}`;
  }

  // Generate URL structure
  generateURL(pageData) {
    return `/local-seo-${pageData.locationSlug}-${pageData.businessTypeSlug}`;
  }

  // Generate page title with variation
  generateTitle(pageData, variationIndex) {
    const titleTemplates = this.config.dynamicOutlineTemplate.h1_variations;
    const template = titleTemplates[variationIndex % titleTemplates.length];
    
    return this.interpolateTemplate(template, {
      location: pageData.location,
      business_type: pageData.businessType,
      competitive_modifier: this.getCompetitiveModifier(pageData),
      service_category: pageData.industryCategory
    });
  }

  // Generate meta description with variation
  generateMetaDescription(pageData, variationIndex) {
    const templates = [
      "Dominate {{location}} search results with proven local SEO strategies for {{business_type}}. Increase visibility, attract customers, and grow your {{service_category}} business today.",
      "{{competitive_modifier}} local SEO services for {{business_type}} in {{location}}. Boost your search rankings and attract more qualified customers in Nevada.",
      "Transform your {{business_type}} visibility in {{location}} with expert local SEO strategies. Get more customers and outrank competitors with proven tactics.",
      "{{location}} {{business_type}} local SEO specialists. Increase your online presence, drive more traffic, and grow your {{service_category}} business effectively.",
      "Professional local SEO for {{location}} {{business_type}}. Improve Google rankings, increase local visibility, and attract more customers in Nevada."
    ];
    
    const template = templates[variationIndex % templates.length];
    
    return this.interpolateTemplate(template, {
      location: pageData.location,
      business_type: pageData.businessType,
      competitive_modifier: this.getCompetitiveModifier(pageData),
      service_category: pageData.industryCategory
    });
  }

  // Generate main content with duplication guards
  generateContent(pageData, variationIndex) {
    const introHookType = this.selectIntroHook(variationIndex);
    const benefitOrder = this.shuffleBenefits(pageData);
    const proofPoints = this.selectProofPoints(pageData);
    const sectionOrder = this.determineSectionOrder(pageData.businessType);

    return {
      introHook: this.generateIntroHook(pageData, introHookType),
      mainSections: this.generateMainSections(pageData, sectionOrder),
      benefits: this.generateBenefits(pageData, benefitOrder),
      proofPoints: this.generateProofPoints(pageData, proofPoints),
      conclusion: this.generateConclusion(pageData)
    };
  }

  // Select intro hook variation based on page position
  selectIntroHook(variationIndex) {
    const hookTypes = ['struggle_pain_point', 'opportunity_focused', 'statistic_driven', 'competitive_advantage', 'local_market_insight'];
    return hookTypes[variationIndex % hookTypes.length];
  }

  // Generate intro hook with interpolation
  generateIntroHook(pageData, hookType) {
    const template = this.config.copyBlockTemplates.intro_hooks[hookType];
    
    return this.interpolateTemplate(template, {
      business_type: pageData.businessType,
      location: pageData.location,
      service_category: pageData.industryCategory,
      competitor_count: this.getCompetitorCount(pageData.location, pageData.businessType),
      population_data: this.getPopulationData(pageData.location),
      tourist_data: this.getTouristData(pageData.location),
      percentage: this.getRandomPercentage(75, 85),
      small_percentage: this.getRandomPercentage(15, 25)
    });
  }

  // Generate main content sections
  generateMainSections(pageData, sectionOrder) {
    const sections = [];
    
    for (const sectionId of sectionOrder) {
      const sectionConfig = this.config.dynamicOutlineTemplate.section_structure.main_sections.find(s => s.section_id === sectionId);
      if (sectionConfig) {
        const h2Options = sectionConfig.h2_options;
        const selectedH2 = h2Options[Math.floor(Math.random() * h2Options.length)];
        
        sections.push({
          id: sectionId,
          h2: this.interpolateTemplate(selectedH2, pageData),
          content: this.generateSectionContent(pageData, sectionId)
        });
      }
    }
    
    return sections;
  }

  // Generate section-specific content
  generateSectionContent(pageData, sectionId) {
    const contentMap = {
      'local_market_analysis': this.generateMarketAnalysisContent(pageData),
      'gmb_optimization': this.generateGMBContent(pageData),
      'local_citation_strategy': this.generateCitationContent(pageData),
      'content_marketing': this.generateContentMarketingContent(pageData),
      'review_management': this.generateReviewContent(pageData),
      'results_measurement': this.generateResultsContent(pageData)
    };
    
    return contentMap[sectionId] || '';
  }

  generateMarketAnalysisContent(pageData) {
      return `
      <p>${pageData.location}'s ${pageData.businessType} market presents unique opportunities for practices that understand local search optimization. With significant demand and established competitors, standing out requires strategic local SEO implementation.</p>
      <h3>Market Characteristics</h3>
      <ul>
          <li><strong>Demographics:</strong> Diverse community with specific needs for ${pageData.businessType}</li>
          <li><strong>Competition Level:</strong> Moderate to high for ${pageData.businessType}</li>
          <li><strong>Search Patterns:</strong> High volume of "near me" searches for ${pageData.industryCategory}</li>
          <li><strong>Mobile Usage:</strong> Over 80% of searches for ${pageData.businessType} happen on mobile devices</li>
      </ul>
      <p>Understanding these patterns allows ${pageData.location} ${pageData.businessType} to optimize their online presence for maximum acquisition.</p>
      `;
  }

  generateGMBContent(pageData) {
      return `
      <p>Your Google Business Profile (formerly GMB) is the cornerstone of local marketing in ${pageData.location}. An optimized profile increases your visibility significantly in local search results.</p>
      <h3>Essential GMB Elements for ${pageData.businessType}</h3>
      <ul>
          <li><strong>Complete Information:</strong> Accurate name, address, phone, and hours</li>
          <li><strong>Professional Photos:</strong> High-quality images of your ${pageData.businessType} operations</li>
          <li><strong>Service Descriptions:</strong> Detailed descriptions of ${pageData.industryCategory} services offered</li>
          <li><strong>Reviews:</strong> Proactive review management strategy</li>
          <li><strong>Updates:</strong> Regular posts about ${pageData.businessType} news and offers</li>
      </ul>
      `;
  }

  generateCitationContent(pageData) {
      return `
      <p>Building consistent local citations establishes your ${pageData.businessType} as a trusted ${pageData.location} provider while improving local search rankings.</p>
      <h3>Essential Citations</h3>
      <ul>
          <li><strong>Industry Directories:</strong> Niche sites for ${pageData.industryCategory}</li>
          <li><strong>Local Directories:</strong> ${pageData.location} Chamber of Commerce and local guides</li>
          <li><strong>General Platforms:</strong> Yelp, YellowPages, Bing Places</li>
      </ul>
      <p>Consistency in Name, Address, and Phone Number (NAP) across all these platforms is crucial for maximizing your local authority.</p>
      `;
  }

  generateContentMarketingContent(pageData) {
      return `
      <p>Content marketing is vital for ${pageData.businessType} in ${pageData.location}. By creating helpful content that addresses local questions, you can capture traffic earlier in the buying cycle.</p>
      <h3>Content Ideas for ${pageData.location} ${pageData.businessType}</h3>
      <ul>
          <li>Local guides relevant to ${pageData.industryCategory}</li>
          <li>Frequently Asked Questions about ${pageData.businessType} services</li>
          <li>Case studies from ${pageData.location} clients</li>
          <li>Community involvement updates</li>
      </ul>
      `;
  }

  generateReviewContent(pageData) {
      return `
      <p>Online reviews significantly impact customer acquisition for ${pageData.location} ${pageData.businessType}. The vast majority of customers read reviews before choosing a provider.</p>
      <h3>Review Strategy</h3>
      <ul>
          <li><strong>Generation:</strong> Systematically request reviews from happy clients</li>
          <li><strong>Response:</strong> Professional responses to all reviews within 24 hours</li>
          <li><strong>Monitoring:</strong> Continuous tracking across all platforms</li>
      </ul>
      `;
  }

  generateResultsContent(pageData) {
      return `
      <p>Measuring the success of your local SEO efforts is essential to refining your strategy in ${pageData.location}.</p>
      <h3>Key Metrics for ${pageData.businessType}</h3>
      <ul>
          <li><strong>Map Rankings:</strong> Visibility in the Local Pack for key terms</li>
          <li><strong>Organic Traffic:</strong> Visitors to your website from search engines</li>
          <li><strong>Conversions:</strong> Phone calls, form fills, and direction requests</li>
          <li><strong>Review Growth:</strong> Velocity and sentiment of new reviews</li>
      </ul>
      `;
  }

  generateBenefits(pageData, benefitOrder) {
    let html = '<div class="benefits-section">';
    html += `<h2>Why ${pageData.businessType} in ${pageData.location} Need Local SEO</h2>`;
    html += '<ul>';
    
    for (const benefitType of benefitOrder) {
      const templates = this.config.copyBlockTemplates.benefit_sections[benefitType];
      if (templates && templates.length > 0) {
        // Pick one random template from the list to avoid repetition
        const template = templates[this.simpleHash(pageData.location + benefitType) % templates.length];
        const content = this.interpolateTemplate(template, {
          location: pageData.location,
          business_type: pageData.businessType,
          percentage: this.getRandomPercentage(20, 50),
          target_audience: pageData.industryCategory === 'healthcare' ? 'patients' : 'customers'
        });
        html += `<li>${content}</li>`;
      }
    }
    html += '</ul></div>';
    return html;
  }

  generateProofPoints(pageData, proofPoints) {
    let html = '<div class="proof-points">';
    html += `<h3>Success Stories: ${pageData.businessType} in ${pageData.location}</h3>`;
    
    for (const proofType of proofPoints) {
      const templates = this.config.copyBlockTemplates.proof_points[proofType];
      if (templates && templates.length > 0) {
        const template = templates[this.simpleHash(pageData.businessType + proofType) % templates.length];
        const content = this.interpolateTemplate(template, {
          business_name: this.generateBusinessName(pageData),
          business_type: pageData.businessType,
          location: pageData.location,
          percentage: this.getRandomPercentage(100, 300),
          number: this.getRandomNumber(20, 100),
          timeframe: this.getRandomTimeframe(),
          keyword_count: this.getRandomNumber(10, 50),
          revenue: this.getRandomRevenue(),
          client_name: this.generateClientName(),
          target_audience: 'customers',
          keyword: `${pageData.businessType} in ${pageData.location}`
        });
        html += `<div class="proof-item"><blockquote>${content}</blockquote></div>`;
      }
    }
    html += '</div>';
    return html;
  }

  generateSchema(pageData) {
    const schemaTemplate = this.config.schemaTemplates.localBusiness_schema;
    
    let schemaString = JSON.stringify(schemaTemplate);
    
    // Handle complex objects by replacing the quoted placeholder with the raw JSON string
    // This allows the resulting JSON to have actual Arrays/Objects instead of strings containing them
    const serviceListJSON = this.generateServiceList(pageData);
    const reviewSchemaJSON = this.generateReviewSchema(pageData);
    const socialMediaJSON = '["https://facebook.com/nsmprime", "https://twitter.com/nsmprime"]';
    
    schemaString = schemaString.replace(/"{{service_list}}"/g, serviceListJSON);
    schemaString = schemaString.replace(/"{{review_schema_array}}"/g, reviewSchemaJSON);
    schemaString = schemaString.replace(/"{{social_media_profiles}}"/g, socialMediaJSON);

    const populatedString = this.interpolateTemplate(schemaString, {
      business_name: this.generateBusinessName(pageData),
      service_category: pageData.industryCategory,
      location: pageData.location,
      competitive_modifier: this.getCompetitiveModifier(pageData),
      business_type: pageData.businessType,
      value_proposition: this.generateValueProposition(pageData),
      page_url: `https://nsmprime.com${this.generateURL(pageData)}`,
      street_address: `${this.getRandomNumber(100, 9999)} Local Blvd`,
      zip_code: "89101",
      latitude: this.getLatitude(pageData.location),
      longitude: this.getLongitude(pageData.location),
      phone_number: "(702) 555-0123",
      email: "noam@nsmprime.com",
      opening_hours: "Mo-Fr 09:00-17:00",
      price_range: "$$",
      rating_value: "4.8",
      review_count: "124"
    });
    
    try {
        return JSON.parse(populatedString);
    } catch (e) {
        console.error("Schema generation error", e);
        return {};
    }
  }

  generateInternalLinks(pageData) {
    // Generate navigation structure for the page
    const links = [];
    
    // Add pillar link
    links.push({
      url: "/local-seo-las-vegas-guide",
      text: "Comprehensive Las Vegas SEO Guide",
      rel: "parent"
    });
    
    // Add service link
    links.push({
      url: "/services/seo/",
      text: "Professional SEO Services",
      rel: "related"
    });
    
    return links;
  }

  generateConclusion(pageData) {
    return `
      <div class="conclusion-section">
        <h2>Dominate the ${pageData.location} Market Today</h2>
        <p>Your ${pageData.businessType} practice deserves to be found by local customers in ${pageData.location}. 
        Don't let competitors capture the market share that should be yours.</p>
        <p><strong>Ready to increase your local visibility?</strong> Contact NSM Prime today for a free local SEO audit specifically for your ${pageData.location} business.</p>
      </div>
    `;
  }

  // Helpers
  generateValueProposition(pageData) {
      return `Top-rated ${pageData.businessType} services`;
  }
  
  generateServiceList(pageData) {
      return JSON.stringify([{ "@type": "Offer", "name": `${pageData.businessType} Service` }]);
  }
  
  generateReviewSchema(pageData) {
       return JSON.stringify([]);
  }

  getLatitude(location) { return "36.1699"; }
  getLongitude(location) { return "-115.1398"; }

  getCompetitorCount(location, businessType) { return this.getRandomNumber(10, 50); }
  getPopulationData(location) { 
    const map = {
        'Henderson': '320,000+',
        'Summerlin': '120,000+',
        'North Las Vegas': '275,000+',
        'Paradise': '231,000+',
        'Spring Valley': '215,000+',
        'Sunrise Manor': '190,000+',
        'Enterprise': '220,000+',
        'Centennial Hills': '50,000+',
        'Green Valley': '45,000+'
    };
    return map[location] || '100,000+'; 
  }
  
  getTouristData(location) { return "42 million"; }
  
  getIndustryCategory(businessType) {
      if (['dentists', 'medical practices'].includes(businessType)) return 'healthcare';
      if (['lawyers'].includes(businessType)) return 'legal';
      if (['plumbers', 'hvac contractors', 'electricians'].includes(businessType)) return 'home services';
      return 'professional services';
  }
  
  // Utility functions for data generation
  calculateVariationIndex(pageData) {
    return parseInt(pageData.pageId.split('').map(c => c.charCodeAt(0)).join('')) % 1000;
  }

  shuffleBenefits(pageData) {
    const benefits = ['gmb_benefits', 'citation_benefits', 'content_benefits'];
    const hash = this.simpleHash(pageData.location + pageData.businessType);
    return this.shuffleArray(benefits, hash);
  }

  selectProofPoints(pageData) {
    const allTypes = ['case_studies', 'statistics', 'testimonials'];
    const industryFactor = pageData.industryCategory === 'healthcare' ? 0 : 1;
    const locationFactor = pageData.location.includes('Las Vegas') ? 0 : 1;
    
    return allTypes.slice(0, 2 + (industryFactor + locationFactor) % 2);
  }

  determineSectionOrder(businessType) {
    const defaultOrder = ['local_market_analysis', 'gmb_optimization', 'local_citation_strategy', 'content_marketing', 'review_management', 'results_measurement'];
    
    if (businessType.includes('medical') || businessType.includes('healthcare')) {
      return ['gmb_optimization', 'review_management', 'local_market_analysis', 'local_citation_strategy', 'content_marketing', 'results_measurement'];
    }
    
    return defaultOrder;
  }

  // Template interpolation
  interpolateTemplate(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  // Helper functions for generating realistic data
  getCompetitiveModifier(pageData) {
    const modifiers = this.config.variableTokens.competitive_modifiers;
    const index = this.simpleHash(pageData.location + pageData.businessType) % modifiers.length;
    return modifiers[index];
  }

  getRandomPercentage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomTimeframe() {
    const timeframes = ['3', '6', '9', '12'];
    return timeframes[Math.floor(Math.random() * timeframes.length)];
  }

  getRandomRevenue() {
    const revenues = ['50,000', '75,000', '100,000', '150,000', '200,000'];
    return revenues[Math.floor(Math.random() * revenues.length)];
  }

  generateBusinessName(pageData) {
    const prefixes = ['Elite', 'Premier', 'Professional', 'Expert', 'Trusted'];
    const prefix = prefixes[this.simpleHash(pageData.location) % prefixes.length];
    return `${prefix} ${pageData.businessType}`;
  }

  generateClientName() {
    const names = ['Sarah Johnson', 'Mike Rodriguez', 'Lisa Chen', 'David Thompson', 'Maria Garcia'];
    return names[Math.floor(Math.random() * names.length)];
  }

  createSlug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  shuffleArray(array, seed) {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    
    while (currentIndex !== 0) {
      const randomIndex = (seed + currentIndex) % currentIndex;
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }
    
    return shuffled;
  }

  // Batch generation for scaling
  generateBatch(locations, businessTypes) {
    const pages = [];
    
    for (const location of locations) {
      for (const businessType of businessTypes) {
        const industryCategory = this.getIndustryCategory(businessType);
        const page = this.generatePage(location, businessType, industryCategory);
        
        // Quality control check
        if (this.passesQualityControl(page)) {
          pages.push(page);
          this.generatedPages.add(page.url);
        }
      }
    }
    
    return pages;
  }

  // Quality control validation
  passesQualityControl(page) {
    const wordCount = page.content.introHook.split(' ').length + 
                     page.content.mainSections.reduce((acc, section) => acc + section.content.split(' ').length, 0);
    
    if (wordCount < this.config.pageGenerationRules.quality_controls.minimum_word_count) {
      return false;
    }
    
    // Check for uniqueness
    const contentFingerprint = this.generateContentFingerprint(page.content);
    if (this.contentFingerprints.has(contentFingerprint)) {
      return false;
    }
    
    this.contentFingerprints.set(contentFingerprint, page.url);
    return true;
  }

  generateContentFingerprint(content) {
    const text = JSON.stringify(content);
    return this.simpleHash(text).toString();
  }
}

// Export for use
module.exports = ProgrammaticSEOGenerator;

// Usage example:
/*
const templateConfig = require('./programmatic-seo-template.json');
const generator = new ProgrammaticSEOGenerator(templateConfig);

// Generate single page
const page = generator.generatePage('Henderson', 'dentists', 'healthcare');

// Generate batch
const locations = ['Las Vegas', 'Henderson', 'Summerlin'];
const businessTypes = ['dentists', 'restaurants', 'HVAC contractors'];
const pages = generator.generateBatch(locations, businessTypes);

console.log(`Generated ${pages.length} unique pages`);
*/