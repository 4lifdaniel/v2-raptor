"use client"

import { Card } from "@/components/ui/card"
import { getRiskLevel } from "@/lib/risk-calculator"
import type { Application } from "@/types/application"

interface DashboardStatsProps {
  applications: Application[]
}

export function DashboardStats({ applications }: DashboardStatsProps) {
  const stats = {
    total: applications.length,
    critical: applications.filter((app) => getRiskLevel(app.riskScore) === "Critical").length,
    high: applications.filter((app) => getRiskLevel(app.riskScore) === "High").length,
    medium: applications.filter((app) => getRiskLevel(app.riskScore) === "Medium").length,
    low: applications.filter((app) => getRiskLevel(app.riskScore) === "Low").length,
    avgRisk:
      applications.length > 0
        ? (applications.reduce((sum, app) => sum + app.riskScore, 0) / applications.length).toFixed(1)
        : 0,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <Card className="border border-slate-700 bg-slate-800 p-4">
        <p className="text-xs text-slate-400 mb-2">Total Apps</p>
        <p className="text-3xl font-bold text-white">{stats.total}</p>
      </Card>

      <Card className="border border-red-700/50 bg-red-900/20 p-4">
        <p className="text-xs text-red-300 mb-2">Critical</p>
        <p className="text-3xl font-bold text-red-400">{stats.critical}</p>
      </Card>

      <Card className="border border-orange-700/50 bg-orange-900/20 p-4">
        <p className="text-xs text-orange-300 mb-2">High</p>
        <p className="text-3xl font-bold text-orange-400">{stats.high}</p>
      </Card>

      <Card className="border border-yellow-700/50 bg-yellow-900/20 p-4">
        <p className="text-xs text-yellow-300 mb-2">Medium</p>
        <p className="text-3xl font-bold text-yellow-400">{stats.medium}</p>
      </Card>

      <Card className="border border-green-700/50 bg-green-900/20 p-4">
        <p className="text-xs text-green-300 mb-2">Low</p>
        <p className="text-3xl font-bold text-green-400">{stats.low}</p>
      </Card>

      <Card className="border border-slate-700 bg-slate-800 p-4">
        <p className="text-xs text-slate-400 mb-2">Avg Risk</p>
        <p className="text-3xl font-bold text-blue-400">{stats.avgRisk}</p>
      </Card>
    </div>
  )
}
