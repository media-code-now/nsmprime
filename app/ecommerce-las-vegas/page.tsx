import Link from 'next/link';
import { Metadata } from 'next';
import LeadForm from '../components/LeadForm';

export const metadata: Metadata = {
  title: 'E-Commerce Website Development Las Vegas | Online Store Solutions',
  description: 'Professional e-commerce development in Las Vegas. Custom Shopify, WooCommerce, and BigCommerce stores. Increase online sales. Free consultation for Las Vegas businesses.',
  keywords: ['e-commerce Las Vegas', 'online store development', 'Shopify store Las Vegas', 'WooCommerce development', 'online sales'],
  alternates: {
    canonical: 'https://nsmprime.com/ecommerce-las-vegas',
  },
  openGraph: {
    title: 'E-Commerce Website Development in Las Vegas | NSM Prime',
    description: 'Build a high-converting online store that increases sales 24/7.',
    url: 'https://nsmprime.com/ecommerce-las-vegas',
    siteName: 'NSM Prime',
    type: 'website',
  },
};

const PRIMARY = '#80deea';
const DARK_BG = '#1F2845';
const TEXT_COLOR = '#41516A';

export default function EcommercePage() {
  return (
    <div className="bg-white" style={{fontFamily: '"Open Sans", sans-serif'}}>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "NSM Prime - E-Commerce Development",
            "description": "Professional e-commerce development in Las Vegas",
            "url": "https://nsmprime.com/ecommerce-las-vegas",
            "telephone": "(917) 972-7298",
            "email": "noam@nsmprime.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Las Vegas",
              "addressRegion": "NV",
              "addressCountry": "US"
            },
            "serviceType": "E-Commerce Development",
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
              <span className="text-sm font-semibold bg-cyan-500 px-4 py-1 rounded-full" style={{background: PRIMARY}}>E-Commerce Experts</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>
              E-Commerce Website Design & Development in Las Vegas
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 leading-relaxed" style={{color: '#e0e0e0'}}>
              Launch a high-converting online store. Custom e-commerce development that increases sales, improves customer experience, and scales with your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="#portfolio"
                className="inline-block font-bold text-lg px-8 py-4 rounded-lg transition duration-300 text-center shadow-xl uppercase hover:opacity-90"
                style={{background: PRIMARY, color: '#fff', letterSpacing: '0.5px'}}
              >
                View Our Work
              </a>
              <a
                href="#services"
                className="inline-block bg-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition duration-300 text-center shadow-xl uppercase"
                style={{color: TEXT_COLOR, letterSpacing: '0.5px'}}
              >
                Our Services
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              {['150+ Stores Launched', 'Average 45% Revenue Increase', 'Full Mobile Optimization'].map((text, idx) => (
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

      {/* Why E-Commerce Matters */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
              Why Las Vegas Businesses Need E-Commerce
            </h2>
            <p className="text-xl" style={{color: TEXT_COLOR}}>
              Reach customers 24/7 and generate revenue while you sleep
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌍',
                title: '24/7 Sales Channel',
                desc: 'Accept orders anytime. Your online store works while you sleep, on weekends, and holidays'
              },
              {
                icon: '📱',
                title: 'Mobile-First Shopping',
                desc: '65% of Las Vegas shoppers browse on mobile. We build stores optimized for every device'
              },
              {
                icon: '💰',
                title: 'Increased Revenue',
                desc: 'Average clients see 45% revenue increase in first year. Higher margins than local sales'
              },
              {
                icon: '🎯',
                title: 'Local + Online',
                desc: 'Drive traffic from local SEO, Google Ads, and social media to your online store'
              },
              {
                icon: '📊',
                title: 'Data-Driven Insights',
                desc: 'Real-time sales data, customer behavior, inventory tracking, and profit analytics'
              },
              {
                icon: '🚀',
                title: 'Scale Your Business',
                desc: 'Handle 10x more customers without hiring. Automate shipping, invoicing, and fulfillment'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-t-4" style={{borderTopColor: PRIMARY}}>
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: DARK_BG}}>
                  {item.title}
                </h3>
                <p style={{color: TEXT_COLOR}}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20" style={{background: DARK_BG}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-white text-center uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>
            Our E-Commerce Services
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Shopify Store Development',
                features: ['Custom themes & design', 'Product catalog setup', 'Payment gateway integration', 'Email marketing automation', 'Inventory management', 'App optimization']
              },
              {
                title: 'WooCommerce Development',
                features: ['Custom plugins & extensions', 'WordPress optimization', 'Payment & shipping setup', 'Inventory tracking', 'Customer reviews system', 'SEO optimization']
              },
              {
                title: 'BigCommerce Stores',
                features: ['Enterprise-grade platform', 'Advanced inventory control', 'Multi-channel selling', 'API integrations', 'Wholesale capabilities', '24/7 platform support']
              },
              {
                title: 'Store Optimization',
                features: ['Conversion rate optimization', 'Checkout flow improvement', 'Product page optimization', 'Mobile responsiveness', 'Site speed optimization', 'A/B testing']
              },
              {
                title: 'Payment & Shipping',
                features: ['Credit card processing', 'PayPal, Stripe integration', 'Shipping calculators', 'Real-time rates', 'Digital delivery setup', 'Subscription products']
              },
              {
                title: 'Marketing Integration',
                features: ['Google Shopping setup', 'Email campaign automation', 'Social media integration', 'Retargeting pixels', 'Analytics setup', 'Influencer tools']
              }
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: DARK_BG}}>
                  {service.title}
                </h3>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-5 h-5 mr-3" style={{color: PRIMARY}} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span style={{color: TEXT_COLOR}}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
            Recent E-Commerce Projects
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Luxury Fashion Boutique',
                platform: 'Shopify',
                result: '$185K first year sales'
              },
              {
                name: 'Health & Wellness',
                platform: 'WooCommerce',
                result: '+340% traffic growth'
              },
              {
                name: 'Local Craft Products',
                platform: 'Shopify Plus',
                result: '+125% repeat customers'
              }
            ].map((project, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-48" style={{background: `linear-gradient(135deg, ${PRIMARY}, #667eea)`}}></div>
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2" style={{color: DARK_BG}}>
                    {project.name}
                  </h3>
                  <p className="text-sm mb-4" style={{color: TEXT_COLOR}}>
                    Built on: {project.platform}
                  </p>
                  <p className="text-lg font-bold" style={{color: PRIMARY}}>
                    {project.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
            Our E-Commerce Development Process
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {step: '1', title: 'Discovery & Planning', desc: 'Understand your products, audience, and goals'},
              {step: '2', title: 'Design & Setup', desc: 'Build custom design and configure your store'},
              {step: '3', title: 'Integration & Testing', desc: 'Connect payments, shipping, and marketing tools'},
              {step: '4', title: 'Launch & Growth', desc: 'Go live and optimize for conversions and sales'}
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md border-l-4" style={{borderLeftColor: PRIMARY}}>
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
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20" style={{background: DARK_BG}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2" style={{color: PRIMARY}}>150+</div>
              <p className="text-lg">E-Commerce Stores</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2" style={{color: PRIMARY}}>$42M+</div>
              <p className="text-lg">Client Sales Generated</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2" style={{color: PRIMARY}}>45%</div>
              <p className="text-lg">Average Revenue Increase</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2" style={{color: PRIMARY}}>98%</div>
              <p className="text-lg">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
            E-Commerce Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Which platform is best for my business?',
                a: 'Shopify is great for startups and small businesses. WooCommerce works well if you already use WordPress. BigCommerce suits larger operations. We\'ll recommend what fits your needs.'
              },
              {
                q: 'How much does an e-commerce store cost?',
                a: 'Custom stores start at $5,000-$15,000 depending on features. Platforms like Shopify have monthly fees ($29-$300+). Let\'s discuss your budget and build accordingly.'
              },
              {
                q: 'Can you help with product photography?',
                a: 'We can recommend photographers and help optimize product images for sales. Professional product photos increase conversions by 27%.'
              },
              {
                q: 'Do you handle shipping and fulfillment?',
                a: 'We integrate with shipping providers and third-party fulfillment services. We configure everything; you just ship (or outsource it).'
              }
            ].map((faq, idx) => (
              <details key={idx} className="bg-white p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-300">
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

      {/* CTA */}
      <section className="py-20" style={{background: PRIMARY}}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>
            Ready to Sell Online?
          </h2>
          <p className="text-xl text-white mb-8">
            Let's build your e-commerce store and turn browsers into buyers
          </p>
          <div className="bg-white p-8 rounded-lg shadow-xl text-left">
            <LeadForm
              subject="New E-Commerce Development Inquiry"
              buttonText="Request My Free Consultation"
              showWebsite
            />
          </div>
        </div>
      </section>
    </div>
  );
}
