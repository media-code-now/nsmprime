import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'SEO Agency Las Vegas | Get More Customers From Google in 90 Days',
  description: 'Stop losing customers to competitors. Our proven SEO system gets Las Vegas businesses ranking #1 on Google. Free SEO audit. No long-term contracts.',
};

// NSM Prime Brand Colors
const PRIMARY = '#80deea';
const DARK_BG = '#1F2845';
const TEXT_COLOR = '#41516A';

export default function SEOAgencyLandingPage() {
  return (
    <div className="bg-white" style={{fontFamily: '"Open Sans", sans-serif'}}>
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
            {/* Hero Content */}
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <span className="text-2xl" style={{color: PRIMARY}}>★★★★★</span>
                  <span className="ml-2 text-sm">4.9/5 (127 Reviews)</span>
                </div>
                <div className="h-6 w-px bg-white opacity-30"></div>
                <span className="text-sm font-semibold">15+ Years in Business</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>
                Get More Customers From Google in the Next 90 Days—Guaranteed
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 leading-relaxed" style={{color: '#e0e0e0'}}>
                Stop losing customers to competitors who rank above you. Our proven SEO system gets Las Vegas businesses to Page 1 of Google—without wasting money on ads that stop working the moment you turn them off.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="#audit"
                  className="inline-block font-bold text-lg px-8 py-4 rounded-lg transition duration-300 text-center shadow-xl uppercase hover:opacity-90"
                  style={{background: PRIMARY, color: '#fff', letterSpacing: '0.5px'}}
                >
                  Get My Free SEO Audit
                </a>
                <a
                  href="#call"
                  className="inline-block bg-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition duration-300 text-center shadow-xl uppercase"
                  style={{color: TEXT_COLOR, letterSpacing: '0.5px'}}
                >
                  Book a Strategy Call
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                {['No Long-Term Contracts', '90-Day Results Guarantee', '500+ Businesses Ranked'].map((text, idx) => (
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
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
              Is Your Business Invisible on Google?
            </h2>
            <p className="text-xl" style={{color: TEXT_COLOR}}>
              If you're not on Page 1, you might as well not exist.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {title: 'Not Ranking on Google', desc: 'Your competitors are on Page 1, capturing all the customers searching for your services right now.', impact: '→ You\'re losing 10+ qualified leads every single day'},
              {title: 'Wasting Money on Ads', desc: 'Spending $3,000–$10,000/month on Google Ads just to stay afloat. The second you stop paying, the leads dry up instantly.', impact: '→ Ads are a temporary band-aid, not a long-term solution'},
              {title: 'No Traffic, No Leads', desc: 'Your website gets a handful of visitors per month—and most of them are accidental. Your phone isn\'t ringing.', impact: '→ Your competitors are eating your lunch while you stay invisible'}
            ].map((pain, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{borderLeftColor: '#e53e3e'}}>
                <div className="text-red-500 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>{pain.title}</h3>
                <p className="mb-4" style={{color: TEXT_COLOR}}>{pain.desc}</p>
                <p className="text-sm font-semibold text-red-600">{pain.impact}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <p className="text-lg font-semibold mb-2" style={{color: TEXT_COLOR}}>Here's the brutal truth:</p>
            <p style={{color: TEXT_COLOR}}>
              Every day you're not ranking on Google is another day your competitors are stealing your customers. While you're stuck on Page 3 (where nobody looks), businesses just like yours are dominating Page 1 and getting a steady stream of high-intent, ready-to-buy customers—for free.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
              The Solution: Predictable, Scalable SEO That Actually Works
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{color: TEXT_COLOR}}>
              Our proven 5-step SEO system gets Las Vegas businesses ranking on Page 1—without shady tactics, long-term contracts, or empty promises.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {num: 1, title: 'Deep SEO Audit & Competitor Analysis', desc: 'We reverse-engineer what\'s working for your top competitors and identify the exact keywords your customers are searching for. Then we find every technical issue holding your site back.'},
              {num: 2, title: 'Fix Critical Technical Issues', desc: 'We clean up the mess: broken links, slow load times, mobile issues, duplicate content—everything that\'s quietly killing your rankings.'},
              {num: 3, title: 'Optimize For High-Intent Keywords', desc: 'We rewrite your pages to rank for the exact searches your customers are making—the ones that actually generate leads and sales, not vanity traffic.'},
              {num: 4, title: 'Build Authority & Trust Signals', desc: 'We get high-authority backlinks, optimize your Google Business Profile, and build local citations so Google sees you as the #1 authority in your market.'},
              {num: 5, title: 'Track, Measure, Scale', desc: 'You get transparent reporting every month: keyword rankings, traffic growth, leads generated, and ROI. We double down on what\'s working and cut what\'s not.'}
            ].map((step) => (
              <div key={step.num} className="flex flex-col md:flex-row items-start md:items-center p-8 rounded-lg" style={{background: '#f0f9fa'}}>
                <div className="flex-shrink-0 w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 md:mb-0 md:mr-6" style={{background: PRIMARY}}>
                  {step.num}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>{step.title}</h3>
                  <p style={{color: TEXT_COLOR}}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-lg border-2" style={{background: 'linear-gradient(to right, #e6f9fc, #f0f9fa)', borderColor: PRIMARY}}>
            <h3 className="text-2xl font-bold mb-4 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>The Result?</h3>
            <ul className="space-y-3 text-lg">
              {[
                '<strong>More Organic Traffic:</strong> 300%–500% increase in qualified visitors within 90 days',
                '<strong>More Leads:</strong> A steady stream of phone calls and form submissions from people ready to buy',
                '<strong>Higher Revenue:</strong> Predictable growth without spending a fortune on paid ads'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-1" style={{color: PRIMARY}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span style={{color: TEXT_COLOR}} dangerouslySetInnerHTML={{__html: item}} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 text-white" style={{background: DARK_BG}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>
              Our SEO Services Drive Real Results
            </h2>
            <p className="text-xl text-gray-300">We don't just "do SEO"—we grow your business.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {title: 'Local SEO', desc: 'Dominate the Google Local Pack and Google Maps. Get found by customers in Las Vegas, Henderson, Summerlin, and beyond when they\'re ready to buy.', detail: '→ Ideal for service businesses, restaurants, medical practices, and retailers', img: '/images/service-1.jpg'},
              {title: 'Technical SEO', desc: 'Fix the hidden issues sabotaging your rankings: site speed, mobile optimization, crawl errors, broken links, and Core Web Vitals.', detail: '→ 90% of sites have critical technical issues holding them back', img: '/images/service-2.jpg'},
              {title: 'On-Page Optimization', desc: 'Transform your pages into lead-generating machines. We optimize titles, meta descriptions, headers, content, and internal linking for maximum conversions.', detail: '→ More traffic + better conversions = exponential growth', img: '/images/service-3.jpg'},
              {title: 'Content Strategy', desc: 'Create high-quality, SEO-optimized content that answers your customers\' questions and positions you as the authority in your industry.', detail: '→ Content that educates, converts, and ranks', img: '/images/service-4.jpg'},
              {title: 'Link Building', desc: 'Earn high-authority backlinks from trusted sources. We build real relationships and create link-worthy content—no sketchy tactics or link farms.', detail: '→ Quality over quantity = sustainable rankings', img: '/images/service-5.jpg'},
              {title: 'Google Business Profile Optimization', desc: 'Claim, verify, and dominate the Google Local Pack. We optimize your GBP to get more calls, directions, and walk-ins from local searchers.', detail: '→ The fastest way to get local leads', img: '/images/service-6.jpg'}
            ].map((service, idx) => (
              <div key={idx} className="rounded-lg hover:bg-gray-800 transition duration-300 overflow-hidden" style={{background: '#2a3a55'}}>
                {service.img && (
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>{service.title}</h3>
                  <p className="text-gray-300 mb-4">{service.desc}</p>
                  <p className="font-semibold" style={{color: PRIMARY}}>{service.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
              Real Results From Real Businesses
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              {num: '427%', label: 'Average Traffic Increase'},
              {num: '500+', label: 'Businesses Ranked'},
              {num: '15+', label: 'Years of Experience'},
              {num: '92%', label: 'Client Retention Rate'}
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-extrabold mb-2" style={{color: PRIMARY}}>{stat.num}</div>
                <div style={{color: TEXT_COLOR}}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {quote: 'We went from 12 leads a month to 87 in just 4 months. NSM Prime completely transformed our online presence. Our phone hasn\'t stopped ringing.', name: 'Michael R.', title: 'HVAC Contractor, Henderson', avatar: '/images/testimonials-1-120x120.jpg'},
              {quote: 'I was skeptical after being burned by two other SEO agencies. NSM Prime delivered results in 60 days. We\'re now #1 for "personal injury lawyer Las Vegas."', name: 'Jennifer K.', title: 'Law Firm, Las Vegas', avatar: '/images/testimonials-2-120x120.jpg'},
              {quote: 'Our organic traffic increased 520% in 6 months. We cut our Google Ads budget in half and we\'re still getting more leads than ever. Best investment we\'ve made.', name: 'David T.', title: 'Dental Practice, Summerlin', avatar: '/images/testimonials-3-120x120.jpg'}
            ].map((test, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-xl" style={{color: PRIMARY}}>★★★★★</div>
                </div>
                <p className="mb-6 italic" style={{color: TEXT_COLOR}}>&quot;{test.quote}&quot;</p>
                <div className="flex items-center mb-2">
                  {test.avatar && (
                    <img 
                      src={test.avatar} 
                      alt={test.name} 
                      className="w-12 h-12 rounded-full mr-3 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <div className="font-semibold" style={{color: TEXT_COLOR}}>{test.name}</div>
                    <div className="text-sm text-gray-600">{test.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section id="audit" className="py-20 text-white" style={{background: `linear-gradient(135deg, ${PRIMARY} 0%, #667eea 100%)`}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>
            Get Your Free SEO Audit (Worth $497)
          </h2>
          <p className="text-xl mb-8">
            Find out exactly what's holding your website back from ranking on Google. We'll analyze your site and show you the opportunities your competitors are missing.
          </p>

          <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>What You'll Get:</h3>
            <ul className="text-left space-y-3 mb-8">
              {[
                '<strong>Complete Technical SEO Analysis:</strong> We\'ll find every issue killing your rankings',
                '<strong>Competitor Keyword Gap Analysis:</strong> See what keywords your competitors rank for that you don\'t',
                '<strong>Custom Action Plan:</strong> A prioritized roadmap showing exactly what to fix first',
                '<strong>30-Minute Strategy Call:</strong> Walk through your audit with an SEO expert'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-1" style={{color: PRIMARY}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span style={{color: TEXT_COLOR}} dangerouslySetInnerHTML={{__html: item}} />
                </li>
              ))}
            </ul>

            <form className="space-y-4" action="/contacts.html" method="GET">
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              </div>
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="url" placeholder="Your Website URL" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <button
                type="submit"
                className="w-full text-white font-bold text-lg px-8 py-4 rounded-lg hover:opacity-90 transition duration-300 shadow-xl uppercase"
                style={{background: DARK_BG, fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}
              >
                Get My Free SEO Audit Now
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {q: 'How long does SEO take to show results?', a: 'You\'ll typically see initial movement in 30–60 days (improved rankings, traffic upticks). Significant results—Page 1 rankings, consistent lead flow—usually happen within 90–120 days. SEO is a long-term investment, but the ROI compounds exponentially over time.'},
              {q: 'What results can I realistically expect?', a: 'Most of our clients see a 300%–500% increase in organic traffic within 6 months, along with a significant boost in qualified leads. Results vary based on your industry, competition, and current site health, but we provide realistic projections during your strategy call.'},
              {q: 'Do you guarantee #1 rankings?', a: 'No ethical SEO agency can guarantee specific rankings because Google\'s algorithm is constantly changing. However, we <strong>do guarantee results</strong>: improved traffic, better rankings, and more leads within 90 days—or you don\'t pay.'},
              {q: 'How much does SEO cost?', a: 'Our SEO packages start at $1,500/month for local businesses and scale based on your market competitiveness and goals. This is a fraction of what most businesses spend on Google Ads—and SEO keeps working even when you stop paying.'}
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: TEXT_COLOR}}>
                  {faq.q}
                </h3>
                <p style={{color: TEXT_COLOR}} dangerouslySetInnerHTML={{__html: faq.a}} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="call" className="py-20 text-white" style={{background: DARK_BG}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 uppercase" style={{fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}>
            Ready to Stop Losing Customers to Your Competitors?
          </h2>
          <p className="text-xl mb-8" style={{color: '#e0e0e0'}}>
            Every day you wait is another day your competitors are stealing your customers. Let's fix that.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="#audit"
              className="inline-block font-bold text-lg px-8 py-4 rounded-lg transition duration-300 shadow-xl uppercase hover:opacity-90"
              style={{background: PRIMARY, color: '#fff', fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}
            >
              Get My Free SEO Audit
            </a>
            <a
              href="tel:+19179727298"
              className="inline-block bg-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition duration-300 shadow-xl uppercase"
              style={{color: TEXT_COLOR, fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px'}}
            >
              Call Now: (917) 972-7298
            </a>
          </div>

          <p className="text-sm" style={{color: '#e0e0e0'}}>
            Or email us at: <a href="mailto:contact@nsmprime.com" className="underline hover:text-white">contact@nsmprime.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}
