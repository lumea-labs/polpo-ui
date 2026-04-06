import type { MetadataRoute } from 'next';
import { source, componentsSource } from '@/lib/source';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ui.polpo.sh';

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = source.getPages().map((page) => ({
    url: `${siteUrl}${page.url}`,
    lastModified: new Date(),
  }));

  const components = componentsSource.getPages().map((page) => ({
    url: `${siteUrl}${page.url}`,
    lastModified: new Date(),
  }));

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/examples`, lastModified: new Date() },
    ...docs,
    ...components,
  ];
}
