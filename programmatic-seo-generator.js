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
      const sectionConfig = this.config.dynamicOutlineTemplate.main_sections.find(s => s.section_id === sectionId);
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

  // Generate benefits with shuffled order
  generateBenefits(pageData, benefitOrder) {
    const allBenefits = this.config.copyBlockTemplates.benefit_sections;
    const selectedBenefits = [];
    
    for (const benefitType of benefitOrder) {
      if (allBenefits[benefitType]) {
        const benefits = allBenefits[benefitType].map(benefit => 
          this.interpolateTemplate(benefit, {
            business_type: pageData.businessType,
            location: pageData.location,
            target_audience: this.getTargetAudience(pageData),
            percentage: this.getRandomPercentage(15, 35)
          })
        );
        selectedBenefits.push({
          type: benefitType,
          benefits: benefits
        });
      }
    }
    
    return selectedBenefits;
  }

  // Generate proof points
  generateProofPoints(pageData, proofPointTypes) {
    const proofPoints = [];
    
    for (const type of proofPointTypes) {
      const templates = this.config.copyBlockTemplates.proof_points[type];
      if (templates) {
        const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
        proofPoints.push({
          type: type,
          content: this.interpolateTemplate(selectedTemplate, {
            business_name: this.generateBusinessName(pageData),
            business_type: pageData.businessType,
            location: pageData.location,
            percentage: this.getRandomPercentage(20, 40),
            number: this.getRandomNumber(15, 50),
            timeframe: this.getRandomTimeframe(),
            keyword_count: this.getRandomNumber(5, 15),
            revenue: this.getRandomRevenue(),
            client_name: this.generateClientName(),
            keyword: `${pageData.businessType} ${pageData.location}`
          })
        });
      }
    }
    
    return proofPoints;
  }

  // Generate LocalBusiness schema
  generateSchema(pageData) {
    const localBusinessSchema = JSON.parse(JSON.stringify(this.config.schemaTemplates.localBusiness_schema));
    
    return this.interpolateTemplate(JSON.stringify(localBusinessSchema), {
      business_name: `NSM Prime - Local SEO for ${pageData.businessType}`,
      service_category: pageData.industryCategory,
      location: pageData.location,
      competitive_modifier: this.getCompetitiveModifier(pageData),
      business_type: pageData.businessType,
      value_proposition: this.generateValueProposition(pageData),
      page_url: `https://nsmprime.com${this.generateURL(pageData)}`,
      street_address: "123 Business Blvd",
      zip_code: this.getZipCode(pageData.location),
      latitude: this.getLatitude(pageData.location),
      longitude: this.getLongitude(pageData.location),
      phone_number: "(917) 972-7298",
      email: "contact@nsmprime.com",
      opening_hours: "Mo-Fr 09:00-17:00",
      price_range: "$$",
      service_list: this.generateServiceList(pageData),
      rating_value: "4.9",
      review_count: this.getRandomNumber(50, 150),
      review_schema_array: this.generateReviewSchema(pageData),
      social_media_profiles: JSON.stringify([
        "https://www.facebook.com/nsmprime",
        "https://www.linkedin.com/company/nsmprime"
      ])
    });
  }

  // Generate internal links based on relevance
  generateInternalLinks(pageData) {
    const links = [];
    
    // Add pillar content link
    const pillarLink = this.config.internalLinkingMap.hub_connections.primary_pillar;
    links.push({
      url: pillarLink.url,
      anchor: pillarLink.anchor_variations[0],
      placement: 'intro'
    });
    
    // Add service page links
    for (const serviceLink of this.config.internalLinkingMap.hub_connections.service_pages) {
      links.push({
        url: serviceLink.url,
        anchor: this.interpolateTemplate(serviceLink.anchor_variations[0], pageData),
        placement: 'conclusion'
      });
    }
    
    // Add cluster content links
    for (const clusterLink of this.config.internalLinkingMap.hub_connections.cluster_content) {
      const clusterUrl = this.interpolateTemplate(clusterLink.url, {
        location_slug: pageData.locationSlug
      });
      links.push({
        url: clusterUrl,
        anchor: this.interpolateTemplate(clusterLink.anchor_text, pageData),
        placement: 'content'
      });
    }
    
    return links;
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