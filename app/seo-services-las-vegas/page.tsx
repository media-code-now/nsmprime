import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEO Services Las Vegas | Expert Search Engine Optimization & Ranking',
  description: 'Professional SEO services in Las Vegas. Increase your organic traffic, improve rankings, and dominate Google. Free SEO audit. Proven results for local businesses.',
  keywords: ['SEO services Las Vegas', 'search engine optimization', 'Las Vegas SEO agency', 'organic traffic', 'Google ranking'],
  alternates: {
    canonical: 'https://nsmprime.com/seo-services-las-vegas',
  },
  openGraph: {
    title: 'Professional SEO Services in Las Vegas | NSM Prime',
    description: 'Increase organic traffic and dominate Google search results with our proven SEO strategies.',
    url: 'https://nsmprime.com/seo-services-las-vegas',
    siteName: 'NSM Prime',
    type: 'website',
  },
};

const PRIMARY = '#80deea';
const DARK_BG = '#1F2845';
const TEXT_COLOR = '#41516A';

export default function SEOServicesPage() {
  return (
    <div className="bg-white" style={{fontFamily: '"Open Sans", sans-serif'}}>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "NSM Prime - SEO Services",
            "description": "Professional SEO services in Las Vegas",
            "url": "https://nsmprime.com/seo-services-las-vegas",
            "telephone": "(917) 972-7298",
            "email": "contact@nsmprime.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Las Vegas",
              "addressRegion": "NV",
              "addressCountry": "US"
            },
            "serviceType": "Search Engine Optimization",
            "areaServed": "Las Vegas"
          })
        }}
      />
      
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden min-h-[700px] flex items-center">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'url("/images/home-business-1-391x642.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-semibold bg-cyan-500 px-4 py-1 rounded-full" style={{background: PRIMARY}}>SEO Experts Since 2015</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>
              Professional SEO Services in Las Vegas
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 leading-relaxed" style={{color: '#e0e0e0'}}>
              Dominate Google search results. Our proven SEO strategies generate qualified leads for Las Vegas businesses. Rank higher, attract more customers, grow faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="#audit"
                className="inline-block font-bold text-lg px-8 py-4 rounded-lg transition duration-300 text-center shadow-xl uppercase hover:opacity-90"
                style={{background: PRIMARY, color: '#fff', letterSpacing: '0.5px'}}
              >
                Get Free SEO Audit
              </a>
              <a
                href="#services"
                className="inline-block bg-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition duration-300 text-center shadow-xl uppercase"
                style={{color: TEXT_COLOR, letterSpacing: '0.5px'}}
              >
                View Our Services
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              {['500+ Las Vegas Businesses Ranked', 'Average +156% Traffic Growth', 'Guaranteed Results or Money Back'].map((text, idx) => (
                <div key={idx} className="flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{color: PRIMARY}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
              Comprehensive SEO Services
            </h2>
            <p className="text-xl" style={{color: TEXT_COLOR}}>
              Every service designed to boost your rankings and drive qualified traffic
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Technical SEO',
                desc: 'Site audits, speed optimization, mobile-friendliness, crawlability, and structured data implementation'
              },
              {
                icon: '📝',
                title: 'On-Page SEO',
                desc: 'Content optimization, meta tags, keyword placement, internal linking strategy, and page structure'
              },
              {
                icon: '🔗',
                title: 'Link Building',
                desc: 'High-quality backlinks from authoritative Las Vegas and industry sites. White-hat link strategies only'
              },
              {
                icon: '📍',
                title: 'Local SEO',
                desc: 'Google Business Profile optimization, local citations, reviews management, local link building'
              },
              {
                icon: '✍️',
                title: 'Content Strategy',
                desc: 'Keyword research, SEO-optimized content creation, blog management, and content calendars'
              },
              {
                icon: '📊',
                title: 'SEO Analytics',
                desc: 'Monthly reporting, ranking tracking, traffic analysis, and ROI measurement with actionable insights'
              }
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-t-4" style={{borderTopColor: PRIMARY}}>
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: DARK_BG}}>
                  {service.title}
                </h3>
                <p style={{color: TEXT_COLOR}}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20" style={{background: DARK_BG}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-white text-center uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>
            Why Las Vegas Businesses Choose NSM Prime
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {title: '500+', subtitle: 'Businesses Ranked on Page 1'},
              {title: '8 Years', subtitle: 'Of SEO Excellence'},
              {title: '200%+', subtitle: 'Average Traffic Growth'},
              {title: '24/7', subtitle: 'Dedicated Support'}
            ].map((stat, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="text-5xl font-bold mb-2" style={{color: PRIMARY}}>
                  {stat.title}
                </div>
                <p className="text-lg">{stat.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
            Industries We Specialize In
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {['Real Estate', 'Dentistry', 'Legal Services', 'Home Services', 'E-Commerce', 'Healthcare', 'Automotive', 'Fitness'].map((industry, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition duration-300">
                <p className="font-bold text-lg" style={{color: TEXT_COLOR}}>
                  {industry}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
            Our Proven SEO Process
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {step: '1', title: 'Audit & Analysis', desc: 'Complete SEO audit, competitor analysis, keyword research'},
              {step: '2', title: 'Strategy', desc: 'Custom SEO roadmap tailored to your Las Vegas market'},
              {step: '3', title: 'Implementation', desc: 'On-page, technical, and link building optimization'},
              {step: '4', title: 'Monitoring & Growth', desc: 'Continuous optimization and monthly reporting'}
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white p-8 rounded-lg shadow-md border-l-4" style={{borderLeftColor: PRIMARY}}>
                  <div className="text-4xl font-bold mb-3" style={{color: PRIMARY}}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: DARK_BG}}>
                    {item.title}
                  </h3>
                  <p style={{color: TEXT_COLOR}}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: DARK_BG}}>
              Case Study: Las Vegas Real Estate Company
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <p className="text-5xl font-bold" style={{color: PRIMARY}}>+287%</p>
                <p className="text-lg font-semibold" style={{color: TEXT_COLOR}}>Organic Traffic Growth</p>
              </div>
              <div>
                <p className="text-5xl font-bold" style={{color: PRIMARY}}>15 Keywords</p>
                <p className="text-lg font-semibold" style={{color: TEXT_COLOR}}>Ranked Top 3</p>
              </div>
              <div>
                <p className="text-5xl font-bold" style={{color: PRIMARY}}>4 Months</p>
                <p className="text-lg font-semibold" style={{color: TEXT_COLOR}}>To Page 1</p>
              </div>
            </div>

            <p style={{color: TEXT_COLOR}} className="text-lg leading-relaxed">
              We helped a Las Vegas real estate agency rank for high-intent keywords like "homes for sale in Las Vegas" and "luxury Las Vegas properties." Within 4 months, they went from no rankings to #1-3 positions for 15 key terms. Their qualified leads increased by 287%, and they closed 23 additional transactions within 6 months.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
            Common SEO Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'How long does SEO take?',
                a: 'Most businesses see results in 3-6 months. Competitive keywords may take 6-12 months. We focus on sustainable growth, not shortcuts.'
              },
              {
                q: 'What\'s your SEO pricing?',
                a: 'Our plans start at $1,500/month and scale based on your industry competition and goals. Let\'s discuss a custom package for your business.'
              },
              {
                q: 'Do you guarantee rankings?',
                a: 'We can\'t guarantee specific rankings (no one can), but we guarantee effort and results-driven strategies. Most clients see 2-3x traffic growth.'
              },
              {
                q: 'What if my current SEO isn\'t working?',
                a: 'We\'ll do a free audit to identify the problems. Many businesses are throwing away money on ineffective tactics. Let\'s fix it.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="bg-gray-50 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-300">
                <summary className="font-bold text-lg" style={{color: DARK_BG}}>
                  {faq.q}
                </summary>
                <p className="mt-4" style={{color: TEXT_COLOR}}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{color: TEXT_COLOR}}>
            Other Services to Boost Your Online Presence
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/seo-agency-las-vegas">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                <h3 className="text-2xl font-bold mb-3 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', color: PRIMARY}}>
                  SEO Agency
                </h3>
                <p style={{color: TEXT_COLOR}}>
                  Full-service SEO agency with proven 90-day guarantee. Get more customers from Google.
                </p>
              </div>
            </Link>

            <Link href="/ecommerce-las-vegas">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                <h3 className="text-2xl font-bold mb-3 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', color: PRIMARY}}>
                  E-Commerce Development
                </h3>
                <p style={{color: TEXT_COLOR}}>
                  Build a high-converting online store with Shopify or WooCommerce. Increase sales 24/7.
                </p>
              </div>
            </Link>

            <Link href="/blog/ultimate-guide-local-seo-las-vegas-2026">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                <h3 className="text-2xl font-bold mb-3 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', color: PRIMARY}}>
                  Local SEO Guide
                </h3>
                <p style={{color: TEXT_COLOR}}>
                  Learn the ultimate guide to local SEO for Las Vegas businesses in 2026.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{background: PRIMARY}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>
            Ready to Dominate Google?
          </h2>
          <p className="text-xl text-white mb-8">
            Get your free SEO audit and custom strategy recommendation
          </p>
          <a
            href="mailto:contact@nsmprime.com?subject=SEO Services Inquiry"
            className="inline-block bg-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition duration-300 text-center shadow-xl uppercase"
            style={{color: PRIMARY, letterSpacing: '0.5px'}}
          >
            Schedule Free Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
