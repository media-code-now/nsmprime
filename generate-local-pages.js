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
const locations = ['Henderson', 'Summerlin', 'North Las Vegas']; 
const businessTypes = ['dentists', 'real estate agents', 'plumbers', 'lawyers']; 
const industryMap = {
    'dentists': 'healthcare',
    'real estate agents': 'real estate',
    'plumbers': 'home services',
    'lawyers': 'legal'
};

let generatedCount = 0;

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
        } catch (e) {
            console.error(`❌ Failed to generate ${location} ${businessType}:`, e);
            // console.error(e.stack);
        }
    });
});

console.log(`\n🎉 Total pages generated: ${generatedCount}`);
