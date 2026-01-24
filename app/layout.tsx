import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Miesieduo Veria | Web Developer · Game Developer · Nature Photographer · Drummer',
  description: 'Multi-disciplinary creative professional based in Nigeria. Building scalable web apps, immersive games, and professional creative media. At the intersection of code, lens, and rhythm.',
  keywords: 'web developer, game developer, photographer, drummer, Nigeria, creative, portfolio, Unity, React, TypeScript',
  authors: [{ name: 'Miesieduo Veria' }],
  creator: 'Miesieduo Veria',
  publisher: 'Miesieduo Veria',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Miesieduo Veria | Creative Developer',
    description: 'Building scalable web apps, immersive games, and professional creative media. At the intersection of code, lens, and rhythm.',
    siteName: 'Miesieduo Veria Portfolio',
    images: [
      {
        url: '/hero-landscape.jpg',
        width: 1200,
        height: 630,
        alt: 'Miesieduo Veria - Creative Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miesieduo Veria | Creative Developer',
    description: 'Building scalable web apps, immersive games, and professional creative media.',
    images: ['/hero-landscape.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
