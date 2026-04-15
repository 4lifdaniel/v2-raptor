"use client"

import { useApplicationsStorage } from "@/hooks/use-applications-storage"
import { ApplicationCard } from "@/components/application-card"
import { Search } from "lucide-react"
import { useState } from "react"

export default function ApplicationsPage() {
  const { applications, removeApplication, isLoaded } = useApplicationsStorage()
  const [searchQuery, setSearchQuery] = useState("")

  if (!isLoaded) return null

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Application Details</h1>
          <p className="text-slate-500 dark:text-slate-400">View detailed information for each uploaded application and select one to see more details.</p>
        </div>
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

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No applications found</h3>
            <p className="text-slate-500 dark:text-slate-400">Upload an Excel file in the Overview page to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <ApplicationCard 
                key={app.id} 
                application={app} 
                onRemove={removeApplication} 
                linkToDetails={true} 
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
