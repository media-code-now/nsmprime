// Generates deterministic, location- and industry-specific local SEO service pages.

const LOCATION_PROFILES = {
  Henderson: {
    context: 'a large, established city with distinct residential and commercial districts',
    areas: 'Green Valley, Water Street, Anthem, Inspirada, and nearby Henderson neighborhoods',
    angle: 'Clear service-area pages help searchers distinguish a Henderson provider from businesses based elsewhere in the valley.'
  },
  Summerlin: {
    context: 'a master-planned community where neighborhood relevance and a polished online presence matter',
    areas: 'Summerlin North, Summerlin South, Downtown Summerlin, The Trails, and The Vistas',
    angle: 'Customers often compare several well-presented businesses, so accurate profiles and convincing local proof are especially important.'
  },
  'North Las Vegas': {
    context: 'a fast-changing city with established neighborhoods, new housing, and active commercial corridors',
    areas: 'Aliante, Craig Ranch, North Ranch, and neighborhoods near the Civic Center',
    angle: 'A precise North Las Vegas service footprint prevents the business from being lost among broader Las Vegas results.'
  },
  Paradise: {
    context: 'an unincorporated community that includes dense residential areas and major visitor corridors',
    areas: 'the University District, neighborhoods east and south of the Strip, and the airport corridor',
    angle: 'Using Paradise-specific language alongside familiar nearby landmarks clarifies relevance for residents and visitors.'
  },
  'Spring Valley': {
    context: 'a diverse residential and commercial area west of central Las Vegas',
    areas: 'Chinatown, Rainbow Boulevard, Flamingo Road, and surrounding Spring Valley neighborhoods',
    angle: 'Strong neighborhood signals help businesses compete with both central Las Vegas and Summerlin results.'
  },
  Enterprise: {
    context: 'a growing southwest valley community with new development and busy mixed-use corridors',
    areas: 'Southern Highlands, Mountains Edge, Silverado Ranch, and the southwest valley',
    angle: 'Search pages should reflect the southwest valley rather than relying on generic Las Vegas wording.'
  },
  'Sunrise Manor': {
    context: 'an east-valley community with long-established neighborhoods and a broad local service area',
    areas: 'Sunrise Mountain, East Las Vegas, Nellis-area neighborhoods, and the eastern valley',
    angle: 'Consistent east-valley location details make it easier for nearby customers to recognize a genuinely relevant provider.'
  },
  'Centennial Hills': {
    context: 'a northwest Las Vegas community with growing residential and retail districts',
    areas: 'Centennial Center, Providence, Skye Canyon, Tule Springs, and the northwest valley',
    angle: 'Northwest-specific service information separates a local result from businesses focused on the Strip or southeast valley.'
  },
  'Green Valley': {
    context: 'an established Henderson-area community with mature neighborhoods and active retail centers',
    areas: 'Green Valley North, Green Valley South, Green Valley Ranch, and nearby Henderson neighborhoods',
    angle: 'Pages should make the relationship between Green Valley and Henderson clear without treating the entire valley as one market.'
  }
};

const INDUSTRY_PROFILES = {
  dentists: {
    singular: 'dental practice', customers: 'patients', category: 'healthcare',
    priorities: ['preventive and family dentistry', 'emergency appointments', 'insurance and payment information'],
    content: ['what to expect at a first visit', 'guidance for dental emergencies', 'answers about insurance and financing'],
    conversions: 'appointment requests and calls', trust: 'credentials, treatment details, accessibility information, and patient feedback'
  },
  'real estate agents': {
    singular: 'real estate business', customers: 'buyers and sellers', category: 'real estate',
    priorities: ['neighborhood expertise', 'home buying guidance', 'listing and valuation services'],
    content: ['neighborhood comparisons', 'local buying and selling checklists', 'plain-language market updates'],
    conversions: 'consultation requests, listing inquiries, and calls', trust: 'licensing, recent local experience, clear processes, and client feedback'
  },
  plumbers: {
    singular: 'plumbing company', customers: 'homeowners and property managers', category: 'home services',
    priorities: ['emergency plumbing', 'water-heater service', 'leak and drain repair'],
    content: ['steps to take during a leak', 'water-heater maintenance advice', 'local plumbing problem guides'],
    conversions: 'service calls and estimate requests', trust: 'licensing, service availability, warranties, and customer feedback'
  },
  lawyers: {
    singular: 'law firm', customers: 'prospective clients', category: 'legal services',
    priorities: ['specific practice areas', 'consultation availability', 'Nevada legal experience'],
    content: ['plain-language answers to common legal questions', 'consultation preparation checklists', 'Nevada-specific process guides'],
    conversions: 'qualified consultation requests and calls', trust: 'attorney credentials, practice focus, transparent intake information, and appropriate client feedback'
  },
  'HVAC contractors': {
    singular: 'HVAC company', customers: 'homeowners and property managers', category: 'home services',
    priorities: ['air-conditioning repair', 'seasonal maintenance', 'system replacement'],
    content: ['AC troubleshooting basics', 'desert-climate maintenance checklists', 'repair-versus-replacement guidance'],
    conversions: 'service calls and estimate requests', trust: 'licensing, response times, equipment expertise, warranties, and customer feedback'
  },
  electricians: {
    singular: 'electrical contractor', customers: 'homeowners and businesses', category: 'home services',
    priorities: ['electrical repairs', 'panel and wiring work', 'inspection and installation services'],
    content: ['electrical safety warning signs', 'panel upgrade guidance', 'project planning checklists'],
    conversions: 'service calls and quote requests', trust: 'licensing, safety practices, project scope, warranties, and customer feedback'
  },
  restaurants: {
    singular: 'restaurant', customers: 'diners', category: 'hospitality',
    priorities: ['cuisine and menu details', 'hours and reservations', 'takeout and delivery options'],
    content: ['signature dish features', 'menu and dietary guides', 'event and seasonal updates'],
    conversions: 'reservations, calls, direction requests, and online orders', trust: 'current menus, accurate hours, food photography, accessibility details, and diner feedback'
  },
  'roofing companies': {
    singular: 'roofing company', customers: 'homeowners and property managers', category: 'home services',
    priorities: ['roof inspections', 'leak repair', 'replacement and coating options'],
    content: ['storm and leak checklists', 'roof material comparisons', 'desert-weather maintenance guidance'],
    conversions: 'inspection bookings and estimate requests', trust: 'licensing, material expertise, warranties, project photos, and customer feedback'
  },
  'medical spas': {
    singular: 'medical spa', customers: 'prospective patients', category: 'aesthetic services',
    priorities: ['treatment options', 'provider qualifications', 'consultation and aftercare information'],
    content: ['treatment comparison guides', 'consultation preparation', 'realistic recovery and aftercare information'],
    conversions: 'consultation and appointment requests', trust: 'provider credentials, candidacy guidance, safety information, and authentic patient feedback'
  },
  'fitness centers': {
    singular: 'fitness center', customers: 'prospective members', category: 'fitness',
    priorities: ['memberships and day passes', 'classes and coaching', 'hours and amenities'],
    content: ['beginner training guides', 'class and program explanations', 'facility and coach introductions'],
    conversions: 'tour bookings, trial requests, calls, and memberships', trust: 'coach qualifications, current schedules, facility photos, pricing clarity, and member feedback'
  },
  'auto repair shops': {
    singular: 'auto repair shop', customers: 'drivers', category: 'automotive services',
    priorities: ['diagnostics and repairs', 'routine maintenance', 'vehicle and warranty expertise'],
    content: ['dashboard warning-light guides', 'maintenance schedules', 'repair process and estimate explanations'],
    conversions: 'appointment requests and calls', trust: 'technician credentials, supported vehicles, warranty information, transparent estimates, and customer feedback'
  }
};

class ProgrammaticSEOGenerator {
  constructor(templateConfig = {}) {
    this.config = templateConfig.programmaticSEOTemplate || {};
  }

  generatePage(location, businessType, industryCategory) {
    const locationProfile = LOCATION_PROFILES[location];
    const industryProfile = INDUSTRY_PROFILES[businessType];
    if (!locationProfile) throw new Error(`Missing location profile: ${location}`);
    if (!industryProfile) throw new Error(`Missing industry profile: ${businessType}`);

    const display = this.titleCase(businessType);
    const slug = `local-seo-${this.createSlug(location)}-${this.createSlug(businessType)}.html`;
    const pageData = {
      location,
      businessType: display,
      businessTypeLower: businessType,
      industryCategory: industryCategory || industryProfile.category,
      locationProfile,
      industryProfile,
      url: `/${slug}`
    };

    const result = {
      ...pageData,
      title: `Local SEO for ${display} in ${location}`,
      metaDescription: `Local SEO strategy for ${businessType} in ${location}, Nevada. Improve local visibility with accurate listings, useful content, reviews, and conversion tracking.`,
      content: this.generateContent(pageData),
      schema: this.generateSchema(pageData),
      internalLinks: this.generateInternalLinks()
    };
    this.assertComplete(result);
    return result;
  }

  generateContent(pageData) {
    const { location, businessType, businessTypeLower, locationProfile: place, industryProfile: industry } = pageData;
    return {
      introHook: `${location} is ${place.context}. For ${businessTypeLower}, visibility depends on more than repeating a city name: customers need accurate service information, credible proof, and an easy next step. This guide outlines a practical local search plan shaped around ${industry.priorities.join(', ')} and the way people evaluate a ${industry.singular}.`,
      mainSections: [
        {
          id: 'local-market-analysis',
          h2: `How Local Search Works for ${businessType} in ${location}`,
          content: `<p>${place.angle}</p><p>A useful service-area strategy should explain where the business works, what it offers, and whether the customer is a good fit. For this market, that means clearly covering ${place.areas}. Those references should appear only where they are accurate and helpful—not as a list of place names added for search engines.</p><p>For ${businessTypeLower}, the highest-value searches commonly center on ${industry.priorities.join(', ')}. Separate, substantive service information can answer those needs while this page provides the local overview.</p>`
        },
        {
          id: 'business-profile',
          h2: `Google Business Profile Priorities for ${location} ${businessType}`,
          content: `<p>The business name, primary category, address or legitimate service area, phone number, and opening hours should match the real-world business and its website. Never create a location, suite number, or phone number solely for a landing page.</p><p>A strong profile for a ${industry.singular} should make ${industry.priorities.join(', ')} easy to understand. Add original photos, keep holiday hours current, link to the most relevant page, and use updates when there is genuinely new information for ${location} customers.</p>`
        },
        {
          id: 'local-authority',
          h2: `Building Accurate Local Authority in ${location}`,
          content: `<p>Directory listings help when they confirm real business information. Prioritize major map platforms, relevant ${industry.category} directories, local business organizations, and partners that customers actually use. The same name, contact details, hours, and website URL should appear everywhere.</p><p>Local authority also comes from real relationships. Sponsorships, community work, professional memberships, and locally relevant resources can earn mentions naturally. Avoid bulk directory submissions, invented offices, paid review schemes, and city pages that offer no information beyond swapped keywords.</p>`
        },
        {
          id: 'content-plan',
          h2: `A Useful Content Plan for ${location} ${businessType}`,
          content: `<p>Content should resolve the questions a customer has before contacting the business. Strong starting topics include ${industry.content.join('; ')}. Each resource should reflect the business's actual services, policies, expertise, and examples.</p><p>Local detail belongs where it changes the answer. Information about travel range, seasonal demand, neighborhood access, local regulations, or service availability can make a page genuinely useful. For ${location}, explain coverage across ${place.areas} only when the business truly serves those areas.</p>`
        },
        {
          id: 'reviews-and-trust',
          h2: `Reviews and Trust Signals for ${businessType}`,
          content: `<p>${this.capitalize(industry.customers)} look for ${industry.trust}. Publish only claims that can be verified. Ratings and testimonials should come from real customers, remain attributable where appropriate, and match the source platform.</p><p>Ask for feedback after a completed service or visit without offering incentives for positive sentiment. Respond professionally, protect private information, and use recurring feedback to improve both operations and website answers. Do not reuse a rating or review count across unrelated pages.</p>`
        },
        {
          id: 'measurement',
          h2: `Measuring Local SEO Results in ${location}`,
          content: `<p>Track outcomes tied to the business rather than rankings alone. For this page, useful conversions include ${industry.conversions}. Measure organic landing-page visits, business-profile actions, qualified leads, booked work, and the search queries that led to those outcomes.</p><p>Review performance by service and geography. If a page attracts visits but no qualified inquiries, improve its offer, proof, service detail, or call to action. If the business cannot provide distinct value for a location, consolidate the page instead of keeping thin content online.</p>`
        }
      ],
      benefits: `<div class="benefits-section"><h2>What a Strong ${location} Strategy Should Deliver</h2><ul><li>Clear visibility for ${industry.priorities[0]} and other services the business genuinely provides</li><li>Accurate coverage information for customers in ${place.areas}</li><li>More qualified ${industry.conversions} supported by honest, measurable trust signals</li></ul></div>`,
      conclusion: `<div class="conclusion-section"><h2>Plan Your ${location} Local SEO Campaign</h2><p>A durable campaign for ${businessTypeLower} combines accurate business data, useful service content, authentic reputation signals, and conversion measurement. NSM Prime can audit the current search presence, identify gaps, and prioritize work based on the services and areas that matter to the business.</p></div>`
    };
  }

  generateSchema(pageData) {
    const title = `Local SEO for ${pageData.businessType} in ${pageData.location}`;
    const description = `Local SEO strategy for ${pageData.businessTypeLower} in ${pageData.location}, Nevada. Improve local visibility with accurate listings, useful content, reviews, and conversion tracking.`;
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: title,
      description,
      url: `https://nsmprime.com${pageData.url}`,
      serviceType: 'Local search engine optimization',
      provider: { '@type': 'Organization', name: 'NSM Prime Media Group', url: 'https://nsmprime.com/' },
      areaServed: { '@type': 'Place', name: `${pageData.location}, Nevada` },
      audience: { '@type': 'BusinessAudience', audienceType: pageData.businessType }
    };
  }

  generateInternalLinks() {
    return [
      { url: '/local-seo-las-vegas-guide.html', text: 'Las Vegas Local SEO Guide', rel: 'parent' },
      { url: '/seo-services-las-vegas.html', text: 'SEO Services', rel: 'related' }
    ];
  }

  assertComplete(page) {
    const rendered = JSON.stringify(page);
    if (/{{[^}]+}}|\bundefined\b|null/i.test(rendered)) throw new Error(`Incomplete generated output for ${page.url}`);
  }

  titleCase(value) {
    const acronyms = new Set(['hvac', 'seo', 'gmb', 'ppc']);
    return String(value).split(' ').map(word => acronyms.has(word.toLowerCase())
      ? word.toUpperCase()
      : word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  createSlug(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  generateBatch(locations, businessTypes) {
    return locations.flatMap(location => businessTypes.map(businessType =>
      this.generatePage(location, businessType, INDUSTRY_PROFILES[businessType]?.category)
    ));
  }
}

module.exports = ProgrammaticSEOGenerator;
