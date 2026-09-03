// Generates deterministic, location- and industry-specific local SEO service pages.

const LOCATION_PROFILES = {
  Henderson: {
    context: 'a large, established city with distinct residential and commercial districts',
    areas: 'Green Valley, Water Street, Anthem, Inspirada, and nearby Henderson neighborhoods',
    angle: 'Clear service-area pages help searchers distinguish a Henderson provider from businesses based elsewhere in the valley.',
    landmarks: 'the Water Street District, The District at Green Valley Ranch, Lake Las Vegas, and the M Resort corridor',
    demographic: 'Nevada\'s second-largest city, with a mix of long-tenured homeowners, master-planned communities, and a growing professional workforce',
    zips: '89002, 89011, 89012, 89014, 89015, 89052, and 89074',
    access: 'the US-95 and I-215 Beltway interchanges that connect Henderson to the wider valley'
  },
  Summerlin: {
    context: 'a master-planned community where neighborhood relevance and a polished online presence matter',
    areas: 'Summerlin North, Summerlin South, Downtown Summerlin, The Trails, and The Vistas',
    angle: 'Customers often compare several well-presented businesses, so accurate profiles and convincing local proof are especially important.',
    landmarks: 'Downtown Summerlin, Red Rock Casino, City National Arena, and the Red Rock Canyon gateway',
    demographic: 'an affluent, design-conscious community where residents research thoroughly and expect a polished, professional presentation',
    zips: '89117, 89134, 89135, 89138, and 89144',
    access: 'the CC-215 Beltway and Charleston/Sahara corridors along the western valley edge'
  },
  'North Las Vegas': {
    context: 'a fast-changing city with established neighborhoods, new housing, and active commercial corridors',
    areas: 'Aliante, Craig Ranch, North Ranch, and neighborhoods near the Civic Center',
    angle: 'A precise North Las Vegas service footprint prevents the business from being lost among broader Las Vegas results.',
    landmarks: 'Aliante Casino, Craig Ranch Regional Park, the North Las Vegas Airport, and the Apex Industrial corridor',
    demographic: 'one of the fastest-growing cities in Nevada, with new family housing, young households, and expanding industrial employment',
    zips: '89030, 89031, 89032, 89081, 89084, and 89085',
    access: 'the I-15, US-95, and CC-215 routes serving the northern valley'
  },
  Paradise: {
    context: 'an unincorporated community that includes dense residential areas and major visitor corridors',
    areas: 'the University District, neighborhoods east and south of the Strip, and the airport corridor',
    angle: 'Using Paradise-specific language alongside familiar nearby landmarks clarifies relevance for residents and visitors.',
    landmarks: 'UNLV, Harry Reid International Airport, the Las Vegas Strip resort corridor, and the Thomas & Mack Center',
    demographic: 'a dense, diverse mix of long-term residents, students, hospitality workers, and a steady visitor population',
    zips: '89109, 89119, 89120, 89121, 89123, and 89169',
    access: 'Paradise Road, Tropicana Avenue, and the I-15/I-215 connections near the airport'
  },
  'Spring Valley': {
    context: 'a diverse residential and commercial area west of central Las Vegas',
    areas: 'Chinatown, Rainbow Boulevard, Flamingo Road, and surrounding Spring Valley neighborhoods',
    angle: 'Strong neighborhood signals help businesses compete with both central Las Vegas and Summerlin results.',
    landmarks: 'the Las Vegas Chinatown corridor on Spring Mountain Road, the Rainbow and Flamingo commercial districts, and the 215 Beltway retail centers',
    demographic: 'one of the most culturally diverse parts of the valley, with a large multilingual population and dense small-business activity',
    zips: '89102, 89103, 89117, 89118, 89146, and 89147',
    access: 'Spring Mountain Road, Rainbow Boulevard, and the CC-215 western Beltway'
  },
  Enterprise: {
    context: 'a growing southwest valley community with new development and busy mixed-use corridors',
    areas: 'Southern Highlands, Mountains Edge, Silverado Ranch, and the southwest valley',
    angle: 'Search pages should reflect the southwest valley rather than relying on generic Las Vegas wording.',
    landmarks: 'the IKEA and Town Square retail hubs, Southern Highlands, Mountains Edge, and the St. Rose Parkway medical corridor',
    demographic: 'one of the largest and fastest-growing communities in the valley, dominated by newer homes and young, higher-income households',
    zips: '89044, 89118, 89123, 89139, 89141, 89178, and 89183',
    access: 'the I-15, St. Rose Parkway, and CC-215 southern Beltway'
  },
  'Sunrise Manor': {
    context: 'an east-valley community with long-established neighborhoods and a broad local service area',
    areas: 'Sunrise Mountain, East Las Vegas, Nellis-area neighborhoods, and the eastern valley',
    angle: 'Consistent east-valley location details make it easier for nearby customers to recognize a genuinely relevant provider.',
    landmarks: 'Sunrise Mountain, Nellis Air Force Base, the Boulder Highway corridor, and Sunrise Hospital nearby',
    demographic: 'a large, established, family-oriented and heavily bilingual community with strong ties to the eastern valley and Nellis',
    zips: '89101, 89104, 89110, 89115, 89122, and 89142',
    access: 'Nellis Boulevard, Lake Mead Boulevard, and Boulder Highway'
  },
  'Centennial Hills': {
    context: 'a northwest Las Vegas community with growing residential and retail districts',
    areas: 'Centennial Center, Providence, Skye Canyon, Tule Springs, and the northwest valley',
    angle: 'Northwest-specific service information separates a local result from businesses focused on the Strip or southeast valley.',
    landmarks: 'the Centennial Center shopping district, Skye Canyon Park, Tule Springs Fossil Beds, and the US-95 northwest corridor',
    demographic: 'a newer, family-heavy suburb of master-planned neighborhoods with strong homeownership and steady residential growth',
    zips: '89131, 89143, 89149, 89166, and parts of 89129',
    access: 'US-95, the CC-215 Beltway, and Durango Drive'
  },
  'Green Valley': {
    context: 'an established Henderson-area community with mature neighborhoods and active retail centers',
    areas: 'Green Valley North, Green Valley South, Green Valley Ranch, and nearby Henderson neighborhoods',
    angle: 'Pages should make the relationship between Green Valley and Henderson clear without treating the entire valley as one market.',
    landmarks: 'The District at Green Valley Ranch, Green Valley Ranch Resort, the Henderson Pavilion, and the Sunset Road retail corridor',
    demographic: 'a mature, upper-middle-income Henderson community with settled families, established homes, and loyal repeat customers',
    zips: '89012, 89014, 89052, and 89074',
    access: 'the I-215 Beltway, Sunset Road, and Green Valley Parkway'
  }
};

const INDUSTRY_PROFILES = {
  dentists: {
    singular: 'dental practice', customers: 'patients', category: 'healthcare',
    priorities: ['preventive and family dentistry', 'emergency appointments', 'insurance and payment information'],
    content: ['what to expect at a first visit', 'guidance for dental emergencies', 'answers about insurance and financing'],
    conversions: 'appointment requests and calls', trust: 'credentials, treatment details, accessibility information, and patient feedback',
    seasonal: 'end-of-year benefit deadlines and back-to-school checkups drive predictable demand spikes for dental offices',
    searchExamples: ['"dentist near me"', '"emergency dentist open now"', '"family dentist accepting new patients"'],
    challenge: 'competing with insurance-network directories and large dental chains for high-intent local searches'
  },
  'real estate agents': {
    singular: 'real estate business', customers: 'buyers and sellers', category: 'real estate',
    priorities: ['neighborhood expertise', 'home buying guidance', 'listing and valuation services'],
    content: ['neighborhood comparisons', 'local buying and selling checklists', 'plain-language market updates'],
    conversions: 'consultation requests, listing inquiries, and calls', trust: 'licensing, recent local experience, clear processes, and client feedback',
    seasonal: 'spring and early-summer listing activity, plus year-round relocation demand from out-of-state movers',
    searchExamples: ['"homes for sale near me"', '"real estate agent"', '"what is my home worth"'],
    challenge: 'standing out against Zillow, Redfin, and national portals that dominate broad property searches'
  },
  plumbers: {
    singular: 'plumbing company', customers: 'homeowners and property managers', category: 'home services',
    priorities: ['emergency plumbing', 'water-heater service', 'leak and drain repair'],
    content: ['steps to take during a leak', 'water-heater maintenance advice', 'local plumbing problem guides'],
    conversions: 'service calls and estimate requests', trust: 'licensing, service availability, warranties, and customer feedback',
    seasonal: 'hard-water scale buildup and summer irrigation strain create year-round demand unique to the desert',
    searchExamples: ['"emergency plumber near me"', '"water heater repair"', '"drain cleaning"'],
    challenge: 'winning urgent "open now" searches where response time and reviews decide the call'
  },
  lawyers: {
    singular: 'law firm', customers: 'prospective clients', category: 'legal services',
    priorities: ['specific practice areas', 'consultation availability', 'Nevada legal experience'],
    content: ['plain-language answers to common legal questions', 'consultation preparation checklists', 'Nevada-specific process guides'],
    conversions: 'qualified consultation requests and calls', trust: 'attorney credentials, practice focus, transparent intake information, and appropriate client feedback',
    seasonal: 'steady year-round demand driven by life events rather than seasons, with high competition on paid search',
    searchExamples: ['"attorney near me"', '"free consultation lawyer"', '"Nevada [practice area] attorney"'],
    challenge: 'competing in one of the most expensive paid-search verticals, where organic local visibility is a major advantage'
  },
  'HVAC contractors': {
    singular: 'HVAC company', customers: 'homeowners and property managers', category: 'home services',
    priorities: ['air-conditioning repair', 'seasonal maintenance', 'system replacement'],
    content: ['AC troubleshooting basics', 'desert-climate maintenance checklists', 'repair-versus-replacement guidance'],
    conversions: 'service calls and estimate requests', trust: 'licensing, response times, equipment expertise, warranties, and customer feedback',
    seasonal: 'extreme summer heat routinely above 105°F makes AC failures urgent, concentrating demand from May through September',
    searchExamples: ['"AC repair near me"', '"air conditioning not working"', '"HVAC replacement quote"'],
    challenge: 'capturing a huge summer demand surge when customers call the first available, well-reviewed local company'
  },
  electricians: {
    singular: 'electrical contractor', customers: 'homeowners and businesses', category: 'home services',
    priorities: ['electrical repairs', 'panel and wiring work', 'inspection and installation services'],
    content: ['electrical safety warning signs', 'panel upgrade guidance', 'project planning checklists'],
    conversions: 'service calls and quote requests', trust: 'licensing, safety practices, project scope, warranties, and customer feedback',
    seasonal: 'summer AC loads and EV-charger and solar installs drive panel-upgrade demand across newer valley homes',
    searchExamples: ['"electrician near me"', '"panel upgrade cost"', '"EV charger installation"'],
    challenge: 'earning trust for safety-critical work where credentials and reviews strongly influence the choice'
  },
  restaurants: {
    singular: 'restaurant', customers: 'diners', category: 'hospitality',
    priorities: ['cuisine and menu details', 'hours and reservations', 'takeout and delivery options'],
    content: ['signature dish features', 'menu and dietary guides', 'event and seasonal updates'],
    conversions: 'reservations, calls, direction requests, and online orders', trust: 'current menus, accurate hours, food photography, accessibility details, and diner feedback',
    seasonal: 'convention calendars, tourism swings, and weekend locals demand create sharp peaks and slow midweek periods',
    searchExamples: ['"restaurants near me"', '"[cuisine] near me"', '"best takeout open now"'],
    challenge: 'winning map-pack visibility and photo-driven clicks against dense local competition and delivery apps'
  },
  'roofing companies': {
    singular: 'roofing company', customers: 'homeowners and property managers', category: 'home services',
    priorities: ['roof inspections', 'leak repair', 'replacement and coating options'],
    content: ['storm and leak checklists', 'roof material comparisons', 'desert-weather maintenance guidance'],
    conversions: 'inspection bookings and estimate requests', trust: 'licensing, material expertise, warranties, project photos, and customer feedback',
    seasonal: 'intense UV, monsoon-season storms, and heat-cracked tile and flat roofs drive spikes in repair demand',
    searchExamples: ['"roof repair near me"', '"roof leak"', '"roof replacement estimate"'],
    challenge: 'establishing credibility for a high-cost, infrequent purchase where reviews and project photos are decisive'
  },
  'medical spas': {
    singular: 'medical spa', customers: 'prospective patients', category: 'aesthetic services',
    priorities: ['treatment options', 'provider qualifications', 'consultation and aftercare information'],
    content: ['treatment comparison guides', 'consultation preparation', 'realistic recovery and aftercare information'],
    conversions: 'consultation and appointment requests', trust: 'provider credentials, candidacy guidance, safety information, and authentic patient feedback',
    seasonal: 'pre-event, wedding, and pre-summer preparation drives demand, with a strong influence from social media and visuals',
    searchExamples: ['"med spa near me"', '"Botox"', '"laser treatment cost"'],
    challenge: 'building trust for elective aesthetic procedures where before/after proof and credentials drive bookings'
  },
  'fitness centers': {
    singular: 'fitness center', customers: 'prospective members', category: 'fitness',
    priorities: ['memberships and day passes', 'classes and coaching', 'hours and amenities'],
    content: ['beginner training guides', 'class and program explanations', 'facility and coach introductions'],
    conversions: 'tour bookings, trial requests, calls, and memberships', trust: 'coach qualifications, current schedules, facility photos, pricing clarity, and member feedback',
    seasonal: 'a strong New Year and pre-summer signup surge, plus indoor demand during extreme-heat months',
    searchExamples: ['"gym near me"', '"personal trainer"', '"fitness classes near me"'],
    challenge: 'converting price-comparison shoppers who evaluate several nearby gyms before committing'
  },
  'auto repair shops': {
    singular: 'auto repair shop', customers: 'drivers', category: 'automotive services',
    priorities: ['diagnostics and repairs', 'routine maintenance', 'vehicle and warranty expertise'],
    content: ['dashboard warning-light guides', 'maintenance schedules', 'repair process and estimate explanations'],
    conversions: 'appointment requests and calls', trust: 'technician credentials, supported vehicles, warranty information, transparent estimates, and customer feedback',
    seasonal: 'summer heat stresses batteries, cooling systems, and AC, concentrating repair demand in the hottest months',
    searchExamples: ['"auto repair near me"', '"mechanic near me"', '"check engine light diagnostic"'],
    challenge: 'earning trust from drivers wary of overcharging, where transparency and reviews win the appointment'
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
          id: 'local-snapshot',
          h2: `The ${location} Market for ${businessType}`,
          content: `<p>${location} is ${place.demographic}. For a ${industry.singular} serving this area, that profile shapes who searches, what they expect, and how they choose. Nearby reference points such as ${place.landmarks} help both customers and search engines confirm that a business genuinely operates here rather than somewhere else in the valley.</p><p>Demand in this category is shaped by a local reality: ${industry.seasonal}. A ${industry.singular} that plans its content, hours, and profile around that pattern captures more of the ${industry.customers} who are actively searching. Coverage typically spans ${place.areas}, reachable via ${place.access}, across ZIP codes like ${place.zips}.</p><p>The main obstacle in this market is ${industry.challenge}. The sections below explain how to overcome it with accurate listings, useful content, and honest proof—no fabricated locations, reviews, or ratings.</p>`
        },

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
      faq: this.generateFaq(pageData),
      conclusion: `<div class="conclusion-section"><h2>Plan Your ${location} Local SEO Campaign</h2><p>A durable campaign for ${businessTypeLower} combines accurate business data, useful service content, authentic reputation signals, and conversion measurement. NSM Prime can audit the current search presence, identify gaps, and prioritize work based on the services and areas that matter to the business.</p></div>`
    };
  }

  generateFaq(pageData) {
    const { location, businessType, businessTypeLower, locationProfile: place, industryProfile: industry } = pageData;
    return [
      {
        q: `How do ${businessTypeLower} in ${location} show up in Google's local results?`,
        a: `Local visibility for a ${industry.singular} in ${location} comes from three things working together: a complete, accurate Google Business Profile; consistent name, address, and phone details across the web; and genuinely useful content about ${industry.priorities.join(', ')}. Referencing real ${location} areas such as ${place.areas} helps confirm relevance for nearby ${industry.customers}.`
      },
      {
        q: `What makes local SEO for ${businessTypeLower} in ${location} different from other areas?`,
        a: `Two factors stand out. First, ${place.demographic}, which shapes what ${industry.customers} expect. Second, ${industry.seasonal}. A strategy built around those realities—rather than generic Las Vegas wording—captures more of the searches near ${place.landmarks}.`
      },
      {
        q: `What are people actually searching for when they need ${businessTypeLower} near ${location}?`,
        a: `High-intent queries typically look like ${industry.searchExamples.join(', ')}. These searches lead to ${industry.conversions}. The biggest challenge is ${industry.challenge}, which is exactly what a focused local SEO plan is designed to overcome.`
      }
    ];
  }

  generateSchema(pageData) {
    const title = `Local SEO for ${pageData.businessType} in ${pageData.location}`;
    const description = `Local SEO strategy for ${pageData.businessTypeLower} in ${pageData.location}, Nevada. Improve local visibility with accurate listings, useful content, reviews, and conversion tracking.`;
    const faq = this.generateFaq(pageData);
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: title,
          description,
          url: `https://nsmprime.com${pageData.url}`,
          serviceType: 'Local search engine optimization',
          provider: { '@type': 'Organization', name: 'NSM Prime Media Group', url: 'https://nsmprime.com/' },
          areaServed: { '@type': 'Place', name: `${pageData.location}, Nevada` },
          audience: { '@type': 'BusinessAudience', audienceType: pageData.businessType }
        },
        {
          '@type': 'FAQPage',
          mainEntity: faq.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a }
          }))
        }
      ]
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
