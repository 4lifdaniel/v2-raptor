"use client"

import { ApplicationCard } from "./application-card"
import { Card } from "@/components/ui/card"
import type { Application } from "@/types/application"

interface ApplicationListProps {
  applications: Application[]
  onRemove: (id: string) => void
}

export function ApplicationList({ applications, onRemove }: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <Card className="border border-slate-700 bg-slate-800/50 p-12 text-center">
        <p className="text-slate-400">No applications loaded yet. Upload an Excel file to get started.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} onRemove={onRemove} />
      ))}
    </div>
  )
}
