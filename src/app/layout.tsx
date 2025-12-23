import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Beauty 2026 | Sri Lanka\'s Biggest Online Beauty Contest - star.tuko.lk',
  description: 'Join Beauty 2026 - Sri Lanka\'s largest online beauty contest. Compete from all 25 districts, win provincial titles, and become the national Beauty Queen. Powered by Tuko.',
  keywords: 'beauty contest, Sri Lanka, Beauty 2026, pageant, Tuko, star.tuko.lk, beauty queen',
  openGraph: {
    title: 'Beauty 2026 | Sri Lanka\'s Biggest Online Beauty Contest',
    description: 'Join Beauty 2026 - Sri Lanka\'s largest online beauty contest. Compete from all 25 districts!',
    url: 'https://star.tuko.lk',
    siteName: 'Beauty 2026',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Beauty 2026 - Sri Lanka',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
