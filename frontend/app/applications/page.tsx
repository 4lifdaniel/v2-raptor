"use client"

import { useApplicationsStorage } from "@/hooks/use-applications-storage"
import { ApplicationCard } from "@/components/application-card"

export default function ApplicationsPage() {
  const { applications, removeApplication, isLoaded } = useApplicationsStorage()

  if (!isLoaded) return null

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Application Details</h1>
          <p className="text-slate-500 dark:text-slate-400">View detailed information for each uploaded application and select one to see more details.</p>
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
