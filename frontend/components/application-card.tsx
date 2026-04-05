"use client"

import { useState } from "react"
import { X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  getRiskColor,
  getRiskLevel,
  calculateRiskScoreWithBreakdown,
  getRiskScoreBarPercent,
  getRiskBarToneClass,
} from "@/lib/risk-calculator"
import { ApplicationModal } from "./application-modal"
import type { Application } from "@/types/application"

interface ApplicationCardProps {
  application: Application
  onRemove: (id: string) => void
}

export function ApplicationCard({ application, onRemove }: ApplicationCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const riskColor = getRiskColor(application.riskScore)
  const riskLevel = getRiskLevel(application.riskScore)
  const breakdown = calculateRiskScoreWithBreakdown(application)

  return (
    <>
      <Card
        className="border border-slate-700 bg-slate-800 hover:border-slate-600 transition-all hover:shadow-lg relative overflow-hidden group cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        {/* Remove button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(application.id)
          }}
          className="absolute top-2 right-2 h-8 w-8 p-0 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white truncate pr-6">{application.name}</h3>
            {application.department && <p className="text-sm text-slate-400 mt-1">{application.department}</p>}
          </div>

          {/* Risk Score Display */}
          <div className="mb-6 p-4 rounded-lg bg-slate-700/50 border border-slate-600/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">RISK RATING</span>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${riskColor}`}>
                {riskLevel}
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{application.riskScore.toFixed(1)}</div>
            <div className="mt-3 w-full bg-slate-600 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getRiskBarToneClass(application.riskScore)}`}
                style={{ width: `${getRiskScoreBarPercent(application.riskScore)}%` }}
              />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-700/50 rounded p-3 border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-1">Incidents</p>
              <p className="text-xl font-semibold text-white">{application.incidents}</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3 border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-1">Audit</p>
              <p className="text-xl font-semibold text-white">{application.auditFindings}</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3 border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-1">VAPT</p>
              <p className="text-xl font-semibold text-white">{application.vaptFindings}</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3 border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-1">Projects</p>
              <p className="text-xl font-semibold text-white">{application.projectCount}</p>
            </div>
          </div>

          {/* Security Features */}
          <div className="space-y-2 mb-4 pb-4 border-b border-slate-700">
            <p className="text-xs font-medium text-slate-400">Security Status</p>
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`text-xs p-2 rounded ${application.mfa ? "bg-green-900/30 text-green-300" : "bg-red-900/30 text-red-300"}`}
              >
                MFA: {application.mfa ? "✓" : "✗"}
              </div>
              <div
                className={`text-xs p-2 rounded ${application.encryption ? "bg-green-900/30 text-green-300" : "bg-red-900/30 text-red-300"}`}
              >
                Encryption: {application.encryption ? "✓" : "✗"}
              </div>
              <div
                className={`text-xs p-2 rounded ${application.siemIntegration ? "bg-green-900/30 text-green-300" : "bg-red-900/30 text-red-300"}`}
              >
                SIEM: {application.siemIntegration ? "✓" : "✗"}
              </div>
              <div
                className={`text-xs p-2 rounded ${
                  application.wafEnabled === true
                    ? "bg-green-900/30 text-green-300"
                    : application.wafEnabled === false
                      ? "bg-red-900/30 text-red-300"
                      : "bg-slate-700/50 text-slate-300"
                }`}
              >
                WAF: {application.wafEnabled === true ? "✓" : application.wafEnabled === false ? "✗" : "N/A"}
              </div>
              <div
                className={`text-xs p-2 rounded ${application.capacityManagement ? "bg-green-900/30 text-green-300" : "bg-red-900/30 text-red-300"}`}
              >
                Capacity Management: {application.capacityManagement ? "✓" : "✗"}
              </div>
              <div
                className={`text-xs p-2 rounded ${application.passwordComplexity ? "bg-green-900/30 text-green-300" : "bg-red-900/30 text-red-300"}`}
              >
                Password Complexity: {application.passwordComplexity ? "✓" : "✗"}
              </div>
            </div>
          </div>

          {/* View Details Link */}
          <Button
            variant="ghost"
            className="w-full text-blue-400 hover:text-blue-300 flex items-center justify-between"
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(true)
            }}
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Detail Modal */}
      <ApplicationModal
        application={application}
        breakdown={breakdown}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  )
}
