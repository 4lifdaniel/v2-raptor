"use client"

import { Card } from "@/components/ui/card"
import type { RiskBreakdown } from "@/lib/risk-calculator"

interface RiskBreakdownProps {
  breakdown: RiskBreakdown
}

export function RiskBreakdownComponent({ breakdown }: RiskBreakdownProps) {
  const rows: { label: string; value: number }[] = [
    { label: "Application Criticality", value: breakdown.applicationCriticality },
    { label: "Internet Facing", value: breakdown.internetFacing },
    { label: "Third Party Involvement", value: breakdown.thirdPartyInvolvement },
    { label: "Hosting Location (external)", value: breakdown.hostingLocation },
    { label: "Incidents — Severity 1 (×4)", value: breakdown.incidentsSeverity1 },
    { label: "Incidents — Severity 2 (×2)", value: breakdown.incidentsSeverity2 },
    { label: "Incidents — Severity 3 (×1)", value: breakdown.incidentsSeverity3 },
    { label: "Audit Findings (×1)", value: breakdown.auditFindings },
    { label: "VAPT — Critical (×4)", value: breakdown.vaptCritical },
    { label: "VAPT — High (×3)", value: breakdown.vaptHigh },
    { label: "VAPT — Medium (×2)", value: breakdown.vaptMedium },
    { label: "VAPT — Low (×1)", value: breakdown.vaptLow },
    { label: "MFA (disabled adds risk)", value: breakdown.mfa },
    { label: "SIEM Integration (missing adds risk)", value: breakdown.siem },
    { label: "Encryption (missing adds risk)", value: breakdown.encryption },
    { label: "Capacity Management (missing adds risk)", value: breakdown.capacityManagement },
    { label: "WAF (if internet-facing)", value: breakdown.waf },
    { label: "EOL (next 12 months)", value: breakdown.eol },
  ]

  return (
    <Card className="border border-slate-700 bg-slate-800 p-4">
      <h4 className="text-sm font-semibold text-white mb-4">Risk score breakdown (points)</h4>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-2 text-xs">
            <span className="text-slate-300">{row.label}</span>
            <span className="text-slate-400 shrink-0 tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-600 mt-3 pt-3 flex justify-between text-sm font-semibold text-white">
        <span>Total</span>
        <span className="tabular-nums">{breakdown.totalScore}</span>
      </div>
    </Card>
  )
}
