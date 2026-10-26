import type { CSSProperties } from 'react';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import { Overlay } from '@playground/shared/Overlay';
import '@playground/shared/tokens.css';
import '@playground/shared/overlay.css';
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

export const metadata: Metadata = {
  title: 'Glowkin',
  description: 'Carve a pumpkin, light the candle.',
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
      </body>
    </html>
  );
}
