import type { Metadata } from 'next';
import { Outfit, Libre_Baskerville } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers/Providers';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
});

const libreBaskerille = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'MEEY - Boutique de vernis et produits pour ongles',
  description: 'Découvrez notre collection premium de vernis, gels UV et produits pour magnifier vos ongles',
  keywords: 'vernis, gel UV, produits ongles, décoration, boutique en ligne, Algérie',
  openGraph: {
    title: 'MEEY - Boutique de vernis et produits pour ongles',
    description: 'Collection premium de vernis et produits pour ongles',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${outfit.variable} ${libreBaskerille.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='50' font-size='90' fill='%236B0F1A'>M</text></svg>" />
      </head>
      <body className="bg-creme text-encre font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
