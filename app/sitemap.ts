import { MetadataRoute } from 'next'

const locations = [
  'henderson',
  'summerlin',
  'north-las-vegas',
  'paradise',
  'spring-valley',
  'enterprise',
  'sunrise-manor',
  'centennial-hills',
  'green-valley',
]

const businessTypes = [
  'dentists',
  'real-estate-agents',
  'plumbers',
  'lawyers',
  'hvac-contractors',
  'electricians',
  'restaurants',
  'roofing-companies',
  'medical-spas',
  'fitness-centers',
  'auto-repair-shops',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nsmprime.com'
  const lastModified = new Date('2026-08-16')

  const primaryPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog/ultimate-guide-local-seo-las-vegas-2026`, lastModified, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${baseUrl}/seo-agency-las-vegas`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/seo-services-las-vegas`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ecommerce-las-vegas`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contacts.html`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/local-service-areas.html`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const localPages: MetadataRoute.Sitemap = locations.flatMap((location) =>
    businessTypes.map((businessType) => ({
      url: `${baseUrl}/local-seo-${location}-${businessType}.html`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  localPages.push({
    url: `${baseUrl}/local-seo-las-vegas-guide.html`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  })

  return [...primaryPages, ...localPages]
}
