import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You | NSM Prime',
  description: 'Thanks for reaching out to NSM Prime. Our team will contact you shortly.',
  robots: { index: false, follow: false },
};

const PRIMARY = '#80deea';
const DARK_BG = '#1F2845';
const TEXT_COLOR = '#41516A';

export default function ThankYouPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      <div className="max-w-2xl text-center bg-white p-12 rounded-lg shadow-lg">
        <div className="text-6xl mb-6">✅</div>
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-4 uppercase"
          style={{ fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px', color: DARK_BG }}
        >
          Thank You!
        </h1>
        <p className="text-xl mb-8" style={{ color: TEXT_COLOR }}>
          Your request has been received. A member of the NSM Prime team will reach out within one business day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block font-bold text-lg px-8 py-4 rounded-lg transition duration-300 shadow-xl uppercase hover:opacity-90"
            style={{ background: PRIMARY, color: '#fff', fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px' }}
          >
            Back to Home
          </Link>
          <a
            href="tel:+19179727298"
            className="inline-block bg-gray-100 font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-200 transition duration-300 shadow-xl uppercase"
            style={{ color: TEXT_COLOR, fontFamily: '"Fira Sans", sans-serif', letterSpacing: '0.5px' }}
          >
            Call: (917) 972-7298
          </a>
        </div>
      </div>
    </div>
  );
}
