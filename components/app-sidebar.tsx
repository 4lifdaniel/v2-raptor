"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()
  const isOverview = pathname === "/"

  return (
    <aside
      className={cn(
        "flex w-full flex-col border-slate-800 bg-slate-950 md:w-56 md:shrink-0",
        "border-b md:border-b-0 md:border-r",
      )}
    >
      <div className="border-b border-slate-800 px-4 py-5">
        <Link href="/" className="block">
          <span className="text-sm font-semibold tracking-tight text-white">Risk Assessment Portal</span>
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
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white",
                )}
              >
                <LayoutDashboard className="size-4 shrink-0 opacity-80" aria-hidden />
                Overview
              </Link>
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <p className="px-2 text-sm leading-relaxed text-slate-500">Coming soon, work in progress</p>
        </div>
      </nav>
    </aside>
  )
}
