import type { Metadata } from 'next';
import { Asap_Condensed, Karla, Rubik } from 'next/font/google';
import Navigation from '@/components/organisms/Navigation';
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

// Navigation only (Figma: Rubik Bold 14px).
const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['latin'],
  weight: ['700'],
});

export const metadata: Metadata = {
  title: 'Website design & digital strategy in Switzerland',
  description:
    'Building and redesigning websites: digital strategy, UX/UI design, development, SEO and performance tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${asapCondensed.variable} ${karla.variable} ${rubik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navigation />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
