import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import './global.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ui.polpo.sh';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Polpo UI — Chat components for AI agents',
    template: '%s — Polpo UI',
  },
  description:
    'Composable React components for chat interfaces, tool call renderers, and session management. Built on @polpo-ai/sdk.',
  openGraph: {
    type: 'website',
    siteName: 'Polpo UI',
    title: 'Polpo UI — Chat components for AI agents',
    description:
      'Composable React components for chat interfaces, tool call renderers, and session management.',
    url: siteUrl,
    images: [{ url: `${siteUrl}/og`, width: 1200, height: 630, alt: 'Polpo UI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Polpo UI — Chat components for AI agents',
    description:
      'Composable React components for chat interfaces, tool call renderers, and session management.',
    images: [`${siteUrl}/og`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider>
          <Navbar />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
