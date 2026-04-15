"use client"

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 md:flex-row">
      <AppSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Suspense fallback={<div className="min-h-screen" />}>
        <Shell>{children}</Shell>
      </Suspense>
      <Analytics />
    </ThemeProvider>
  )
}