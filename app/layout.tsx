import type { Metadata } from 'next';
import { Asap_Condensed, Karla } from 'next/font/google';
import SmoothScroll from '@/components/providers/SmoothScroll';
import './globals.css';

const asapCondensed = Asap_Condensed({
  variable: '--font-asap-condensed',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const karla = Karla({
  variable: '--font-karla',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title:
    'Création de sites web et stratégie digitale en Suisse | Freelance digital à Lausanne',
  description:
    'Création et refonte de solution web : stratégie digitale, UX/UI design, développement, SEO et suivi des performances.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${asapCondensed.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
