#!/usr/bin/env node

/**
 * NSM Prime Blog Content Engine
 * -----------------------------------------------------------------------------
 * Generates genuinely UNIQUE, substantive, Las Vegas–specific articles.
 *
 * Design principles (mirrors the successful local-page rebuild):
 *   1. Real, hand-written content per topic — NO swappable boilerplate.
 *   2. Internal links to money pages + local service pages (SEO authority flow).
 *   3. Honest metadata — no fabricated views/likes/shares, no fake author personas.
 *   4. Deduped by slug so re-running never creates duplicate posts.
 *   5. Accurate reading time computed from real word count.
 *
 * Author is the real NSM Prime editorial entity (not stock-photo personas).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_PATH = path.join(__dirname, 'data/posts.json');
// The Next.js blog renders from public/data/posts.json, so we keep both in sync.
const PUBLIC_DATA_PATH = path.join(__dirname, 'public/data/posts.json');

const AUTHOR = {
  name: 'NSM Prime Editorial Team',
  avatar: '/images/logo-default-216x80.png',
  bio: 'The NSM Prime Editorial Team is the in-house content group at NSM Prime Media Group, a Las Vegas digital marketing agency founded in 2017. We publish practical, jargon-free guidance on SEO, web development, and local marketing for Las Vegas valley businesses.'
};

// Helper: turn a string into an <a> internal link (rendered as HTML in content).
const link = (url, text) => `<a href="${url}">${text}</a>`;

// Shared internal-link snippets reused across articles.
const L = {
  seo: () => link('/seo-services-las-vegas.html', 'Las Vegas SEO services'),
  ecom: () => link('/ecommerce-las-vegas/', 'e-commerce development in Las Vegas'),
  areas: () => link('/local-service-areas.html', 'local service areas'),
  guide: () => link('/local-seo-las-vegas-guide.html', 'Las Vegas local SEO guide'),
  web: () => link('/web-development.html', 'web development'),
  ppc: () => link('/sponsered-ads.html', 'Google Ads management'),
  contact: () => link('/contacts.html', 'contact us for a free audit'),
  services: () => link('/services.html', 'full range of services')
};

/**
 * ARTICLE LIBRARY
 * Each entry is a complete, unique article. `body` is Markdown-ish with inline
 * HTML links (the blog renderer supports both). Keep each article factual and
 * genuinely useful — this is what earns rankings and AI citations.
 */
const ARTICLES = [
  {
    title: 'How Much Does SEO Cost in Las Vegas? A Transparent 2026 Guide',
    slug: 'how-much-does-seo-cost-in-las-vegas',
    category: 'SEO',
    excerpt: 'A straight-talking breakdown of what local SEO actually costs in Las Vegas, what drives the price, and how to tell a fair quote from an overpriced one.',
    tags: ['SEO', 'Las Vegas Business', 'SEO Pricing', 'Local SEO', 'Marketing Budget'],
    body: () => `One of the first questions Las Vegas business owners ask us is simple: "What does SEO actually cost?" The honest answer is that it depends — but you deserve to understand *what* it depends on, so you can spot a fair quote from an inflated one.

## What you're actually paying for

SEO isn't a single product. When you pay for ${L.seo()}, you're paying for a mix of the following work, in rough order of ongoing effort:

- **Technical fixes** — making sure Google can crawl, index, and understand your site (site speed, mobile usability, structured data).
- **On-page optimization** — titles, headings, content, and internal links tuned for the terms your customers actually search.
- **Local signals** — your Google Business Profile, citations, and consistent name/address/phone across the web.
- **Content** — genuinely useful pages that answer customer questions and earn links.
- **Reporting** — tracking the traffic, calls, and leads that tie back to real revenue.

## Typical Las Vegas price ranges

Pricing in a competitive market like Las Vegas generally falls into a few tiers. These are industry ranges, not a specific NSM Prime quote:

- **DIY / tools only** — $0–$100/month. Fine for learning, but your time is the real cost.
- **Freelancer / part-time** — roughly $500–$1,500/month. Variable quality; good for very small, low-competition niches.
- **Established local agency** — roughly $1,500–$5,000/month. Full-service strategy, content, and reporting.
- **Enterprise / national competition** — $5,000+/month for highly contested terms.

## What drives your specific price

Two Las Vegas businesses rarely pay the same. The biggest factors:

1. **Competition for your keywords.** Ranking a ${link('/local-seo-henderson-dentists.html', 'Henderson dental practice')} is a different challenge than a niche B2B service with few competitors.
2. **Your starting point.** A brand-new site needs more foundational work than one with existing authority.
3. **Your service area.** Targeting all nine valley communities (see our ${L.areas()}) is more work than a single neighborhood.
4. **Content needs.** If your site is thin, content becomes the biggest line item — and the biggest driver of results.

## Red flags in a Las Vegas SEO quote

- **Guaranteed #1 rankings.** No ethical provider can guarantee this. Google explicitly warns against anyone who does.
- **Suspiciously cheap "500 backlinks."** Cheap bulk links get sites penalized, not ranked.
- **No reporting.** If you can't see the traffic and leads, you can't know it's working.

## The bottom line

Think of SEO as an investment measured against the value of a new customer. If a single new client is worth a few thousand dollars to your business, even a mid-tier local campaign can pay for itself with a handful of leads. Start with a clear audit of where you stand — ${L.contact()} and we'll show you exactly what your site needs before you spend a dollar.`
  },
  {
    title: 'Why Your Las Vegas Website Isn\'t Ranking (and How to Fix It)',
    slug: 'why-your-las-vegas-website-isnt-ranking',
    category: 'SEO',
    excerpt: 'Ten common reasons Las Vegas business websites stay stuck on page two — and the practical fixes that move them up.',
    tags: ['SEO', 'Google Rankings', 'Las Vegas Business', 'Technical SEO', 'Local SEO'],
    body: () => `You built a website, maybe even paid for it, and yet it's nowhere to be found on Google. This is the single most common frustration we hear from Las Vegas business owners. Here are the real reasons it happens — and how to fix each one.

## 1. Google can't tell where you're located

If your site never clearly states your service area, Google has no reason to show you for "near me" searches. Fix it by adding your city and neighborhoods naturally in your content, footer, and page titles — the way our ${L.guide()} lays out.

## 2. Your Google Business Profile is incomplete

For local searches, your Google Business Profile often matters more than your website. An unclaimed or half-finished profile is the #1 reason businesses miss the local map pack. Claim it, choose accurate categories, and keep your hours and phone number current.

## 3. Your site is too slow

Google uses page speed as a ranking factor, and Las Vegas users on mobile bounce fast. If your site takes more than a few seconds to load, that's costing you rankings and leads. A focused ${L.web()} pass on image sizes and render-blocking code usually delivers quick wins.

## 4. Thin or duplicate content

If every page says roughly the same thing, Google has nothing distinctive to rank. Each important page needs genuinely unique, useful content — real answers to real customer questions, not filler.

## 5. You're targeting the wrong keywords

Ranking for "marketing" is nearly impossible. Ranking for "emergency plumber in Spring Valley" is very achievable. Specific, local, intent-driven terms convert better and are easier to win.

## 6. No internal linking

Orphaned pages that nothing links to rarely rank. Connect related pages together so Google (and visitors) can find them — the way our ${L.areas()} hub links out to every neighborhood page.

## 7. Missing or broken structured data

Schema markup helps Google understand your business, services, and FAQs — and makes you eligible for rich results. Missing it isn't fatal, but adding it is a low-effort advantage.

## 8. No reviews (or no responses)

Reviews are a major local ranking signal. A steady flow of genuine reviews — and thoughtful replies — tells Google your business is active and trusted.

## 9. Your competitors are simply doing more

Sometimes the site is fine; the competition is just further ahead. Closing that gap takes consistent content and local authority-building over months, not days.

## 10. Google doesn't know the pages exist

If your sitemap isn't submitted in Google Search Console, new pages can take a long time to be discovered. Submitting it is free and takes five minutes.

## Where to start

Don't try to fix all ten at once. Start with the highest-impact items: Google Business Profile, site speed, and local content. If you'd like a prioritized list specific to your site, ${L.contact()}.`
  },
  {
    title: 'Google Business Profile Optimization for Las Vegas Businesses',
    slug: 'google-business-profile-optimization-las-vegas',
    category: 'Local SEO',
    excerpt: 'A step-by-step guide to setting up and optimizing your Google Business Profile so your Las Vegas business shows up in the local map pack.',
    tags: ['Local SEO', 'Google My Business', 'Google Business Profile', 'Las Vegas', 'Local Search'],
    body: () => `For local businesses, your Google Business Profile (formerly Google My Business) is often more powerful than your website. It's what puts you in the "map pack" — the top three map results that capture the majority of local clicks and calls. Here's how to get it right in Las Vegas.

## Step 1: Claim and verify

Search your business name on Google. If a profile exists, claim it; if not, create one at business.google.com. Verification is usually by video or postcard — until it's done, you won't appear on the map, so don't skip it.

## Step 2: Choose the right categories

Your **primary category** is one of the strongest ranking factors. Be specific: "Marketing agency," "Dental clinic," "Plumber," rather than something vague. Add relevant secondary categories too. This is exactly the kind of specificity we build into every page across our ${L.areas()}.

## Step 3: Nail your NAP consistency

Your Name, Address, and Phone number must match *exactly* everywhere they appear online — your website, Yelp, directories, and social profiles. Inconsistent details confuse Google and dilute your local authority.

## Step 4: Set your service area

If you serve customers at their location rather than yours (like most contractors and agencies), set a service-area business and list the communities you cover — Henderson, Summerlin, North Las Vegas, and the rest of the valley.

## Step 5: Add real photos

Profiles with genuine photos get significantly more clicks and direction requests. Add your logo, a cover image, and real photos of your team, work, or storefront. Refresh them monthly — Google favors active profiles.

## Step 6: Build a review engine

Reviews are the top driver of map-pack rankings. Get your review link from your profile and send it to happy customers. Aim for a steady, natural flow — a few per month beats twenty at once. Reply to every review, positive or negative; it's both a ranking signal and a trust signal. Never buy reviews.

## Step 7: Post weekly updates

Google Posts let you share offers, tips, and news directly on your profile. Weekly posts keep your profile active and give customers a reason to choose you.

## Step 8: Fill out everything else

Services, hours (including holiday hours), attributes, a keyword-natural business description, and your website link. A 100% complete profile simply outranks a half-finished one.

## Tie it back to your website

Your profile and website should reinforce each other. When your ${L.seo()} and your Google Business Profile tell the same consistent story about who you are and where you work, your local visibility compounds. Need help auditing yours? ${L.contact()}.`
  },
  {
    title: 'Google Ads vs SEO for Las Vegas Businesses: Where to Put Your Budget',
    slug: 'google-ads-vs-seo-las-vegas',
    category: 'PPC Advertising',
    excerpt: 'A practical comparison of paid search and SEO for Las Vegas businesses — when each makes sense, and how to combine them.',
    tags: ['PPC', 'Google Ads', 'SEO', 'Marketing Strategy', 'Las Vegas Business'],
    body: () => `Should you invest in Google Ads or SEO? It's the wrong question. The right question is *when* to use each, and how to combine them. Here's how we think about it for Las Vegas businesses.

## The core difference

- **Google Ads (PPC)** is like renting the top of the search results. You pay per click, and the moment you stop paying, the traffic stops. But it turns on instantly.
- **SEO** is like owning your position. It takes months to build, but the traffic keeps coming without paying per click. It compounds over time.

## When Google Ads makes sense

- **You need leads *now*.** A new business or a slow season can't wait six months for SEO to mature.
- **You're testing.** Ads reveal which keywords actually convert, which then informs your SEO strategy.
- **High-value, time-sensitive services.** Emergency plumbers, HVAC in a Las Vegas summer, or a limited-time offer benefit from instant visibility. Our ${L.ppc()} focuses on exactly these high-intent moments.

## When SEO makes sense

- **You want sustainable cost-per-lead.** Over time, organic traffic is dramatically cheaper than paying per click.
- **You're building a brand.** Ranking organically builds trust that ads alone don't.
- **Your customers research before buying.** Informational content captures them early — the whole premise behind our ${L.guide()}.

## The Las Vegas reality: cost

Las Vegas is competitive. In verticals like legal, cosmetic, and home services, a single ad click can cost a lot. That's exactly why a strong organic presence matters — it reduces your dependence on ever-rising ad costs.

## The smart play: use both

The businesses that win combine the two:

1. **Start with Ads** to generate immediate leads and learn which keywords convert.
2. **Build SEO** in parallel, targeting those proven keywords for long-term, lower-cost traffic.
3. **Shift budget** toward organic as your rankings mature, keeping ads for high-intent and seasonal pushes.

## What ties them together

Both channels send traffic to your website — so your site has to convert. Fast load times, clear calls to action, and trust signals matter regardless of the channel. If you're not sure where your budget is best spent right now, ${L.contact()} and we'll map it to your specific goals and margins.`
  },
  {
    title: 'How to Get More Google Reviews for Your Las Vegas Business',
    slug: 'how-to-get-more-google-reviews-las-vegas',
    category: 'Local SEO',
    excerpt: 'Ethical, practical ways to earn a steady stream of genuine Google reviews that boost your Las Vegas local rankings.',
    tags: ['Local SEO', 'Google Reviews', 'Reputation Management', 'Las Vegas', 'Customer Trust'],
    body: () => `Reviews are one of the strongest local ranking signals — and one of the biggest factors in whether a customer chooses you. Here's how to earn more of them the right way, without ever buying fake ones (which gets you penalized).

## Why reviews matter so much in Las Vegas

In a crowded market, the business with more recent, higher-quality reviews usually wins the click. Reviews influence your map-pack ranking *and* your conversion rate. They're also increasingly cited by AI assistants when recommending local businesses.

## 1. Just ask — at the right moment

The single biggest reason businesses don't get reviews is that they don't ask. Ask right after a successful outcome, when satisfaction is highest: after a completed job, a great meal, or a positive result.

## 2. Make it effortless

Get your short review link from your Google Business Profile and share it directly. The fewer taps between "sure" and a posted review, the more you'll get. Add it to:

- A follow-up text or email
- Your email signature
- A small card or QR code at checkout

## 3. Build it into your process

Don't rely on remembering. Add "send review request" as a step in your job-completion or checkout workflow so it happens every time.

## 4. Respond to every review

Reply to positives with genuine thanks, and to negatives calmly and professionally. Google rewards active profiles, and prospective customers read your responses as closely as the reviews themselves.

## 5. Never incentivize or fake reviews

Offering payment or discounts for reviews violates Google's policies, and fake reviews can get your profile suspended. Authenticity is not just ethical — it's the only sustainable strategy. This is the same honesty-first approach we apply across every page in our ${L.areas()}.

## 6. Spread requests out

Twenty reviews in one day looks unnatural. A steady flow of a few per week signals a genuinely active business and builds momentum over time.

## Turn reviews into rankings

Reviews work best as part of a complete local strategy — alongside an optimized Google Business Profile and consistent local content. If you want a plan to build a review engine that feeds your rankings, explore our ${L.seo()} or ${L.contact()}.`
  },
  {
    title: 'Web Design That Converts: Turning Las Vegas Traffic Into Leads',
    slug: 'web-design-that-converts-las-vegas',
    category: 'Web Development',
    excerpt: 'Getting visitors is only half the battle. Here\'s how to design a Las Vegas business website that actually turns clicks into calls and form fills.',
    tags: ['Web Development', 'Conversion Optimization', 'Web Design', 'Lead Generation', 'Las Vegas'],
    body: () => `You can rank #1 and still fail if your website doesn't convert visitors into customers. Traffic is only valuable when it turns into calls, forms, and sales. Here's what actually moves the needle.

## Speed is a conversion feature, not just a ranking one

Every extra second of load time measurably reduces conversions. Las Vegas customers on mobile won't wait. Lean, fast pages — the kind we build in our ${L.web()} work — keep visitors engaged long enough to act.

## Make the next step obvious

The most common mistake is burying the call to action. Every page should make it obvious what to do next:

- A visible phone number in the header (click-to-call on mobile)
- A clear primary button ("Get a Free Quote," "Book Now")
- A short, low-friction contact form

## Reduce form friction

Every extra field costs you submissions. Ask only for what you truly need — usually name, phone, and a short message. You can gather details later.

## Lead with trust signals

Visitors decide fast whether to trust you. Put your strongest proof near the top and near your forms:

- Genuine reviews and testimonials
- Recognizable client logos or credentials
- Clear, honest guarantees

## Design for mobile first

Most local searches happen on phones. If your buttons are tiny, your text is cramped, or your forms are hard to tap, you're losing the majority of your traffic. Design for the thumb first, the desktop second.

## Match the page to the search

Someone searching "emergency AC repair" wants a phone number and reassurance — not your company history. Landing pages should answer the exact intent behind the search, which is the whole principle behind the pages in our ${L.areas()}.

## Guide the eye

Use whitespace, clear headings, and a logical flow so visitors' eyes land on the important things: your value, your proof, and your call to action. Clutter kills conversions.

## Measure and improve

Track which pages convert and which don't. Small, tested changes — a clearer headline, a repositioned button, a shorter form — compound into meaningfully more leads over time.

## Bring it together

Great design and strong ${L.seo()} work best together: SEO brings the right visitors, and conversion-focused design turns them into customers. Want a candid review of where your site is leaking leads? ${L.contact()}.`
  },
  {
    title: 'E-commerce SEO: Getting Your Las Vegas Online Store Found',
    slug: 'ecommerce-seo-las-vegas-online-store',
    category: 'SEO',
    excerpt: 'How Las Vegas online retailers can rank product and category pages, capture local shoppers, and grow sales through search.',
    tags: ['SEO', 'E-commerce', 'Online Store', 'Product SEO', 'Las Vegas Business'],
    body: () => `Running an online store means competing for attention with thousands of other sites. Good e-commerce SEO is what makes your products findable — and it's very different from optimizing a simple service site. Here's what matters most.

## Product pages are your money pages

Each product page is a ranking opportunity. Give every one:

- A unique, descriptive title and description (never paste the manufacturer's copy — that's duplicate content)
- Clear, keyword-natural headings
- High-quality images with descriptive alt text
- Genuine customer reviews

Our ${L.ecom()} work is built around making each of these pages both rank-worthy and conversion-ready.

## Category pages win the big keywords

Individual products chase specific searches; category pages chase the broader, high-volume terms. Add genuine descriptive content to your category pages so they're more than a bare grid of products.

## Fix the technical basics

E-commerce sites have technical traps that quietly kill rankings:

- **Duplicate content** from filters and sort parameters — use canonical tags.
- **Thin or out-of-stock pages** — handle discontinued products deliberately, don't just leave dead ends.
- **Slow load times** from heavy images and scripts — speed is critical when you have many pages.

## Don't ignore local intent

Even online, "in Las Vegas" and "near me" searches matter — especially for pickup, local delivery, or showroom visits. Combine your store SEO with the local signals described in our ${L.guide()} to capture nearby shoppers.

## Build trust for conversions

Shoppers won't buy from a store they don't trust. Reviews, clear return policies, secure-checkout signals, and real contact information all lift both rankings and sales.

## Structured data for rich results

Product schema can put price, availability, and star ratings directly in the search results — a major click-through advantage over competitors showing plain blue links.

## Start with the highest-value pages

You don't need to optimize a thousand products at once. Start with your best sellers and highest-margin categories, prove the process works, then scale. If you'd like a plan tailored to your catalog, explore our ${L.ecom()} or ${L.contact()}.`
  },
  {
    title: 'AI Search Is Here: How to Show Up in ChatGPT and Google AI Overviews',
    slug: 'ai-search-chatgpt-google-ai-overviews-las-vegas',
    category: 'SEO',
    excerpt: 'AI assistants are becoming a major way customers find businesses. Here\'s how Las Vegas businesses can get cited by ChatGPT, Perplexity, and Google AI Overviews.',
    tags: ['SEO', 'AI Search', 'ChatGPT', 'Generative Engine Optimization', 'Las Vegas'],
    body: () => `Your customers are increasingly asking AI assistants — ChatGPT, Perplexity, Gemini, and Google's AI Overviews — questions like "who's the best marketing agency in Las Vegas?" If your business isn't set up to be understood and cited by these tools, you're invisible in a fast-growing channel. Here's how to fix that.

## How AI search is different

Traditional search returns a list of links. AI search returns a *synthesized answer*, often citing a few sources. The goal shifts from "rank #1" to "be the source the AI quotes." This is sometimes called Generative Engine Optimization (GEO).

## 1. Give clear, quotable answers

AI models favor content that directly and concisely answers a question. Lead important pages with a short, factual summary — a "quick answer" — before the deeper detail. We build exactly these blocks into every page across our ${L.areas()}.

## 2. Ground your business as an entity

AI tools need to understand *who you are*. Consistent structured data (Organization schema), a clear "about" story, and matching details everywhere help models recognize your business as a real, trustworthy entity.

## 3. Add an llms.txt file

A growing standard, llms.txt, tells AI crawlers what your site is about and highlights your key pages — much like a sitemap for language models. It's a simple, forward-looking advantage.

## 4. Keep facts consistent everywhere

AI systems cross-reference sources. If your name, phone, services, and location are identical across your website, Google Business Profile, and directories, models are far more confident citing you. Inconsistency breeds doubt.

## 5. Publish genuinely useful content

AI engines cite content that actually helps. Thin, generic filler gets ignored; specific, factual, well-structured answers get quoted. The same content quality that earns Google rankings earns AI citations — there's no shortcut around being genuinely useful.

## 6. Make sure AI crawlers can access you

AI engines use their own crawlers (GPTBot, PerplexityBot, ClaudeBot, and Google-Extended, among others). Your robots file should explicitly allow the ones you want citing you.

## The overlap with classic SEO

Good news: most of what helps AI search also helps traditional search. Strong ${L.seo()}, clear structure, honest facts, and useful content serve both. AI search rewards the fundamentals — just packaged for machines that summarize rather than list. Want to make your business AI-citable? ${L.contact()}.`
  },
  {
    title: 'Core Web Vitals: Why Site Speed Matters for Las Vegas Rankings',
    slug: 'core-web-vitals-site-speed-las-vegas',
    category: 'Web Development',
    excerpt: 'A plain-English guide to Core Web Vitals — what they measure, why Google cares, and how to make your Las Vegas site faster.',
    tags: ['Web Development', 'Core Web Vitals', 'Site Speed', 'Technical SEO', 'Performance'],
    body: () => `Google measures how fast and stable your website *feels* to real users, and it uses those measurements — called Core Web Vitals — as a ranking factor. For Las Vegas businesses competing on mobile, they're worth understanding. Here's the plain-English version.

## The three metrics that matter

- **Largest Contentful Paint (LCP)** — how quickly the main content appears. Aim for under 2.5 seconds.
- **Interaction to Next Paint (INP)** — how responsive the page feels when someone taps or clicks. Faster is better.
- **Cumulative Layout Shift (CLS)** — how much the page jumps around while loading. You want it stable, not shifting under the user's thumb.

## Why Google cares

Google's goal is to send people to sites that provide a good experience. Slow, janky pages frustrate users and cause them to bounce — so Google is less likely to rank them. In a competitive market, this is an edge you can actually control.

## Why it hits Las Vegas businesses hard

Most local searches happen on phones, often on mobile data. A page that's fine on office wifi can be painfully slow on a phone in a parking lot. That's exactly when a customer is deciding whether to call you or your competitor.

## Practical fixes that move the needle

1. **Compress and size your images.** Oversized images are the #1 speed killer. Serve appropriately sized, modern formats.
2. **Cut render-blocking code.** Large CSS and JavaScript files that load before content delay your LCP. Trimming unused code — as we did across our ${L.areas()} — can dramatically speed up pages.
3. **Reserve space for images and ads.** Setting explicit dimensions prevents the layout shifts that hurt CLS.
4. **Use a good host and caching.** Where and how your site is served affects every metric.
5. **Lazy-load below-the-fold images.** Load what the user sees first; defer the rest.

## Measure before you guess

Use Google's PageSpeed Insights and Search Console's Core Web Vitals report to see real data for your site. Fix the biggest offenders first rather than chasing a perfect score.

## Speed helps more than rankings

Faster pages don't just rank better — they convert better. Every second you shave off load time typically lifts your leads and sales. It's one of the rare improvements that helps SEO and revenue at the same time. If you'd like a speed audit of your site, our ${L.web()} team can help — ${L.contact()}.`
  },
  {
    title: 'Local SEO for Las Vegas Service Businesses: The Complete Playbook',
    slug: 'local-seo-las-vegas-service-businesses-playbook',
    category: 'Local SEO',
    excerpt: 'A start-to-finish local SEO playbook for Las Vegas service businesses — plumbers, HVAC, dentists, lawyers, and more.',
    tags: ['Local SEO', 'Service Business', 'Las Vegas', 'Google Business Profile', 'Local Rankings'],
    body: () => `If you run a service business in Las Vegas — plumbing, HVAC, dental, legal, roofing, and the like — local SEO is the highest-return marketing you can invest in. When someone searches "emergency plumber near me," you want to be the one they call. Here's the complete playbook.

## Step 1: Own your Google Business Profile

This is the foundation. Claim it, verify it, choose a specific primary category, set your service area, and complete every field. For service businesses that travel to customers, set it up as a service-area business and list the communities you cover.

## Step 2: Build neighborhood-specific pages

A single "service areas" page isn't enough to compete. The businesses that dominate build genuinely useful pages for each area and service they offer — like the industry-specific pages across our ${L.areas()}. Each page should speak to that neighborhood's real needs, not just swap in a city name.

## Step 3: Get your NAP consistent everywhere

Your Name, Address, and Phone must be identical across your site, Google, Yelp, Bing, Apple Maps, and industry directories. Inconsistency is a silent killer of local rankings.

## Step 4: Build a review engine

Reviews are a top-three local ranking factor. Ask every satisfied customer, make it a one-tap process, respond to every review, and keep the flow steady and genuine.

## Step 5: Earn local links and citations

Sponsor a local team, join the chamber of commerce, partner with complementary businesses. Real local relationships earn the kind of mentions and links that Google trusts far more than bulk directory submissions.

## Step 6: Create helpful local content

Answer the questions your customers actually ask: "How much does AC repair cost in Las Vegas?" "What to do during a plumbing emergency." Useful content builds authority and captures searchers early. Our ${L.guide()} is a model for this.

## Step 7: Nail the technical basics

Fast load times, mobile-friendly design, and clean structured data ensure Google can serve your pages confidently. Speed matters especially for the on-the-go mobile searches service businesses depend on.

## Step 8: Track leads, not just rankings

Rankings are a means, not the goal. Track the calls, form fills, and booked jobs that actually tie to revenue, so you know what's working and where to invest more.

## Putting it together

Local SEO isn't one trick — it's a system where profile, pages, reviews, links, and content reinforce each other. Done consistently over a few months, it becomes a durable source of leads that doesn't cost you per click. Explore our ${L.seo()} or ${L.contact()} to get a plan built for your specific service and service area.`
  }
];

/* -------------------------------------------------------------------------- */

function generateId() {
  return crypto.randomBytes(8).toString('hex');
}

function computeReadTime(text) {
  const words = text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 200));
}

function buildPost(article) {
  const body = article.body();
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: body,
    author: AUTHOR,
    publishDate: now,
    modifiedDate: now,
    readTime: computeReadTime(body),
    featuredImage: {
      url: '/images/logo-default-216x80.png',
      alt: `${article.category} guide for Las Vegas businesses by NSM Prime`,
      width: 800,
      height: 450
    },
    tags: article.tags,
    category: article.category,
    isFeatured: false,
    metaTitle: article.title,
    metaDescription: article.excerpt
    // NOTE: intentionally no fabricated views/likes/shares.
  };
}

function loadData() {
  try {
    if (!fs.existsSync(DATA_PATH)) return { posts: [] };
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (e) {
    console.error('Error loading posts:', e);
    return { posts: [] };
  }
}

function saveData(data) {
  const json = JSON.stringify(data, null, 2);
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, json);
  // Keep the public copy (read by the Next.js blog) in sync.
  fs.mkdirSync(path.dirname(PUBLIC_DATA_PATH), { recursive: true });
  fs.writeFileSync(PUBLIC_DATA_PATH, json);
}

/**
 * Publish articles that aren't already present (deduped by slug).
 * @param {number|null} limit  Max new articles to add this run (null = all).
 */
function publish(limit = null) {
  const data = loadData();
  const existingSlugs = new Set((data.posts || []).map(p => p.slug));
  const pending = ARTICLES.filter(a => !existingSlugs.has(a.slug));
  const toAdd = limit ? pending.slice(0, limit) : pending;

  if (toAdd.length === 0) {
    console.log('✅ No new articles to publish — all library articles already exist.');
    return data.posts;
  }

  toAdd.forEach(article => {
    const post = buildPost(article);
    data.posts.unshift(post);
    console.log(`📝 Published: "${post.title}" (${post.readTime} min read)`);
  });

  data.posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  saveData(data);
  console.log(`\n✅ Added ${toAdd.length} article(s). Total posts: ${data.posts.length}`);
  return data.posts;
}

function list() {
  console.log(`📚 Content library (${ARTICLES.length} articles):`);
  const existing = new Set((loadData().posts || []).map(p => p.slug));
  ARTICLES.forEach((a, i) => {
    console.log(`${i + 1}. [${existing.has(a.slug) ? 'published' : 'pending  '}] ${a.title}`);
  });
}

function main() {
  const [cmd, arg] = process.argv.slice(2);
  switch (cmd) {
    case 'publish':
      publish(arg ? parseInt(arg, 10) : null);
      break;
    case 'list':
      list();
      break;
    default:
      console.log(`
NSM Prime Blog Content Engine

Usage:
  node blog-content-engine.js publish       Publish all pending library articles
  node blog-content-engine.js publish 2     Publish up to 2 new articles
  node blog-content-engine.js list          Show the article library & status
`);
  }
}

if (require.main === module) main();

module.exports = { publish, list, ARTICLES };
