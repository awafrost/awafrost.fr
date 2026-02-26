import { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  metadata: {
    name: 'Frost',
    description: 'Créateur de contenu amateur',
    twitter_id: '@awafrost',
    url: new URL(
      process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : `http://localhost:${process.env.PORT || '3000'}`,
    ),
  },
};