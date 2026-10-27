import type { CSSProperties } from 'react';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import { AnalyticsProvider } from '@playground/shared/AnalyticsProvider';
import { HUB_URL, OG_IMAGE } from '@playground/shared/links';
import { Overlay } from '@playground/shared/Overlay';
import '@playground/shared/tokens.css';
import '@playground/shared/overlay.css';
import '@playground/shared/analytics.css';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const TITLE = 'Glowkin';
const DESCRIPTION = 'Carve a pumpkin, light the candle.';

export const metadata: Metadata = {
  metadataBase: new URL(HUB_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/halloween',
    siteName: 'playground',
    type: 'website',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#050507',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col"
        style={{ '--accent': 'var(--pg-amber)' } as CSSProperties}
      >
        {children}
        <Overlay />
        <AnalyticsProvider appName="Glowkin" />
      </body>
    </html>
  );
}
