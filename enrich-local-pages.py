#!/usr/bin/env python3
"""Insert hand-written, pair-specific content into the 15 indexable local SEO pages.

Run from the repo root:  python3 enrich-local-pages.py
Idempotent: pages that already contain the marker are skipped.
Content rules: no invented statistics, prices, reviews or client results.
Examples are labeled as illustrative scenarios.
"""
import json
import re

MARKER = '<!-- local-deep-dive -->'

CITY = {
    'henderson': 'Henderson',
    'summerlin': 'Summerlin',
    'north-las-vegas': 'North Las Vegas',
}
IND = {
    'dentists': ('Dentists', 'dental practice'),
    'lawyers': ('Lawyers', 'law firm'),
    'plumbers': ('Plumbers', 'plumbing company'),
    'hvac-contractors': ('HVAC Contractors', 'HVAC company'),
    'roofing-companies': ('Roofing Companies', 'roofing company'),
}

# (city, industry) -> dict(local, example, plan[3], faqs[3 of (q, a)])
D = {}

D[('henderson', 'dentists')] = dict(
    local="Henderson patients tend to choose a dentist the way they choose a neighborhood: close to home, recommended by a neighbor, and then checked online. Practices near Green Valley Ranch and St. Rose Parkway compete differently from those by the Water Street District, or out in Anthem and Inspirada, where newer households are still looking for a first dentist after moving in. \"Dentist near me\" searches usually resolve to the nearest few practices in the map results, so the real distance from your front door matters more than the city name in your title. The profile pin, the service-area wording and the new-patient pages should all describe the part of Henderson you actually serve.",
    example="A family practice off Eastern Avenue has one generic \"Dentist in Henderson\" page and a Google Business Profile with no services filled in. We would add separate pages for emergency dental visits, new-patient exams and accepted insurance plans, complete every service and attribute in the profile, and start a routine of photo and Q&A updates. Success is tracked as calls, direction requests and booking clicks from the profile, reported monthly, not rankings alone.",
    plan=[
        "Days 1–30: audit the Business Profile, fix name/address/phone mismatches across directories, and publish a clear insurance and payment page.",
        "Days 31–60: build dedicated pages for emergency visits and new patients, and set up an ethical review-request step after appointments.",
        "Days 61–90: review calls and direction requests by source, then tighten the pages and profile categories that bring in booked appointments.",
    ],
    faqs=[
        ("Should my Henderson dental office have separate pages for Green Valley and Anthem?",
         "Only if you can say something genuinely different about patients in each area, such as parking, hours or drive time. One strong page with accurate area details performs better than several near-identical pages, which search engines often decline to index."),
        ("How should a Henderson dentist reply to online reviews without breaking HIPAA?",
         "Do not confirm that the reviewer is a patient or mention any treatment details. A safe reply thanks them, states your general standards of care, and invites them to call the office. Check current HHS guidance and, if unsure, ask your compliance advisor."),
        ("How long does dental SEO take to show results in Henderson?",
         "Profile and listing fixes can change calls within weeks. New service pages usually need a few months to be crawled, indexed and trusted. Nobody can promise a ranking, so we report on calls, form submissions and booked appointments instead."),
    ])

D[('henderson', 'lawyers')] = dict(
    local="Henderson has its own municipal court and justice court, but many matters still end up at the Regional Justice Center in downtown Las Vegas, and clients often ask how far the office is from each. A Henderson law firm that states its practice areas and courthouse familiarity plainly earns more trust than one using broad promises. Henderson also has large 55+ communities such as Sun City Anthem and many longtime homeowners, which makes estate planning, probate and elder law a steady source of searches alongside family law and personal injury. Nevada's Rules of Professional Conduct govern lawyer advertising, so every page should avoid guarantees of outcomes and make clear that past results do not predict future ones.",
    example="A two-attorney firm near the Henderson Justice Court lists every practice area on one long page. We would split estate planning, divorce and custody, and injury claims into separate pages, each with a plain-language process explanation and the firm's real credentials. Intake forms ask for the case type so each lead can be traced back to the page that produced it.",
    plan=[
        "Days 1–30: audit the Business Profile category and attorney bios, confirm consistent listings, and review current pages against the Nevada advertising rules.",
        "Days 31–60: publish one page per core practice area with a clear consultation process and a short FAQ written by the attorneys.",
        "Days 61–90: track call and form leads by practice area, and adjust the pages that bring in the right kind of matters.",
    ],
    faqs=[
        ("Can a Henderson law firm use client testimonials on its website?",
         "Rules on testimonials and results in attorney advertising are set by the Nevada State Bar and the Nevada Rules of Professional Conduct. Review the current rules before publishing anything, and never imply guaranteed outcomes."),
        ("Is it better to target \"Henderson lawyer\" or specific practice areas?",
         "Practice-area searches such as estate planning, divorce or injury claims usually show clearer intent. A strong site covers both: a Henderson firm overview plus a separate page for each practice area you actually handle."),
        ("How do Henderson law firms get found by 55+ clients planning estates?",
         "Clear pages on wills, trusts and probate help, along with a profile that shows accessible office details and accurate hours. Educational content that answers the questions older clients actually ask tends to earn more trust than sales language."),
    ])

D[('henderson', 'plumbers')] = dict(
    local="Water across the Las Vegas valley is notably hard, so Henderson homeowners regularly deal with scale buildup, water-heater wear and fixtures that clog or fail early. That produces steady searches for water-heater replacement, water softener installation, leak repair and repiping, in addition to emergency calls. Henderson mixes older tract homes with new construction in Inspirada and Anthem, so a plumbing company that explains how it handles both earns more trust than one using generic copy. Nevada requires contractors to be licensed, and the licence number is normally expected in advertising, so verify the current requirement with the Nevada State Contractors Board and show it clearly on the site.",
    example="A Henderson plumbing company has a single services page and an incomplete profile. We would build separate pages for water heaters, drain cleaning and leak detection, each describing the actual steps of a visit and what the customer should expect to hear on the phone. The profile gets the right primary category, all services, the service area and the licence number. Tracked outcomes are calls and booked jobs, split by service.",
    plan=[
        "Days 1–30: set the profile's service area and categories, add the contractor licence number, and standardize listings.",
        "Days 31–60: publish water-heater, drain and leak-repair pages with plain explanations of process and what influences the price.",
        "Days 61–90: review call tracking by service and area, then add pages or hours based on the jobs that matter most.",
    ],
    faqs=[
        ("Should a Henderson plumber list a service area or a storefront address on Google?",
         "If you travel to customers and do not receive walk-ins, a service-area business listing is usually the right choice. Follow Google's guidelines, list only areas you genuinely serve, and keep the address consistent with your records."),
        ("Do plumbers in Henderson need to show their contractor licence number online?",
         "Nevada licensing rules generally expect a licence number in advertising. Confirm the current requirement with the Nevada State Contractors Board and place the number in the site footer and on key pages."),
        ("Are emergency plumbing pages worth building for Henderson?",
         "Yes, if you really offer fast response. The page should state your actual hours, the areas you reach, and what happens after the call. Avoid claiming 24/7 service unless you provide it every day."),
    ])

D[('henderson', 'hvac-contractors')] = dict(
    local="Henderson summers regularly push past 105 degrees, so air-conditioning failures are urgent and demand arrives in sharp seasonal waves from May through September. Searchers in that moment want a nearby company that can answer, give an honest arrival window and explain the likely repair. Outside the peak, the opportunity moves to tune-ups, maintenance plans and replacing aging systems in the older Henderson tracts, while newer homes in Inspirada and Anthem bring warranty and efficiency questions. An HVAC company's site should therefore separate emergency repair, replacement and maintenance, and should say what each visit involves and what affects the cost.",
    example="A Henderson HVAC company relies on one page for everything and has no maintenance offer. We would build an emergency repair page that states real hours and service areas, a replacement page that explains how system size and efficiency are chosen, and a seasonal maintenance page that is promoted in March and April. Results are measured as calls and booked jobs by season, not clicks alone.",
    plan=[
        "Days 1–30: prepare before the heat: fix the profile, hours and service area, and add the contractor licence details.",
        "Days 31–60: publish repair, replacement and maintenance pages and test the call and form tracking.",
        "Days 61–90: compare lead quality by service, then tune next season's maintenance and replacement campaigns.",
    ],
    faqs=[
        ("When should Henderson HVAC companies start their SEO work for summer?",
         "Ideally in late winter or early spring. Profile and page changes need time to be crawled and trusted, so work started in April has a much better chance of helping in June than work started during the first heat wave."),
        ("What should a Henderson AC repair page include?",
         "Actual hours, the neighborhoods you reach, how a visit works, what influences the repair cost, and a clear way to call. Vague promises of the lowest price are less useful to customers than a clear explanation of the process."),
        ("Do maintenance plans help HVAC SEO in Henderson?",
         "They give you a reason for customers to return and a page that answers off-season searches. Describe exactly what each visit covers, so the offer is clear and honest."),
    ])

D[('henderson', 'roofing-companies')] = dict(
    local="Roofs in Henderson face intense sun for most of the year and occasional monsoon storms in late summer, which is why homeowners search for leak repair, tile roof repair, underlayment replacement and foam or flat roof work. Many Henderson homes use concrete or clay tile, and it is the underlayment beneath the tile that often fails first, so a roofing company that explains that difference earns credibility. Storm events can send a burst of searches about inspections and insurance claims. Contractor licensing is mandatory in Nevada, so show the licence information openly, and never suggest that a claim will be approved.",
    example="A Henderson roofer shows only a gallery of finished jobs. We would add pages for tile roof repair, underlayment replacement and storm inspections, each with a short explanation of how the work is scoped and what a written estimate includes. The profile would gain service categories, the licence number and recent project photos taken with owner permission.",
    plan=[
        "Days 1–30: audit the profile, licence details and listings, and gather project photos with permission.",
        "Days 31–60: publish pages for the main roof types and repair types, with clear explanations of inspection and estimate steps.",
        "Days 61–90: add a storm-response page ready for the monsoon season and track which pages lead to estimate requests.",
    ],
    faqs=[
        ("Why is the underlayment important for tile roofs in Henderson?",
         "On many tile roofs the tiles last far longer than the layer under them, which breaks down in the heat. A page that explains this in plain terms helps homeowners understand why a repair or re-roof might be needed."),
        ("Can a Henderson roofer advertise insurance claim help?",
         "You can describe how you document damage and provide estimates, but avoid promising claim approval or acting as the homeowner's adjuster unless you are licensed to. Check Nevada rules and keep wording factual."),
        ("How does SEO help a roofer after a monsoon storm?",
         "A ready storm-inspection page, an accurate profile and visible reviews help you appear when the searches spike. Preparing before the season matters more than reacting once storms arrive."),
    ])

D[('summerlin', 'dentists')] = dict(
    local="Summerlin patients often look for more than a routine cleaning: cosmetic dentistry, implants, clear aligners and full-mouth planning come up often in searches, and people comparing those options read a practice's site carefully. Located on the valley's west side near Downtown Summerlin and Red Rock Canyon, the area is spread over several villages, so the neighborhoods you actually serve, such as The Ridges, Summerlin South and Summerlin West, should be described honestly. Before-and-after galleries are useful only if patients have consented to them, and each treatment page should explain the process, timeline and financing in plain language.",
    example="A Summerlin cosmetic practice lists all procedures in one paragraph. We would give implants, clear aligners and veneers their own pages, each explaining who is a candidate, how many visits are involved and how financing works. A consultation request form asks which treatment the visitor is considering, so the practice can see which page generated each inquiry.",
    plan=[
        "Days 1–30: audit the profile, doctor bios and credentials, and confirm patient consent for every photo used.",
        "Days 31–60: publish separate treatment pages with process, timelines and financing details.",
        "Days 61–90: review consultation requests by treatment page and refine messaging and profile services accordingly.",
    ],
    faqs=[
        ("How should a Summerlin cosmetic dentist show results online?",
         "Use only photos from patients who gave written consent, label them accurately, and explain that results vary. Do not retouch images, and keep any claims consistent with dental board advertising rules."),
        ("Does a Summerlin dental practice need pages for each village?",
         "Not usually. One page with accurate information about the villages you serve is generally better than many thin pages. Add a separate page only when you have distinct information to give."),
        ("Do reviews matter more for high-value dental treatments?",
         "Patients considering implants or full smile work tend to research carefully, so recent, genuine reviews and clear doctor credentials carry weight. Ask all patients in the same ethical way and never filter who is asked."),
    ])

D[('summerlin', 'lawyers')] = dict(
    local="Summerlin clients often seek advisors for estate planning, business matters, family law and real estate transactions, and many compare firms by credentials and clarity rather than by price. The Regional Justice Center is in downtown Las Vegas, a drive from Summerlin along the 215 Beltway and US-95, and firms near Howard Hughes Parkway or Town Center Drive can clarify whether they also meet clients remotely. Attorney biographies, bar admissions and plain explanations of each practice area form the core of a trustworthy site. Nevada's attorney advertising rules apply, so avoid outcome guarantees and ensure any comparative claims are verifiable.",
    example="A Summerlin business and estate firm has a single \"Our Practice\" page. We would build separate pages for estate planning, business formation and contract review, each led by an attorney's own explanation of how a first meeting works and what documents to bring. The site would offer remote consultations clearly, since some Summerlin clients prefer not to travel.",
    plan=[
        "Days 1–30: review attorney bios, bar information, profile category and consistent listings.",
        "Days 31–60: publish one page per practice area with a first-meeting explanation and a short FAQ.",
        "Days 61–90: track inquiries by practice area and adjust pages, hours and remote-consultation messaging.",
    ],
    faqs=[
        ("How can a Summerlin law firm show expertise without breaking advertising rules?",
         "Describe your actual experience and education factually, avoid words that imply guaranteed results, and include required disclaimers. Review the Nevada Rules of Professional Conduct, or ask the State Bar, before publishing."),
        ("Should a Summerlin attorney publish articles?",
         "Helpful, accurate articles that answer real client questions, such as what a trust does or how probate works, can build trust. Keep them current and attributed to the attorney who wrote or reviewed them."),
        ("Do Summerlin clients expect remote consultations?",
         "Many do for initial conversations. If you offer video or phone meetings, say so plainly on the contact page and in the profile, along with how documents are shared securely."),
    ])

D[('summerlin', 'plumbers')] = dict(
    local="Summerlin homes are generally newer and larger, often within HOA communities, so plumbing searches lean toward tankless water heaters, water softeners, whole-home filtration, repiping and remodels, in addition to emergency leaks. Valley water is hard, which makes softening and descaling a recurring topic. Customers tend to expect clear communication, tidy work and an upfront explanation of the scope, particularly in custom homes in The Ridges or the gated villages, where access and HOA rules can matter. A plumbing company's pages should describe how it handles these jobs, the brands or approaches it favors, and its licence details.",
    example="A Summerlin plumber has only an emergency page. We would add pages for tankless water heater installation, water softeners and repiping, each explaining how a quote is prepared and what the home visit includes. The profile would include these services, and the call tracking would show which service pages lead to booked work.",
    plan=[
        "Days 1–30: tidy the profile, service area and licence details, and standardize listings.",
        "Days 31–60: publish pages for tankless heaters, softeners and repiping with plain scope and quote explanations.",
        "Days 61–90: review booked work by service page and decide which services to promote next.",
    ],
    faqs=[
        ("What do Summerlin homeowners search for besides emergency plumbing?",
         "Common planned jobs include tankless water heater installation, water softeners, repiping and bathroom or kitchen remodel plumbing. Pages for these projects capture searches that are less rushed and often more profitable."),
        ("Should a plumber mention HOA rules on Summerlin pages?",
         "If you regularly handle HOA-related work, explain what you do, such as coordinating access or following community guidelines. Don't imply any official affiliation with an HOA or community association."),
        ("How should a Summerlin plumber explain pricing online?",
         "Explain the factors that affect the cost, such as access, equipment and scope, and describe how estimates are given. If you list prices, make sure they are current and stated honestly."),
    ])

D[('summerlin', 'hvac-contractors')] = dict(
    local="Summerlin's larger homes often have multiple air-conditioning units, zoned systems and high ceilings, so a repair or replacement can be a bigger decision than in a small house. Customers search for dual-system replacement, high-efficiency upgrades, smart thermostats and air-quality add-ons as well as emergency repair during the long cooling season. Many homes have tile roofs and rooftop or attic equipment, which affects how quickly work can be scheduled and how it is quoted. The website should explain how load calculations and equipment choices are made, and be clear about the warranties offered.",
    example="A Summerlin HVAC contractor lists \"AC repair and installation\" in one line. We would create pages for multi-system replacement, zoning and air quality, each explaining how the home is evaluated before a quote is given. A written-estimate request form asks for home size and the number of systems, so the team can respond with useful information.",
    plan=[
        "Days 1–30: fix the profile, hours, licence information and service area before the cooling season.",
        "Days 31–60: publish replacement, zoning and air-quality pages that explain evaluation and quoting.",
        "Days 61–90: compare lead quality by page and refine the offers and call handling for larger projects.",
    ],
    faqs=[
        ("How should an HVAC company explain system sizing for large Summerlin homes?",
         "Explain that equipment is chosen based on a load calculation of the home, not just square footage, and describe what you measure. Clear explanations build more trust than claims about brand or price alone."),
        ("Do air-quality services belong on a Summerlin HVAC site?",
         "If you provide them, yes. Describe what each product actually does and avoid health claims you cannot support. Link these pages from the main installation and maintenance pages."),
        ("When is the best time for Summerlin HVAC SEO work?",
         "Late winter and early spring, before the cooling season. Changes made then have time to be indexed and trusted before demand peaks."),
    ])

D[('summerlin', 'roofing-companies')] = dict(
    local="Concrete tile is a common roofing material across Summerlin's villages, and many neighborhoods have architectural review requirements that affect materials and colors, so a roofing company's pages should explain how it handles approvals and matching. Homeowners search for tile repair, underlayment replacement, leak detection and re-roofing, and larger homes with complex rooflines raise questions about scope, access and safety. Monsoon storms in late summer can create short bursts of inspection searches. Licensing is required in Nevada, so show licence details openly, and avoid any promises about insurance claims.",
    example="A Summerlin roofing company shows a photo gallery and a phone number. We would add pages explaining tile roof repair, underlayment replacement and HOA approval support, each including what a written estimate covers and how the crew protects landscaping and property. Project photos are published only with homeowner permission.",
    plan=[
        "Days 1–30: audit the profile and licence details, and collect permission-based project photos.",
        "Days 31–60: publish pages on tile repair, underlayment replacement and the approval process.",
        "Days 61–90: prepare a storm-inspection page before late summer and track estimate requests by page.",
    ],
    faqs=[
        ("Do Summerlin roofers need to know about HOA review?",
         "Many communities have design review, so explaining that you help prepare material and color information for submission is useful. Be accurate about what you do and don't imply authority you lack."),
        ("What should a roofing estimate page explain?",
         "What is inspected, how the scope and materials are described, how the price is presented in writing and what warranty applies. Clear steps help a homeowner compare quotes fairly."),
        ("How do roofers get found for tile roof repair in Summerlin?",
         "With a dedicated page for the service, an accurate profile and photos of real work. Mentioning real areas you serve helps, as long as the page contains useful information beyond place names."),
    ])

D[('north-las-vegas', 'dentists')] = dict(
    local="North Las Vegas is its own incorporated city, with fast-growing newer areas around Aliante and older established neighborhoods closer to Craig Road and Cheyenne Avenue, and its residents include a significant Spanish-speaking community. For dental practices, that means patients often search for affordable care, family appointments and payment options, and some prefer information in Spanish. A practice that explains accepted insurance, payment plans and what happens at a first visit removes common barriers. If staff speak Spanish, say so on the page and in the profile. Accurate hours matter too, since many patients plan visits around work schedules.",
    example="A North Las Vegas family office has an English-only site with no insurance information. We would add a clear page on accepted insurance and payment options, a new-patient page describing the first visit step by step, and, if staff are fluent, a Spanish-language version of those two pages. The profile lists languages spoken and hours that match the office.",
    plan=[
        "Days 1–30: correct the profile, hours and listings, and gather accurate insurance and payment information.",
        "Days 31–60: publish insurance, new-patient and (if applicable) Spanish-language pages.",
        "Days 61–90: review calls and bookings by page, and adjust based on which questions patients ask most.",
    ],
    faqs=[
        ("Should a North Las Vegas dentist offer Spanish-language pages?",
         "If your staff genuinely provide care in Spanish, yes, because it helps patients find and trust you. Use accurate translation, ideally reviewed by a fluent team member, and don't advertise language support you cannot offer."),
        ("How should a dental office present payment options?",
         "State the insurance plans you accept, any in-house payment plans and third-party financing in plain language, and keep it current. Avoid hidden conditions in the fine print."),
        ("Is North Las Vegas separate from Las Vegas for local search?",
         "Yes, it is a separate city, and many residents search with \"North Las Vegas\" or neighborhood names. Make sure your listing and pages reflect the correct city and address."),
    ])

D[('north-las-vegas', 'lawyers')] = dict(
    local="North Las Vegas has its own municipal court, and residents often need help with traffic and criminal matters, immigration, personal injury, workers' compensation, family law and small-business issues. Clients may search in Spanish, and many make their first contact by phone, so clear intake information and honest language about fees matter. A firm's pages should explain how a first call works, which matters it handles and which it refers elsewhere. Nevada's attorney advertising rules apply, so avoid guaranteeing outcomes, and be careful with any claims about results or specialization.",
    example="A North Las Vegas firm handles traffic, injury and immigration matters on a single page. We would give each area a separate page describing how a first call works, what information the client should bring and how fees are explained. If the firm's staff speak Spanish, the intake page says so and offers a Spanish-language version of the key information.",
    plan=[
        "Days 1–30: review attorney bios, profile category, listings and advertising language.",
        "Days 31–60: publish one page per practice area with a clear first-call explanation and intake steps.",
        "Days 61–90: track phone and form inquiries by practice area and adjust the pages that bring appropriate matters.",
    ],
    faqs=[
        ("Can a North Las Vegas law firm advertise in Spanish?",
         "Yes, provided the content is accurate and follows the same professional conduct rules. Have a qualified bilingual person review translations, and state clearly which attorneys and staff speak the language."),
        ("Should a firm mention the North Las Vegas Municipal Court?",
         "If your attorneys appear there regularly, say so factually. Avoid implying special influence or relationships with the court or its staff."),
        ("What should a law firm explain about fees on its site?",
         "Describe how fees are generally structured, such as hourly, flat or contingency, as relevant to the matter, and that details are confirmed in writing. Do not give figures you cannot stand behind."),
    ])

D[('north-las-vegas', 'plumbers')] = dict(
    local="North Las Vegas combines older neighborhoods, where aging pipes, water heaters and drains lead to repairs, with newer developments in Aliante and the northern edge of the city, where warranty questions and new-build punch-list items arise. Industrial and commercial growth in areas such as Apex also creates demand for commercial plumbing. Response time and clear communication are central for residents, and some prefer to speak Spanish. A plumbing company's pages should describe what it fixes, how fast it can realistically arrive, and what a visit costs to start, along with its licence details.",
    example="A North Las Vegas plumber relies on word of mouth and has an unclaimed listing. We would claim and complete the profile with the correct service area and licence number, build pages for drain cleaning, water heaters and leak repair, and add a Spanish-language contact option if staff can support it. Calls are tracked by page so the owner can see which services produce booked work.",
    plan=[
        "Days 1–30: claim and complete the profile, verify the licence details and fix listings.",
        "Days 31–60: publish pages for drain cleaning, water heaters and leak repair with an honest arrival window.",
        "Days 61–90: review call tracking by service and decide where to add commercial or new-build pages.",
    ],
    faqs=[
        ("How can a North Las Vegas plumber show realistic response times?",
         "State the hours you answer calls and the typical window for arrival, and update it when you are busy. Honest expectations lead to better reviews than promises you can't keep."),
        ("Does commercial plumbing need its own page?",
         "If you take commercial work, yes. It involves different buyers and questions, so a separate page describing the types of properties and services you handle will serve both audiences better."),
        ("Is it worth setting up a profile if most customers come by referral?",
         "Yes. Referred customers often search for your name before calling, so an accurate profile with reviews, hours and licence details reinforces the referral."),
    ])

D[('north-las-vegas', 'hvac-contractors')] = dict(
    local="North Las Vegas is growing quickly, with new construction in the northern parts of the city, established neighborhoods with aging systems, and commercial and industrial buildings around Apex that need maintenance. Cooling is a necessity here for most of the year, so HVAC searches combine emergency repair, replacement and routine maintenance. Customers value transparent quotes and reliable arrival windows, and some prefer Spanish. An HVAC contractor can separate residential and commercial pages, explain the licence and insurance it carries, and show how it supports new homeowners with warranties and service plans.",
    example="A North Las Vegas HVAC firm serves both homes and small commercial buildings but has one generic page. We would create separate residential repair, residential replacement and light-commercial maintenance pages, each describing the visit and what a written quote includes. Calls from each page are tracked so the owner can see where the best jobs come from.",
    plan=[
        "Days 1–30: complete the profile and licence information and fix the service-area wording.",
        "Days 31–60: publish residential and commercial pages and set up call tracking.",
        "Days 61–90: review lead quality, compare seasons, and plan the next maintenance campaign.",
    ],
    faqs=[
        ("Should an HVAC company separate residential and commercial pages?",
         "Yes. The buyers, questions and decision processes differ, and separate pages let each audience find relevant information quickly."),
        ("What helps new North Las Vegas homeowners choose an HVAC company?",
         "Clear explanations of warranties, maintenance plans and what a service visit includes. Simple, honest pages tend to work better than lists of technical terms."),
        ("How can an HVAC company handle seasonal demand online?",
         "Prepare pages and the profile before the cooling season, keep hours accurate during peak weeks, and update the site once the rush slows to promote maintenance."),
    ])

D[('north-las-vegas', 'roofing-companies')] = dict(
    local="Roofing demand in North Las Vegas comes from older homes whose roofs are reaching the end of their life, newer developments needing repairs or warranty work, and flat or low-slope commercial and industrial roofs in areas such as Apex. Heat is the constant stress on roofing materials, and late-summer monsoon storms add leak and damage calls. Homeowners often compare several quotes, so a roofing company should explain what its estimate includes, the materials it works with, and how it handles permits. Licensing is mandatory in Nevada, so display the licence details, and avoid any promises about insurance outcomes.",
    example="A North Las Vegas roofer handles residential re-roofs and light-commercial flat roofs but presents them together. We would write separate pages for residential re-roofing, repair after storms and commercial flat roofing, each describing how an inspection is done and what appears in a written estimate. Project photos are used only with permission.",
    plan=[
        "Days 1–30: complete the profile, display the licence details and fix listings.",
        "Days 31–60: publish residential and commercial pages with clear inspection and estimate explanations.",
        "Days 61–90: add a storm-damage page before late summer and track estimate requests by page.",
    ],
    faqs=[
        ("How long does a typical roof last in North Las Vegas?",
         "It depends on the material, installation and maintenance, and heat shortens the life of some products. A roofer should explain this honestly after an inspection instead of quoting a single number for every roof."),
        ("Should a roofer list commercial services separately?",
         "Yes. Flat and low-slope roofs involve different materials and decision makers, so a dedicated page helps those buyers and keeps the residential pages clear."),
        ("What should a roofing estimate include?",
         "The scope of work, materials, how existing roofing is handled, warranty terms, the timeline and the total price in writing. Describing this on your site helps homeowners compare quotes fairly."),
    ])


def build_block(city_slug, ind_slug, d):
    city = CITY[city_slug]
    ind_name, ind_noun = IND[ind_slug]
    h2 = f"{ind_name} in {city}: Local Details That Shape the Strategy"
    plan = ''.join(f'<li>{p}</li>' for p in d['plan'])
    return (
        f'{MARKER}\n'
        f'    <section id="local-deep-dive">\n'
        f'        <h2>{h2}</h2>\n'
        f'        <div class="content-body">\n'
        f'            <p>{d["local"]}</p>\n'
        f'            <h3>An Illustrative Scenario</h3>\n'
        f'            <p><em>This is a hypothetical example to show our approach, not a client result.</em> {d["example"]}</p>\n'
        f'            <h3>How We Would Approach the First 90 Days</h3>\n'
        f'            <ul>{plan}</ul>\n'
        f'            <p>Pricing depends on the size of your market, the number of services and the current state of your online presence, so we scope each engagement individually. <a href="/contacts.html">Contact us</a> for a quote based on your {ind_noun}.</p>\n'
        f'        </div>\n'
        f'    </section>\n'
    )


def faq_html(faqs):
    out = ''
    for q, a in faqs:
        out += ('        <div class="faq-item" style="background:#f8f9fa;border:1px solid #e9ecef;border-radius:8px;padding:22px 24px;margin-bottom:16px;">\n'
                f'            <h3 style="margin-top:0;font-size:1.25rem;color:#2d3748;">{q}</h3>\n'
                f'            <p style="margin-bottom:0;">{a}</p>\n'
                '        </div>\n')
    return out


def enrich(city_slug, ind_slug):
    fn = f'local-seo-{city_slug}-{ind_slug}.html'
    d = D[(city_slug, ind_slug)]
    h = open(fn, encoding='utf-8').read()
    if MARKER in h:
        return fn, 'skipped'
    # 1. content section before the benefits section
    anchor = '    <section id="benefits">'
    assert anchor in h, fn
    h = h.replace(anchor, build_block(city_slug, ind_slug, d) + anchor, 1)
    # 2. table of contents link
    toc_anchor = '            <li><a href="#benefits">'
    assert toc_anchor in h, fn
    ind_name = IND[ind_slug][0]
    toc = f'            <li><a href="#local-deep-dive">{ind_name} in {CITY[city_slug]}: Local Details</a></li>\n'
    h = h.replace(toc_anchor, toc + toc_anchor, 1)
    # 3. extra FAQs: insert before the closing tag of the FAQ section
    m = re.search(r'(<section id="faq">.*?)(\n    </section>)', h, re.S)
    assert m, fn
    h = h[:m.end(1)] + '\n' + faq_html(d['faqs']).rstrip('\n') + h[m.end(1):]
    # 4. FAQPage JSON-LD
    def patch_ld(mm):
        data = json.loads(mm.group(1))
        for node in data.get('@graph', []):
            if node.get('@type') == 'FAQPage':
                for q, a in d['faqs']:
                    node['mainEntity'].append({
                        '@type': 'Question', 'name': q,
                        'acceptedAnswer': {'@type': 'Answer', 'text': a}})
        return '<script type="application/ld+json">\n' + json.dumps(data, indent=2, ensure_ascii=False) + '\n</script>'
    h, n = re.subn(r'<script type="application/ld\+json">(.*?)</script>', patch_ld, h, count=1, flags=re.S)
    assert n == 1, fn
    open(fn, 'w', encoding='utf-8').write(h)
    return fn, 'enriched'


if __name__ == '__main__':
    for (c, i) in D:
        print(*enrich(c, i))
