"use client"

import { useState, useMemo } from "react"
import { FileUpload } from "@/components/file-upload"
import { ApplicationList } from "@/components/application-list"
import { DashboardStats } from "@/components/dashboard-stats"
import { ApplicationFilters } from "@/components/application-filters"
import { ExportPanel } from "@/components/export-panel"
import { useApplicationsStorage } from "@/hooks/use-applications-storage"
import { getRiskCategoryKey } from "@/lib/risk-calculator"

export default function Home() {
  const { applications, addApplications, removeApplication, clearAll, isLoaded } = useApplicationsStorage()
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("risk-desc")

  const handleApplicationsAdded = (newApps: any[]) => {
    addApplications(newApps)
  }

  // Filter and sort applications
  const filteredAndSortedApps = useMemo(() => {
    let filtered = applications

    // Apply risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter((app) => {
        return getRiskCategoryKey(app.riskScore) === riskFilter
      })
    }

    // Apply sorting
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
  }, [applications, riskFilter, sortBy])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Application Risk Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Assess and monitor application security risk across your portfolio</p>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload onApplicationsAdded={handleApplicationsAdded} />
        </div>

        {/* Dashboard Stats */}
        {applications.length > 0 && (
          <>
            <DashboardStats applications={applications} />

            <ExportPanel applications={applications} />

            {/* Filters and Sorting */}
            <ApplicationFilters
              riskFilter={riskFilter}
              onRiskFilterChange={setRiskFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </>
        )}

        {/* Applications List */}
        <ApplicationList applications={filteredAndSortedApps} onRemove={removeApplication} />
      </div>
    </main>
  )
}
