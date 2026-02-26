import { Metadata } from 'next';
import './globals.css';
import Provider from './provider';
import { Inter } from 'next/font/google';
import { siteConfig } from '@/config/site';

// Configuration de la police Inter
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'], // Poids régulier et bold pour limiter les requêtes
});

export const metadata: Metadata = {
  metadataBase: siteConfig.metadata.url,
  title: {
    default: siteConfig.metadata.name,
    template: `%s - ${siteConfig.metadata.name}`,
  },
  description: siteConfig.metadata.description,
  themeColor: '#007af8',
  icons: {
    icon: 'https://www.roblox.com/headshot-thumbnail/image?userId=1743461749&width=192&height=192&format=png',
    apple: 'https://www.roblox.com/headshot-thumbnail/image?userId=1743461749&width=180&height=180&format=png',
  },
  openGraph: {
    title: siteConfig.metadata.name,
    description: siteConfig.metadata.description,
    siteName: siteConfig.metadata.name,
    url: siteConfig.metadata.url,
    locale: 'fr-FR',
    type: 'website',
    images: [
      {
        url: 'https://www.roblox.com/headshot-thumbnail/image?userId=1743461749&width=1200&height=1200&format=png',
        width: 1200,
        height: 1200,
        alt: 'Avatar Roblox Awafrost',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.metadata.name,
    description: siteConfig.metadata.description,
    site: siteConfig.metadata.twitter_id,
    creator: siteConfig.metadata.twitter_id,
    images: [
      'https://www.roblox.com/headshot-thumbnail/image?userId=1743461749&width=1200&height=1200&format=png',
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Préconnexion à Google Fonts pour améliorer la fiabilité */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <Provider>{children}</Provider> 
      </body>
    </html> 
  );
}