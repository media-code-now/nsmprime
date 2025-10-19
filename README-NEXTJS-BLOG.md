# NSM Prime Media Group - Next.js Blog

A comprehensive Next.js blog application with SEO optimization, accessibility features, and structured data markup.

## Features

### 🚀 Core Features
- **App Router Architecture**: Modern Next.js 14 with app directory structure
- **TypeScript Support**: Full type safety throughout the application
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Complete meta tags, Open Graph, and Twitter cards
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support

### 📊 Blog Functionality
- **Featured Posts**: Highlight important content
- **Latest Articles**: Chronologically sorted posts
- **Trending Posts**: Engagement-based trending system
- **Topic Categories**: Organized content by categories
- **Tag Filtering**: Client-side filtering by tags
- **Search**: Debounced search with real-time results
- **Lazy Loading**: Optimized image loading for performance

### 🔍 SEO & Schema Markup
- **BreadcrumbList JSON-LD**: Navigation breadcrumbs for search engines
- **FAQPage JSON-LD**: Structured FAQ data for rich snippets
- **Article Schema**: Individual article structured data
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing
- **Meta Tags**: Comprehensive SEO meta information

### ♿ Accessibility Features
- **Skip Links**: Keyboard navigation support
- **ARIA Labels**: Comprehensive screen reader support
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Alt Text**: Descriptive image alternative text
- **Color Contrast**: WCAG AA compliant color schemes

## Project Structure

```
nsmprime-1/
├── app/
│   ├── blog/
│   │   └── page.tsx         # Main blog page component
│   ├── globals.css          # Global styles with Tailwind
│   └── layout.tsx           # Root layout with metadata
├── data/
│   ├── posts.json           # Blog posts data
│   └── trending.json        # Trending posts data
├── hooks/
│   └── useDebounce.ts       # Custom debounce hook
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── next.config.js           # Next.js configuration
```

## Setup Instructions

### Prerequisites
- Node.js 18.0.0 or higher
- npm, yarn, or pnpm package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000/blog](http://localhost:3000/blog)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Type Checking

```bash
# Run TypeScript type checking
npm run type-check
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Data Structure

### Blog Posts (`data/posts.json`)

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishDate: string;
  modifiedDate: string;
  readTime: number;
  featuredImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  tags: string[];
  category: string;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  views: number;
  likes: number;
  shares: number;
}
```

### Trending Posts (`data/trending.json`)

```typescript
interface TrendingPost {
  id: string;
  title: string;
  slug: string;
  trendingScore: number;
  views: number;
  engagement: number;
  publishDate: string;
}
```

## Customization

### Adding New Posts

1. Add post data to `data/posts.json`
2. Include high-quality featured images in `/public/images/blog/`
3. Ensure proper SEO metadata is included
4. Update trending data if applicable

### Styling

- Modify `tailwind.config.js` for design tokens
- Update `app/globals.css` for custom styles
- Use Tailwind utilities in components

### SEO Configuration

- Update metadata in `app/layout.tsx`
- Modify Open Graph images in `/public/images/`
- Customize schema markup in blog components

## Performance Optimizations

### Image Optimization
- Next.js Image component with automatic optimization
- WebP/AVIF format conversion
- Lazy loading for non-critical images
- Responsive image sizes

### Code Splitting
- Automatic code splitting with Next.js
- Dynamic imports for heavy components
- Bundle size optimization

### Caching
- Static generation for blog content
- Browser caching headers
- CDN-ready asset optimization

## SEO Best Practices

### On-Page SEO
- ✅ Proper heading hierarchy (H1-H6)
- ✅ Meta titles and descriptions
- ✅ Semantic HTML structure
- ✅ Internal linking strategy
- ✅ Image alt text optimization
- ✅ URL structure optimization

### Technical SEO
- ✅ Fast loading times (Core Web Vitals)
- ✅ Mobile-first responsive design
- ✅ Structured data markup
- ✅ XML sitemap generation
- ✅ Robots.txt optimization
- ✅ Canonical URLs

### Content SEO
- ✅ Keyword optimization
- ✅ Content freshness indicators
- ✅ Related content suggestions
- ✅ Social sharing optimization
- ✅ FAQ schema markup

## Browser Support

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)  
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the package.json file for details.

## Support

For support and questions:
- Email: support@nsmprime.com
- Website: https://nsmprime.com
- Documentation: https://docs.nsmprime.com

---

Built with ❤️ by NSM Prime Media Group