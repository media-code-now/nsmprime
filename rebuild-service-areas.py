#!/usr/bin/env python3
"""Rebuild local-service-areas.html into a modern, branded, grouped layout
while preserving all existing local-seo links. Groups links by neighborhood."""
import re
from collections import OrderedDict

SRC = 'local-service-areas.html'

with open(SRC, 'r', encoding='utf-8') as fh:
    html = fh.read()

links = re.findall(r'<a href="(local-seo-[^"]+\.html)">([^<]+)</a>', html)

AREAS = [
    ('north-las-vegas', 'North Las Vegas'),
    ('centennial-hills', 'Centennial Hills'),
    ('sunrise-manor', 'Sunrise Manor'),
    ('spring-valley', 'Spring Valley'),
    ('green-valley', 'Green Valley'),
    ('henderson', 'Henderson'),
    ('summerlin', 'Summerlin'),
    ('paradise', 'Paradise'),
    ('enterprise', 'Enterprise'),
]

ICONS = {
    'dentists': '\U0001F9B7', 'real-estate-agents': '\U0001F3E1', 'plumbers': '\U0001F527',
    'lawyers': '\u2696\uFE0F', 'hvac-contractors': '\u2744\uFE0F', 'electricians': '\u26A1',
    'restaurants': '\U0001F37D\uFE0F', 'roofing-companies': '\U0001F3D8\uFE0F',
    'medical-spas': '\U0001F486', 'fitness-centers': '\U0001F3CB\uFE0F', 'auto-repair-shops': '\U0001F697',
}

grouped = OrderedDict((name, []) for _, name in AREAS)
for href, label in links:
    slug = href[len('local-seo-'):-len('.html')]
    for area_slug, area_name in AREAS:
        if slug.startswith(area_slug + '-'):
            industry = slug[len(area_slug) + 1:]
            icon = ICONS.get(industry, '\U0001F4CD')
            short = label.replace(area_name, '').replace(' SEO', '').strip()
            grouped[area_name].append((href, short, icon))
            break

cards = []
for area_name, items in grouped.items():
    if not items:
        continue
    link_items = '\n'.join(
        f'          <li><a href="{href}"><span class="ico">{icon}</span>{short}</a></li>'
        for href, short, icon in items
    )
    cards.append(f'''      <div class="area-card">
        <h3 class="area-title"><span class="pin">\U0001F4CD</span>{area_name}</h3>
        <ul class="niche-list">
{link_items}
        </ul>
      </div>''')

cards_html = '\n'.join(cards)
PRIMARY, DARK, TEXT = '#80deea', '#1F2845', '#41516A'

new_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <title>Las Vegas Local SEO Service Areas | NSM Prime</title>
    <meta name="description" content="Explore NSM Prime's local SEO service areas across Las Vegas, Henderson, Summerlin, North Las Vegas and surrounding Nevada communities. Industry-specific SEO to help local businesses dominate search.">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="canonical" href="https://nsmprime.com/local-service-areas">
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css2?family=Fira+Sans:wght@300;600;800&family=Open+Sans:wght@300;400;600&display=swap">
    <style>
        * {{ box-sizing: border-box; }}
        body {{ margin: 0; font-family: "Open Sans", sans-serif; color: {TEXT}; background: #fff; line-height: 1.6; }}
        a {{ text-decoration: none; }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 0 20px; }}
        .site-header {{ background: {DARK}; padding: 18px 0; position: sticky; top: 0; z-index: 50; }}
        .site-header .inner {{ display: flex; justify-content: space-between; align-items: center; }}
        .brand {{ color: #fff; font-family: "Fira Sans", sans-serif; font-weight: 800; font-size: 1.5rem; letter-spacing: .5px; }}
        .site-nav a {{ color: #cbd5e0; margin-left: 24px; font-weight: 600; transition: color .2s; }}
        .site-nav a:hover {{ color: {PRIMARY}; }}
        .hero {{ background: linear-gradient(135deg, {DARK} 0%, #2d3a5c 100%); color: #fff; padding: 80px 0; text-align: center; position: relative; overflow: hidden; }}
        .hero::after {{ content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 20% 30%, rgba(128,222,234,.15), transparent 40%); }}
        .hero .container {{ position: relative; z-index: 1; }}
        .hero .eyebrow {{ display: inline-block; background: {PRIMARY}; color: {DARK}; font-weight: 700; font-size: .8rem; letter-spacing: 1px; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; }}
        .hero h1 {{ font-family: "Fira Sans", sans-serif; font-weight: 800; font-size: 3rem; text-transform: uppercase; letter-spacing: .5px; margin: 0 0 16px; }}
        .hero p {{ font-size: 1.25rem; color: #e0e0e0; max-width: 720px; margin: 0 auto 32px; }}
        .hero .btn-row {{ display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }}
        .btn {{ display: inline-block; font-family: "Fira Sans", sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; padding: 16px 32px; border-radius: 8px; transition: all .25s; cursor: pointer; border: none; font-size: 1rem; }}
        .btn-primary {{ background: {PRIMARY}; color: {DARK}; }}
        .btn-primary:hover {{ transform: translateY(-2px); box-shadow: 0 10px 25px rgba(128,222,234,.4); }}
        .btn-ghost {{ background: transparent; color: #fff; border: 2px solid rgba(255,255,255,.4); }}
        .btn-ghost:hover {{ border-color: {PRIMARY}; color: {PRIMARY}; }}
        .stats {{ background: {PRIMARY}; padding: 30px 0; }}
        .stats .grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; }}
        .stats .num {{ font-family: "Fira Sans", sans-serif; font-weight: 800; font-size: 2.2rem; color: {DARK}; }}
        .stats .lbl {{ color: {DARK}; font-weight: 600; font-size: .95rem; }}
        .section {{ padding: 70px 0; }}
        .section-head {{ text-align: center; max-width: 720px; margin: 0 auto 50px; }}
        .section-head h2 {{ font-family: "Fira Sans", sans-serif; font-weight: 800; font-size: 2.2rem; text-transform: uppercase; letter-spacing: .5px; color: {DARK}; margin: 0 0 12px; }}
        .section-head p {{ font-size: 1.1rem; }}
        .area-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }}
        .area-card {{ background: #fff; border: 1px solid #eef0f4; border-radius: 12px; padding: 26px; box-shadow: 0 4px 14px rgba(31,40,69,.05); transition: all .25s; }}
        .area-card:hover {{ box-shadow: 0 12px 30px rgba(31,40,69,.12); transform: translateY(-4px); }}
        .area-title {{ font-family: "Fira Sans", sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; color: {DARK}; font-size: 1.25rem; margin: 0 0 16px; padding-bottom: 14px; border-bottom: 3px solid {PRIMARY}; display: flex; align-items: center; gap: 8px; }}
        .niche-list {{ list-style: none; margin: 0; padding: 0; }}
        .niche-list li {{ margin: 0; }}
        .niche-list a {{ display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 7px; color: {TEXT}; font-size: .98rem; transition: all .18s; }}
        .niche-list a:hover {{ background: #f2fbfc; color: {DARK}; padding-left: 16px; }}
        .niche-list .ico {{ font-size: 1.1rem; width: 22px; text-align: center; }}
        .lead-section {{ background: #f7fafc; padding: 70px 0; }}
        .lead-wrap {{ max-width: 620px; margin: 0 auto; background: #fff; border-radius: 14px; padding: 40px; box-shadow: 0 10px 40px rgba(31,40,69,.1); }}
        .lead-wrap h2 {{ font-family: "Fira Sans", sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; color: {DARK}; text-align: center; margin: 0 0 8px; font-size: 1.8rem; }}
        .lead-wrap p.sub {{ text-align: center; margin: 0 0 28px; }}
        .lead-wrap .fields {{ display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; }}
        .lead-wrap input {{ width: 100%; padding: 14px; border: 1px solid #cbd5e0; border-radius: 8px; font-family: inherit; font-size: 1rem; }}
        .lead-wrap .fields input {{ flex: 1; min-width: 200px; }}
        .lead-wrap input:focus {{ outline: none; border-color: {PRIMARY}; box-shadow: 0 0 0 3px rgba(128,222,234,.25); }}
        .lead-wrap button {{ width: 100%; margin-top: 6px; }}
        .lead-wrap .fine {{ text-align: center; font-size: .8rem; margin-top: 14px; color: #94a3b8; }}
        .why {{ background: {DARK}; color: #fff; }}
        .why .grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }}
        .why .item h4 {{ font-family: "Fira Sans", sans-serif; text-transform: uppercase; letter-spacing: .5px; color: {PRIMARY}; margin: 0 0 10px; font-size: 1.15rem; }}
        .why .item p {{ color: #cbd5e0; margin: 0; }}
        .faq-item {{ background: #fff; border: 1px solid #eef0f4; border-radius: 10px; padding: 22px 24px; margin-bottom: 16px; }}
        .faq-q {{ font-family: "Fira Sans", sans-serif; font-weight: 600; font-size: 1.1rem; color: {DARK}; }}
        .faq-a {{ margin-top: 10px; }}
        .site-footer {{ background: #12182b; color: #8896b3; padding: 40px 0; text-align: center; }}
        .site-footer a {{ color: {PRIMARY}; }}
        @media (max-width: 900px) {{
            .area-grid {{ grid-template-columns: repeat(2, 1fr); }}
            .why .grid {{ grid-template-columns: 1fr; }}
            .stats .grid {{ grid-template-columns: repeat(2, 1fr); }}
            .hero h1 {{ font-size: 2.1rem; }}
        }}
        @media (max-width: 600px) {{ .area-grid {{ grid-template-columns: 1fr; }} }}
    </style>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{{
        "@type": "Question",
        "name": "What areas of Las Vegas do you serve?",
        "acceptedAnswer": {{ "@type": "Answer", "text": "We provide local SEO services throughout the entire Las Vegas valley, including Henderson, Summerlin, North Las Vegas, Paradise, Spring Valley, Enterprise, Sunrise Manor, Centennial Hills and Green Valley." }}
      }}, {{
        "@type": "Question",
        "name": "Do you offer industry-specific SEO?",
        "acceptedAnswer": {{ "@type": "Answer", "text": "Yes, we specialize in SEO for various industries including dental practices, law firms, real estate agents, HVAC contractors, plumbers, and medical spas in the Nevada market." }}
      }}, {{
        "@type": "Question",
        "name": "How long does it take to rank in local Las Vegas search?",
        "acceptedAnswer": {{ "@type": "Answer", "text": "Timing depends on the website, competition, business history, and work required. We establish a baseline and track qualified traffic and leads without guaranteeing rankings." }}
      }}]
    }}
    </script>
</head>
<body>
    <header class="site-header">
        <div class="container inner">
            <a href="index.html" class="brand">NSM Prime</a>
            <nav class="site-nav">
                <a href="index.html">Home</a>
                <a href="services.html">Services</a>
                <a href="seo-hub.html">SEO</a>
                <a href="contacts.html">Contact</a>
            </nav>
        </div>
    </header>
    <section class="hero">
        <div class="container">
            <span class="eyebrow">Serving the Entire Las Vegas Valley</span>
            <h1>Las Vegas Local SEO Service Areas</h1>
            <p>Specialized, industry-specific local SEO for businesses across every Las Vegas neighborhood. Find your area and industry to see how we help you dominate local search.</p>
            <div class="btn-row">
                <a href="#lead" class="btn btn-primary">Get My Free SEO Audit</a>
                <a href="#areas" class="btn btn-ghost">Browse Service Areas</a>
            </div>
        </div>
    </section>
    <section class="stats">
        <div class="container">
            <div class="grid">
                <div><div class="num">9</div><div class="lbl">Neighborhoods Served</div></div>
                <div><div class="num">100+</div><div class="lbl">Niche Markets</div></div>
                <div><div class="num">Data-Driven</div><div class="lbl">Local SEO Strategy</div></div>
                <div><div class="num">Valley-Wide</div><div class="lbl">Coverage</div></div>
            </div>
        </div>
    </section>
    <section class="section" id="areas">
        <div class="container">
            <div class="section-head">
                <h2>Select Your Neighborhood &amp; Industry</h2>
                <p>We build tailored local SEO strategies for each community and industry across the valley.</p>
            </div>
            <div class="area-grid">
{cards_html}
            </div>
        </div>
    </section>
    <section class="lead-section" id="lead">
        <div class="container">
            <div class="lead-wrap">
                <h2>Get Your Free Local SEO Audit</h2>
                <p class="sub">Tell us about your business and we'll show you exactly how to outrank your local competitors.</p>
                <form action="https://formsubmit.co/noam@nsmprime.com" method="POST">
                    <input type="hidden" name="_subject" value="New Local SEO Lead - Service Areas Page">
                    <input type="hidden" name="_captcha" value="false">
                    <input type="hidden" name="_template" value="table">
                    <input type="hidden" name="_next" value="https://nsmprime.com/thank-you">
                    <input type="text" name="_honey" style="display:none">
                    <div class="fields">
                        <input type="text" name="name" placeholder="Your Name" required>
                        <input type="tel" name="phone" placeholder="Phone Number" required>
                    </div>
                    <input type="email" name="email" placeholder="Email Address" required style="margin-bottom:14px;">
                    <input type="url" name="website" placeholder="Your Website (optional)" style="margin-bottom:14px;">
                    <button type="submit" class="btn btn-primary">Get My Free Audit</button>
                    <p class="fine">We respect your privacy. Your info is only used to contact you about your request.</p>
                </form>
            </div>
        </div>
    </section>
    <section class="section why">
        <div class="container">
            <div class="section-head">
                <h2 style="color:#fff;">Why Local SEO?</h2>
                <p style="color:#cbd5e0;">Dominating your local neighborhood search results is the most cost-effective way to acquire new customers in Las Vegas.</p>
            </div>
            <div class="grid">
                <div class="item"><h4>Hyper-Local Reach</h4><p>Show up when nearby customers search "near me" for your exact services in your neighborhood.</p></div>
                <div class="item"><h4>Higher Intent Leads</h4><p>Local searchers are ready to buy. Ranking locally captures customers at the moment of decision.</p></div>
                <div class="item"><h4>Lasting ROI</h4><p>Unlike ads that stop the moment you stop paying, local SEO keeps generating leads month after month.</p></div>
            </div>
        </div>
    </section>
    <section class="section">
        <div class="container" style="max-width:820px;">
            <div class="section-head"><h2>Frequently Asked Questions</h2></div>
            <div class="faq-item">
                <div class="faq-q">What areas of Las Vegas do you serve?</div>
                <div class="faq-a">We provide local SEO services throughout the entire Las Vegas valley, including Henderson, Summerlin, North Las Vegas, Paradise, Spring Valley, Enterprise, Sunrise Manor, Centennial Hills and Green Valley.</div>
            </div>
            <div class="faq-item">
                <div class="faq-q">Do you offer industry-specific SEO?</div>
                <div class="faq-a">Yes, we specialize in SEO for various industries including dental practices, law firms, real estate agents, HVAC contractors, plumbers, and medical spas in the Nevada market.</div>
            </div>
            <div class="faq-item">
                <div class="faq-q">How long does it take to rank?</div>
                <div class="faq-a">Timing depends on your website, competition, and the work required. We establish a baseline and focus on growing qualified local traffic and leads.</div>
            </div>
        </div>
    </section>
    <footer class="site-footer">
        <div class="container">
            <p>&copy; 2026 NSM Prime Media Group. All rights reserved.</p>
            <p><a href="index.html">Home</a> &nbsp;&middot;&nbsp; <a href="services.html">Services</a> &nbsp;&middot;&nbsp; <a href="contacts.html">Contact</a> &nbsp;&middot;&nbsp; <a href="mailto:noam@nsmprime.com">noam@nsmprime.com</a></p>
        </div>
    </footer>
</body>
</html>
'''

with open(SRC, 'w', encoding='utf-8') as fh:
    fh.write(new_html)

total = sum(len(v) for v in grouped.values())
print(f'Rebuilt {SRC} with {total} links across {len([v for v in grouped.values() if v])} areas')
