import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Risk Assessment Portal',
  description: 'Created with v0',
  generator: 'v0.app',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-slate-50 dark:bg-slate-950`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 md:flex-row">
            <AppSidebar />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
