#!/usr/bin/env python3
"""
One-off migration: ensure every lead/contact form on the site collects a
required Phone and a required Service field.

Idempotent: safe to run multiple times. A form is skipped for a given field if
it already contains an input/select with that name.
"""
import glob
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))

SERVICE_OPTIONS = [
    ("", "Select Service *"),
    ("Web Development", "Web Development"),
    ("SEO", "SEO Services"),
    ("Digital Marketing", "Digital Marketing"),
    ("App Development", "App Development"),
    ("Graphic Design", "Graphic Design"),
    ("E-commerce Development", "E-commerce Development"),
    ("Video Production", "Video Production"),
    ("PPC Advertising", "PPC Advertising"),
    ("Other", "Other"),
]


def options_html(indent=""):
    return "\n".join(
        f'{indent}<option value="{v}">{label}</option>' for v, label in SERVICE_OPTIONS
    )


changed_files = []


def save(path, original, updated):
    if updated != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(updated)
        changed_files.append(os.path.relpath(path, ROOT))


# ---------------------------------------------------------------------------
# Pattern A: generated local landing pages + local-seo-las-vegas-guide.html
#   Form already has: name, phone(required), email, website(optional)
#   -> insert a required Service <select> after the website input.
# ---------------------------------------------------------------------------
LOCAL_WEBSITE_INPUT = (
    '<input type="url" name="website" placeholder="Your Website (optional)" '
    'style="width:100%;padding:12px;border:1px solid #cbd5e0;border-radius:5px;'
    'margin-bottom:12px;">'
)
LOCAL_SERVICE_SELECT = (
    '\n                <select name="service" required '
    'style="width:100%;padding:12px;border:1px solid #cbd5e0;border-radius:5px;'
    'margin-bottom:12px;background:#fff;">\n'
    + options_html("                    ")
    + "\n                </select>"
)

local_files = glob.glob(os.path.join(ROOT, "local-seo-*.html"))
local_files += [os.path.join(ROOT, "local-seo-las-vegas-guide.html")]
for path in local_files:
    if not os.path.exists(path):
        continue
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    if 'name="service"' in html:
        continue
    if LOCAL_WEBSITE_INPUT in html:
        updated = html.replace(
            LOCAL_WEBSITE_INPUT,
            LOCAL_WEBSITE_INPUT + LOCAL_SERVICE_SELECT,
            1,
        )
        save(path, html, updated)


# ---------------------------------------------------------------------------
# Pattern B: local-service-areas.html
#   Form has: name, phone(required), email, website(optional)
#   -> insert required Service <select> after website input.
# ---------------------------------------------------------------------------
SA_PATH = os.path.join(ROOT, "local-service-areas.html")
if os.path.exists(SA_PATH):
    with open(SA_PATH, "r", encoding="utf-8") as f:
        html = f.read()
    if 'name="service"' not in html:
        sa_website = (
            '<input type="url" name="website" placeholder="Your Website (optional)" '
            'style="margin-bottom:14px;">'
        )
        sa_service = (
            '\n                    <select name="service" required '
            'style="margin-bottom:14px;">\n'
            + options_html("                        ")
            + "\n                    </select>"
        )
        if sa_website in html:
            save(SA_PATH, html, html.replace(sa_website, sa_website + sa_service, 1))


# ---------------------------------------------------------------------------
# Pattern C: contacts.html
#   Form has: name, email, message. Add required Phone + Service between
#   email and message.
# ---------------------------------------------------------------------------
CONTACTS_PATH = os.path.join(ROOT, "contacts.html")
if os.path.exists(CONTACTS_PATH):
    with open(CONTACTS_PATH, "r", encoding="utf-8") as f:
        html = f.read()
    if 'name="phone"' not in html and 'name="message"' in html:
        anchor = (
            '                <div class="form-wrap form-wrap_icon linear-icon-feather">\n'
            '                  <textarea class="form-input" id="contact-message" name="message" required></textarea>\n'
            '                  <label class="form-label" for="contact-message">Your message</label>\n'
            '                </div>'
        )
        inject = (
            '                <div class="form-wrap form-wrap_icon linear-icon-telephone">\n'
            '                  <input class="form-input" id="contact-phone" type="tel" name="phone" required>\n'
            '                  <label class="form-label" for="contact-phone">Your phone</label>\n'
            '                </div>\n'
            '                <div class="form-wrap form-wrap_icon linear-icon-briefcase">\n'
            '                  <select class="form-input" id="contact-service" name="service" required>\n'
            + options_html("                    ")
            + "\n                  </select>\n"
            '                </div>\n'
        )
        if anchor in html:
            save(CONTACTS_PATH, html, html.replace(anchor, inject + anchor, 1))


# ---------------------------------------------------------------------------
# Pattern D: blog-hub.html
#   D1) Lead-magnet form: name, email, business-type(select). Add required
#       Phone (after email) + required Service (reuse business-type? no, add
#       distinct service). We add Phone + Service selects.
#   D2) Newsletter inline form: email only. Add required Phone + Service.
# ---------------------------------------------------------------------------
BLOGHUB_PATH = os.path.join(ROOT, "blog-hub.html")
if os.path.exists(BLOGHUB_PATH):
    with open(BLOGHUB_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    # D1 lead-magnet: insert phone after its email input, service after business-type
    lm_email = (
        '                    <div class="form-wrap form-wrap-validation">\n'
        '                      <input class="form-input" id="contact-email" type="email" name="email" placeholder="Your Email" data-constraints="@Email @Required">\n'
        '                    </div>'
    )
    lm_phone = (
        '\n                    <div class="form-wrap form-wrap-validation">\n'
        '                      <input class="form-input" id="lead-phone" type="tel" name="phone" placeholder="Your Phone" data-constraints="@Required">\n'
        '                    </div>'
    )
    if 'id="lead-phone"' not in html and lm_email in html:
        html = html.replace(lm_email, lm_email + lm_phone, 1)

    # add a required service select right after the business-type select block
    bt_block = (
        '                      <select class="form-input" name="business-type" data-constraints="@Required">\n'
        '                        <option value="">Select Business Type</option>\n'
        '                        <option value="agency">Marketing Agency</option>\n'
        '                        <option value="ecommerce">E-commerce</option>\n'
        '                        <option value="saas">SaaS/Tech</option>\n'
        '                        <option value="local">Local Business</option>\n'
        '                        <option value="consultant">Consultant/Freelancer</option>\n'
        '                        <option value="other">Other</option>\n'
        '                      </select>\n'
        '                    </div>'
    )
    bt_service = (
        '\n                    <div class="form-wrap form-wrap-validation">\n'
        '                      <select class="form-input" name="service" data-constraints="@Required">\n'
        + options_html("                        ")
        + "\n                      </select>\n"
        '                    </div>'
    )
    if 'name="service"' not in html.split("Get Your Free Toolkit")[-1].split("</form>")[0] if "Get Your Free Toolkit" in html else True:
        if bt_block in html and bt_service.strip() not in html:
            html = html.replace(bt_block, bt_block + bt_service, 1)

    # D2 newsletter inline form (email only) -> add phone + service before button
    nl_form_anchor = (
        '              <form class="rd-form rd-mailform form-inline" action="https://formsubmit.co/noam@nsmprime.com" method="post">\n'
        '                <div class="form-wrap form-wrap-validation">\n'
        '                  <input class="form-input" id="newsletter-email" type="email" name="email" placeholder="Enter your email address" data-constraints="@Email @Required">\n'
        '                </div>'
    )
    nl_add = (
        '\n                <div class="form-wrap form-wrap-validation">\n'
        '                  <input class="form-input" id="newsletter-phone" type="tel" name="phone" placeholder="Your phone" data-constraints="@Required">\n'
        '                </div>\n'
        '                <div class="form-wrap form-wrap-validation">\n'
        '                  <select class="form-input" name="service" data-constraints="@Required">\n'
        + options_html("                    ")
        + "\n                  </select>\n"
        '                </div>'
    )
    if 'id="newsletter-phone"' not in html and nl_form_anchor in html:
        html = html.replace(nl_form_anchor, nl_form_anchor + nl_add, 1)

    with open(BLOGHUB_PATH, "r", encoding="utf-8") as f:
        original = f.read()
    save(BLOGHUB_PATH, original, html)


# ---------------------------------------------------------------------------
# Pattern E: blog theme templates (contact "Leave a reply" + subscribe).
#   Files: standard-post, quote-post, image-post, gallery-post, classic-blog
#   E1 contact form: make phone required + add required Service before message.
#   E2 subscribe form: add required Phone + Service before submit button.
# ---------------------------------------------------------------------------
TEMPLATE_FILES = [
    "standard-post.html",
    "quote-post.html",
    "image-post.html",
    "gallery-post.html",
    "classic-blog.html",
]

# E1 contact phone -> required
phone_before = (
    '                    <input class="form-input" id="contact-phone" type="text" name="phone" data-constraints="@Numeric">'
)
phone_after = (
    '                    <input class="form-input" id="contact-phone" type="text" name="phone" data-constraints="@Required">'
)

# E1 service select inserted before the message form-wrap
msg_anchor = (
    '                  <div class="form-wrap form-wrap_icon linear-icon-feather">\n'
    '                    <textarea class="form-input" id="contact-message" name="message" data-constraints="@Required"></textarea>\n'
    '                    <label class="form-label" for="contact-message">Your message</label>\n'
    '                  </div>'
)
service_block = (
    '                  <div class="form-wrap form-wrap_icon linear-icon-briefcase">\n'
    '                    <select class="form-input" name="service" data-constraints="@Required">\n'
    + options_html("                      ")
    + "\n                    </select>\n"
    '                  </div>\n'
)

# E2 subscribe form: add phone + service before the submit button
sub_email_anchor = (
    '                  <div class="form-wrap form-wrap_icon linear-icon-envelope">\n'
    '                    <input class="form-input" id="contact-email-blog-post" type="email" name="email" data-constraints="@Email @Required">\n'
    '                    <label class="form-label" for="contact-email-blog-post">Enter please your e-mail</label>\n'
    '                  </div>'
)
sub_add = (
    '\n                  <div class="form-wrap form-wrap_icon linear-icon-telephone">\n'
    '                    <input class="form-input" type="tel" name="phone" placeholder="Your phone" data-constraints="@Required">\n'
    '                  </div>\n'
    '                  <div class="form-wrap form-wrap_icon linear-icon-briefcase">\n'
    '                    <select class="form-input" name="service" data-constraints="@Required">\n'
    + options_html("                      ")
    + "\n                    </select>\n"
    '                  </div>'
)

for name in TEMPLATE_FILES:
    path = os.path.join(ROOT, name)
    if not os.path.exists(path):
        continue
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    original = html

    # make contact phone required
    if phone_before in html:
        html = html.replace(phone_before, phone_after)

    # add service to contact form (only where message anchor exists & no service yet)
    if msg_anchor in html and '<select class="form-input" name="service"' not in html:
        html = html.replace(msg_anchor, service_block + msg_anchor, 1)

    # add phone + service to subscribe form
    if sub_email_anchor in html and 'name="phone"' not in html.split(sub_email_anchor)[1].split("</form>")[0]:
        html = html.replace(sub_email_anchor, sub_email_anchor + sub_add, 1)

    save(path, original, html)


print(f"Updated {len(changed_files)} file(s).")
for c in sorted(changed_files):
    print("  ", c)
