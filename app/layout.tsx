import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'NSM Prime Media Group - Digital Marketing Blog',
    template: '%s | NSM Prime Media Group'
  },
  description: 'Expert digital marketing insights, SEO strategies, web development trends, and business growth tips from Las Vegas industry leaders.',
  keywords: ['digital marketing', 'SEO', 'web development', 'Las Vegas', 'marketing agency', 'social media', 'PPC', 'content marketing'],
  authors: [{ name: 'NSM Prime Media Group' }],
  creator: 'NSM Prime Media Group',
  publisher: 'NSM Prime Media Group',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nsmprime.com'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'v9SyE8Pr3XukCvGI24RZzG9qth6P_qMvdK8m8Sp_d_s',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nsmprime.com',
    siteName: 'NSM Prime Media Group',
    title: 'NSM Prime Media Group - Digital Marketing Experts',
    description: 'Las Vegas digital marketing agency specializing in SEO, web development, and business growth strategies.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'NSM Prime Media Group - Digital Marketing Experts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NSM Prime Media Group - Digital Marketing Experts',
    description: 'Las Vegas digital marketing agency specializing in SEO, web development, and business growth strategies.',
    creator: '@nsmprime',
    images: ['/images/twitter-card.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}