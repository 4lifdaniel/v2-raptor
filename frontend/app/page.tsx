"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { ApplicationList } from "@/components/application-list"
import { DashboardStats } from "@/components/dashboard-stats"
import { ApplicationFilters } from "@/components/application-filters"
import { ExportPanel } from "@/components/export-panel"
import { useApplicationsStorage } from "@/hooks/use-applications-storage"
import { getRiskCategoryKey } from "@/lib/risk-calculator"

export default function Home() {
  const router = useRouter()
  const { applications, addFromExcel, removeApplication, clearAll, isLoaded } = useApplicationsStorage()
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("risk-desc")
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/login")
    }
  }, [router])

  const filteredAndSortedApps = useMemo(() => {
    let filtered = applications

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((app) =>
        app.name.toLowerCase().includes(query)
      )
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter((app) => {
        return getRiskCategoryKey(app.riskScore) === riskFilter
      })
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "risk-desc":
          return b.riskScore - a.riskScore
        case "risk-asc":
          return a.riskScore - b.riskScore
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "incidents-desc":
          return b.incidents - a.incidents
        default:
          return 0
      }
    })

    return sorted
  }, [applications, riskFilter, sortBy, searchQuery])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Application Risk Main Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Assess and monitor application security risk across your portfolio</p>
        </div>

        <div className="mb-8">
          <FileUpload onUpload={addFromExcel} />
        </div>

        {applications.length > 0 && (
          <>
            <DashboardStats applications={applications} />

            <ExportPanel applications={applications} />

            <ApplicationFilters
              riskFilter={riskFilter}
              onRiskFilterChange={setRiskFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search applications by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </>
        )}

        <ApplicationList applications={filteredAndSortedApps} onRemove={removeApplication} />
      </div>
    </main>
  )
}
