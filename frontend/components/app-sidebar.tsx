"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, AppWindow, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppSidebar() {
  const pathname = usePathname()
  const isOverview = pathname === "/"
  const isApplications = pathname.startsWith("/applications")

  return (
    <aside
      className={cn(
        "flex w-full flex-col bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 md:w-56 md:shrink-0",
        "border-b md:border-b-0 md:border-r",
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-4">
        <Link href="/" className="block">
          <span className="text-md font-semibold tracking-tight text-slate-900 dark:text-white">Risk Assessment Portal</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-6 p-4">
        <div>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Overview</p>
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                  isOverview
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white",
                )}
              >
                <LayoutDashboard className="size-4 shrink-0 opacity-80" aria-hidden />
                Main Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/applications"
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                  isApplications
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white",
                )}
              >
                <AppWindow className="size-4 shrink-0 opacity-80" aria-hidden />
                My Applications
              </Link>
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <ThemeToggle />
        </div>
      </nav>
    </aside>
  )
}
