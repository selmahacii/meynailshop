import type { Metadata } from 'next'
import { Outfit, Libre_Baskerville, Montserrat, Italiana, Playfair_Display } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/Providers'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '700', '900'],
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
  weight: ['400', '700'],
})

const italiana = Italiana({
  subsets: ['latin'],
  variable: '--font-italiana',
  weight: ['400'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'MEEY',
  description:
    'Découvrez notre collection premium de vernis, gels UV et produits pour magnifier vos ongles',
  keywords:
    'vernis, gel UV, produits ongles, décoration, boutique en ligne, Algérie',
  icons: {
    icon: '/images/logo2.png',
  },
  openGraph: {
    title: 'MEEY',
    description: 'Collection premium de vernis et produits pour ongles',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${libreBaskerville.variable} ${montserrat.variable} ${italiana.variable} ${playfair.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="bg-creme text-encre font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
