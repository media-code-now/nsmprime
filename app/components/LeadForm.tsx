'use client';

import { useState } from 'react';

const PRIMARY = '#80deea';
const DARK_BG = '#1F2845';
const TEXT_COLOR = '#41516A';

// All lead submissions are delivered to this inbox via FormSubmit.co.
// FormSubmit works on fully static hosting (Netlify) with no backend required.
const LEAD_EMAIL = 'noam@nsmprime.com';

interface LeadFormProps {
  /** Used for the email subject line and the hidden _subject field */
  subject?: string;
  /** Text shown on the submit button */
  buttonText?: string;
  /** Show the website URL field (useful for SEO audits) */
  showWebsite?: boolean;
  /** Optional heading rendered above the form */
  heading?: string;
  /** Optional supporting copy rendered below the heading */
  subheading?: string;
  /** Dark theme places the form on a dark background */
  variant?: 'light' | 'dark';
}

export default function LeadForm({
  subject = 'New Lead from NSM Prime Website',
  buttonText = 'Request My Free Consultation',
  showWebsite = false,
  heading,
  subheading,
  variant = 'light',
}: LeadFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const inputClasses =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent';
  const headingColor = variant === 'dark' ? '#ffffff' : DARK_BG;
  const subColor = variant === 'dark' ? '#e0e0e0' : TEXT_COLOR;

  return (
    <div>
      {heading && (
        <h3
          className="text-2xl md:text-3xl font-bold mb-2 uppercase"
          style={{ fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: headingColor }}
        >
          {heading}
        </h3>
      )}
      {subheading && (
        <p className="mb-6" style={{ color: subColor }}>
          {subheading}
        </p>
      )}

      <form
        action={`https://formsubmit.co/${LEAD_EMAIL}`}
        method="POST"
        className="space-y-4"
        onSubmit={() => setSubmitting(true)}
      >
        {/* FormSubmit configuration fields */}
        <input type="hidden" name="_subject" value={subject} />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_next" value="https://nsmprime.com/thank-you" />
        {/* Honeypot for spam bots */}
        <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className={inputClasses}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className={inputClasses}
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className={inputClasses}
          required
        />

        {showWebsite && (
          <input
            type="url"
            name="website"
            placeholder="Your Website URL"
            className={inputClasses}
          />
        )}

        <textarea
          name="message"
          placeholder="Tell us about your goals (optional)"
          rows={3}
          className={inputClasses}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full text-white font-bold text-lg px-8 py-4 rounded-lg hover:opacity-90 transition duration-300 shadow-xl uppercase disabled:opacity-60"
          style={{ background: DARK_BG, fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px' }}
        >
          {submitting ? 'Sending…' : buttonText}
        </button>

        <p className="text-xs text-center" style={{ color: subColor }}>
          We respect your privacy. Your information is only used to contact you about your request.
        </p>
      </form>
    </div>
  );
}
