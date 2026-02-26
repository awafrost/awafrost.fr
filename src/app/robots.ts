import { siteConfig } from '@/config/site';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.metadata.url.toString().replace(/\/$/, ''); // Remove trailing slash

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}