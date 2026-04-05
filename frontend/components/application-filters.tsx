"use client"

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ApplicationFiltersProps {
  riskFilter: string
  onRiskFilterChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
}

export function ApplicationFilters({ riskFilter, onRiskFilterChange, sortBy, onSortChange }: ApplicationFiltersProps) {
  return (
    <Card className="border border-slate-700 bg-slate-800/50 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-white mb-2">Filter by Risk Level</label>
          <Select value={riskFilter} onValueChange={onRiskFilterChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-white mb-2">Sort By</label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="risk-desc">Risk Score (High to Low)</SelectItem>
              <SelectItem value="risk-asc">Risk Score (Low to High)</SelectItem>
              <SelectItem value="name-asc">Name (A to Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z to A)</SelectItem>
              <SelectItem value="incidents-desc">Incidents (Most to Least)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
