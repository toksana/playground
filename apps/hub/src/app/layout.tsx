import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import '@playground/shared/tokens.css';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const DESCRIPTION =
  'Interactive 3D experiments for the web, built with Three.js and React Three Fiber. A new one switches on with each holiday.';

export const metadata: Metadata = {
  metadataBase: new URL('https://playground.oksana.dev'),
  title: 'playground — a small light for every season',
  description: DESCRIPTION,
  openGraph: {
    title: 'playground',
    description: DESCRIPTION,
    url: '/',
    siteName: 'playground',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#07080c',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
