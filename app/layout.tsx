import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Application Risk Dashboard',
  description: 'Nothing',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/secure.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/secure.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/secure.png',
        type: 'image/png',
      },
    ],
    apple: '/secure.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
