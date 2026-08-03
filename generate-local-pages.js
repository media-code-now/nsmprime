/* generate-local-pages.js */
const fs = require('fs');
const path = require('path');
const ProgrammaticSEOGenerator = require('./programmatic-seo-generator');
const templateConfig = require('./programmatic-seo-template.json');

// HTML Skeleton Template
const htmlTemplate = (data) => `<!DOCTYPE html>
<html lang="en">
<head>
    <title>${data.title} - NSM Prime</title>
    <meta name="description" content="${data.metaDescription}">
    <link rel="canonical" href="https://nsmprime.com${data.url}">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="local SEO ${data.location}, ${data.location} ${data.businessType}, Nevada ${data.businessType} SEO, ${data.businessType} marketing ${data.location}">
    <meta name="robots" content="index, follow"> 
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="business.business">
    <meta property="og:url" content="https://nsmprime.com${data.url}">
    <meta property="og:title" content="${data.title}">
    <meta property="og:description" content="${data.metaDescription}">
    <meta property="og:image" content="https://nsmprime.com/images/bg-image-1.jpg">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://nsmprime.com${data.url}">
    <meta property="twitter:title" content="${data.title}">
    <meta property="twitter:description" content="${data.metaDescription}">
    <meta property="twitter:image" content="https://nsmprime.com/images/bg-image-1.jpg">

    <!-- LocalBusiness Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(data.schema, null, 2)}
    </script>
    
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/fonts.css">
    <style>
       .local-seo-page { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
       .intro-hook { font-size: 1.25rem; line-height: 1.8; margin-bottom: 3rem; color: #555; border-left: 4px solid #667eea; padding-left: 20px; }
       .table-of-contents { background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 3rem; border: 1px solid #e9ecef; }
       .table-of-contents ul { list-style: none; padding: 0; }
       .table-of-contents li { margin-bottom: 10px; }
       .table-of-contents a { color: #667eea; font-weight: 600; text-decoration: none; }
       section { margin-bottom: 4rem; }
       h1 { font-weight: 800; margin-bottom: 2rem; color: #1a202c; }
       h2 { font-weight: 700; color: #2d3748; margin-bottom: 1.5rem; border-bottom: 2px solid #f1f1f1; padding-bottom: 10px; }
       h3 { font-size: 1.5rem; font-weight: 600; color: #4a5568; margin-top: 1.5rem; margin-bottom: 1rem; }
       p { font-size: 1.1rem; line-height: 1.8; color: #4a5568; margin-bottom: 1.5rem; }
       ul { margin-bottom: 1.5rem; }
       li { margin-bottom: 0.5rem; font-size: 1.05rem; color: #4a5568; }
       .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px; transition: all 0.3s; }
       .cta-button:hover { background: #5a67d8; text-decoration: none; color: white; transform: translateY(-2px); }
    </style>
</head>
<body>

<!-- Simplified Header for Static Generation -->
<header class="page-header" style="background-color: #1a202c; padding: 15px 0;">
    <div class="container">
        <div class="d-flex justify-content-between align-items-center">
             <a href="index.html" class="brand" style="color: white; font-weight: 800; font-size: 1.5rem; text-decoration: none;">NSM Prime</a>
             <nav>
                <a href="index.html" style="color: #cbd5e0; margin-left: 20px; text-decoration: none;">Home</a>
                <a href="services.html" style="color: #cbd5e0; margin-left: 20px; text-decoration: none;">Services</a>
                <a href="contacts.html" style="color: #cbd5e0; margin-left: 20px; text-decoration: none;">Contact</a>
             </nav>
        </div>
    </div>
</header>

<article class="local-seo-page">
    <header>
        <h1>${data.title}</h1>
        <div class="intro-hook">${data.content.introHook}</div>
    </header>

    <div class="table-of-contents">
        <h2>Table of Contents</h2>
        <ul>
            ${data.content.mainSections.map(section => `<li><a href="#${section.id}">${section.h2}</a></li>`).join('\n')}
            <li><a href="#benefits">Why Choose Us</a></li>
            <li><a href="#conclusion">Conclusion</a></li>
        </ul>
    </div>

    ${data.content.mainSections.map(section => `
    <section id="${section.id}">
        <h2>${section.h2}</h2>
        <div class="content-body">${section.content}</div>
    </section>
    `).join('\n')}

    <section id="benefits">
        ${data.content.benefits}
    </section>

    <section id="conclusion">
       <h2>Conclusion</h2>
       <div class="bg-light p-4 rounded">
            <p>${data.content.conclusion || `Dominating the ${data.location} market starts with a solid local SEO strategy. Contact us today.`}</p>
            <div class="text-center mt-4">
                <a href="contacts.html" class="cta-button">Get Your Free Local SEO Audit</a>
            </div>
            <form action="https://formsubmit.co/noam@nsmprime.com" method="POST" style="max-width:520px;margin:24px auto 0;text-align:left;background:#f7fafc;padding:24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <input type="hidden" name="_subject" value="New Local SEO Lead - Landing Page">
                <input type="hidden" name="_captcha" value="false">
                <input type="hidden" name="_template" value="table">
                <input type="hidden" name="_next" value="https://nsmprime.com/thank-you">
                <input type="text" name="_honey" style="display:none">
                <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
                    <input type="text" name="name" placeholder="Your Name" required style="flex:1;min-width:180px;padding:12px;border:1px solid #cbd5e0;border-radius:5px;">
                    <input type="tel" name="phone" placeholder="Phone Number" required style="flex:1;min-width:180px;padding:12px;border:1px solid #cbd5e0;border-radius:5px;">
                </div>
                <input type="email" name="email" placeholder="Email Address" required style="width:100%;padding:12px;border:1px solid #cbd5e0;border-radius:5px;margin-bottom:12px;">
                <input type="url" name="website" placeholder="Your Website (optional)" style="width:100%;padding:12px;border:1px solid #cbd5e0;border-radius:5px;margin-bottom:12px;">
                <button type="submit" class="cta-button" style="width:100%;border:none;cursor:pointer;">Get My Free Local SEO Audit</button>
            </form>
       </div>
    </section>
</article>

<footer style="background: #1a202c; color: #cbd5e0; padding: 40px 0; margin-top: 50px;">
    <div class="container text-center">
        <p>&copy; 2026 NSM Prime Media Group. All rights reserved.</p>
        <p class="small text-muted">Serving ${data.location}, Las Vegas, NV 89101</p>
    </div>
</footer>

</body>
</html>`;

const generator = new ProgrammaticSEOGenerator(templateConfig);

// Configuration for batch generation
const locations = [
    'Henderson', 'Summerlin', 'North Las Vegas', 
    'Paradise', 'Spring Valley', 'Enterprise', 
    'Sunrise Manor', 'Centennial Hills', 'Green Valley'
]; 

const businessTypes = [
    'dentists', 'real estate agents', 'plumbers', 'lawyers',
    'HVAC contractors', 'electricians', 'restaurants', 'roofing companies',
    'medical spas', 'fitness centers', 'auto repair shops'
]; 

const industryMap = {
    'dentists': 'healthcare',
    'real estate agents': 'real estate',
    'plumbers': 'home services',
    'HVAC contractors': 'home services',
    'electricians': 'home services',
    'roofing companies': 'home services',
    'lawyers': 'legal',
    'medical spas': 'beauty',
    'fitness centers': 'fitness',
    'restaurants': 'hospitality',
    'auto repair shops': 'automotive'
};

let generatedCount = 0;
const generatedFilesList = [];

console.log('Starting batch generation...');

locations.forEach(location => {
    businessTypes.forEach(businessType => {
        try {
            const industry = industryMap[businessType] || 'professional services';
            const pageData = generator.generatePage(location, businessType, industry);
            
            // Fix safeguards
            if (!pageData.content.mainSections) pageData.content.mainSections = []; 
            if (!pageData.content.benefits) pageData.content.benefits = [];
    
            const html = htmlTemplate(pageData);
            
            // Filename: local-seo-location-businesstype.html
            // Clean slug
            const filename = `local-seo-${location.toLowerCase().replace(/\s+/g, '-')}-${businessType.toLowerCase().replace(/\s+/g, '-')}.html`;
            
            fs.writeFileSync(filename, html);
            console.log(`✅ Generated: ${filename}`);
            generatedCount++;
            
            generatedFilesList.push({
                filename,
                location,
                businessType
            });
        } catch (e) {
            console.error(`❌ Failed to generate ${location} ${businessType}:`, e);
            // console.error(e.stack);
        }
    });
});

// Function to generate the index page for all local files
function generateIndexPage(generatedFiles) {
    const listItems = generatedFiles.map(file => {
        return `<li><a href="${file.filename}">${file.location} ${file.businessType} SEO</a></li>`;
    }).join('\n');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Las Vegas Local SEO Service Areas - NSM Prime</title>
    <meta name="description" content="Explore our local SEO service areas in Las Vegas, Henderson, Summerlin and surrounding Nevada communities. We help local businesses dominate search results.">
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/style.css">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .local-link-list li { margin-bottom: 10px; font-size: 1.1rem; }
        .local-link-list a { color: #007bff; text-decoration: none; }
        .local-link-list a:hover { text-decoration: underline; }
        .faq-item { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .faq-question { font-weight: bold; font-size: 1.1em; color: #333; cursor: pointer; }
        .faq-answer { margin-top: 10px; color: #666; }
    </style>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "What areas of Las Vegas do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide local SEO services throughout the entire Las Vegas valley, including Henderson, Summerlin, North Las Vegas, Paradise, Spring Valley, Enterprise, and Centennial Hills."
        }
      }, {
        "@type": "Question",
        "name": "Do you offer industry-specific SEO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we specialize in SEO for various industries including dental practices, law firms, real estate agents, HVAC contractors, plumbers, and medical spas in the Nevada market."
        }
      }, {
        "@type": "Question",
        "name": "How long does it take to rank in local Las Vegas search?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most local businesses in Las Vegas see significant ranking improvements within 3-6 months of implementing our comprehensive local SEO strategy, though initial results often appear sooner."
        }
      }]
    }
    </script>
</head>
<body>
    <header class="page-header" style="background-color: #1a202c; padding: 15px 0;">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center">
                 <a href="index.html" class="brand" style="color: white; font-weight: 800; font-size: 1.5rem; text-decoration: none;">NSM Prime</a>
                 <nav>
                    <a href="index.html" style="color: #cbd5e0; margin-left: 20px; text-decoration: none;">Home</a>
                    <a href="services.html" style="color: #cbd5e0; margin-left: 20px; text-decoration: none;">Services</a>
                 </nav>
            </div>
        </div>
    </header>

    <div class="container section-md">
        <h1>Las Vegas Local Service Areas</h1>
        <p class="big">We provide specialized local SEO services for businesses across the Las Vegas valley. Select your location and industry to learn how we can help you grow.</p>
        
        <div class="row mt-5">
            <div class="col-md-8">
                <h3>Select Your Niche Market</h3>
                <ul class="list-unstyled local-link-list">
                    ${listItems}
                </ul>
            </div>
            <div class="col-md-4">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h4>Why Local SEO?</h4>
                    <p>Dominating your local neighborhood search results is the most cost-effective way to acquire new customers in Las Vegas.</p>
                </div>
            </div>
        </div>
        
        <div class="row mt-5">
            <div class="col-12">
                <h3>Frequently Asked Questions</h3>
                <div class="faq-item">
                    <div class="faq-question">What areas of Las Vegas do you serve?</div>
                    <div class="faq-answer">We provide local SEO services throughout the entire Las Vegas valley, including Henderson, Summerlin, North Las Vegas, Paradise, Spring Valley, Enterprise, and Centennial Hills.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">Do you offer industry-specific SEO?</div>
                    <div class="faq-answer">Yes, we specialize in SEO for various industries including dental practices, law firms, real estate agents, HVAC contractors, plumbers, and medical spas in the Nevada market.</div>
                </div>
                 <div class="faq-item">
                    <div class="faq-question">How long does it take to rank?</div>
                    <div class="faq-answer">Most local businesses in Las Vegas see significant ranking improvements within 3-6 months of implementing our comprehensive local SEO strategy.</div>
                </div>
            </div>
        </div>
    </div>

    <footer class="footer-corporate bg-gray-darkest context-dark" style="padding: 40px 0; margin-top: 50px;">
        <div class="container">
            <p>&copy; 2026 NSM Prime. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

    fs.writeFileSync('local-service-areas.html', html);
    console.log('✅ Generated index: local-service-areas.html');
}

generateIndexPage(generatedFilesList);

console.log(`\n🎉 Total pages generated: ${generatedCount}`);

