"use client"

import { Card } from "@/components/ui/card"
import type { RiskBreakdown } from "@/lib/risk-calculator"

interface RiskBreakdownProps {
  breakdown: RiskBreakdown
}

export function RiskBreakdownComponent({ breakdown }: RiskBreakdownProps) {
  const metrics = [
    { label: "Incidents", value: breakdown.incidentScore, color: "bg-red-500" },
    { label: "Audit Findings", value: breakdown.auditScore, color: "bg-orange-500" },
    { label: "VAPT Findings", value: breakdown.vaptScore, color: "bg-yellow-500" },
    { label: "Projects", value: breakdown.projectScore, color: "bg-blue-500" },
    { label: "Security Gap", value: breakdown.securityScore, color: "bg-purple-500" },
  ]

  return (
    <Card className="border border-slate-700 bg-slate-800 p-4">
      <h4 className="text-sm font-semibold text-white mb-4">Risk Breakdown</h4>
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{metric.label}</span>
              <span className="text-slate-400">{metric.value.toFixed(1)}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`${metric.color} h-2 rounded-full transition-all`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
