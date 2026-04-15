"use client"

import { Card } from "@/components/ui/card"
import type { RiskBreakdown } from "@/lib/risk-calculator"
import type { Application } from "@/types/application"

interface RiskBreakdownProps {
  breakdown: RiskBreakdown
  application: Application
}

export function RiskBreakdownComponent({ breakdown, application }: RiskBreakdownProps) {
  const rows: { label: string; value: number | boolean | string; bold?: boolean }[] = [
    { label: "Internet Facing", value: application.internetFacing ? "Yes" : "No" },
    { label: "Third Party Involvement", value: application.thirdPartyInvolvement ? "Yes" : "No" },
    { label: "External Hosted", value: application.hostingExternal ? "Yes" : "No" },
    { label: "No. of Incidents", value: " ", bold: true },
    { label: "Severity 1", value: application.incidentsSev1 ?? 0 },
    { label: "Severity 2", value: application.incidentsSev2 ?? 0 },
    { label: "Severity 3", value: application.incidentsSev3 ?? 0 },
    { label: "No. Audit Findings", value: application.auditFindings },
    { label: "No. VAPT Findings", value: " ", bold: true },
    { label: "Critical", value: application.vaptCritical ?? 0 },
    { label: "High", value: application.vaptHigh ?? 0 },
    { label: "Medium", value: application.vaptMedium ?? 0 },
    { label: "Low", value: application.vaptLow ?? 0 },
  ]

  return (
    <Card className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">More Details</h4>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-2 text-xs">
            <span
              className={`text-slate-700 dark:text-slate-300 ${row.bold ? "font-bold" : ""
                }`}
            >
              {row.label}
            </span>            <span className="text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 dark:border-slate-600 mt-3 pt-3 flex justify-between text-sm font-semibold text-slate-900 dark:text-white">
        <span>Risk Rating Score</span>
        <span className="tabular-nums">{breakdown.totalScore}/100</span>
      </div>
    </Card>
  )
}
