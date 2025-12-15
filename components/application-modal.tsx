"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getRiskColor, getRiskLevel, type RiskBreakdown } from "@/lib/risk-calculator"
import { RiskBreakdownComponent } from "./risk-breakdown"
import type { Application } from "@/types/application"

interface ApplicationModalProps {
  application: Application
  breakdown: RiskBreakdown
  isOpen: boolean
  onClose: () => void
}

export function ApplicationModal({ application, breakdown, isOpen, onClose }: ApplicationModalProps) {
  if (!isOpen) return null

  const riskColor = getRiskColor(application.riskScore)
  const riskLevel = getRiskLevel(application.riskScore)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="border border-slate-700 bg-slate-900 max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 p-0 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{application.name}</h2>
            <p className="text-slate-400">{application.description || "No description provided"}</p>
          </div>

          {/* Risk Score */}
          <div className="mb-6 p-4 rounded-lg bg-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
              <div className={`px-4 py-2 rounded-full font-semibold text-sm ${riskColor}`}>{riskLevel}</div>
            </div>
            <div className="text-4xl font-bold text-white mb-3">
              {application.riskScore.toFixed(1)}
              <span className="text-lg text-slate-400 ml-2">/ 100</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  application.riskScore >= 75
                    ? "bg-red-500"
                    : application.riskScore >= 50
                      ? "bg-orange-500"
                      : application.riskScore >= 25
                        ? "bg-yellow-500"
                        : "bg-green-500"
                }`}
                style={{ width: `${application.riskScore}%` }}
              />
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Application Details */}
            <Card className="border border-slate-700 bg-slate-800 p-4">
              <h4 className="text-sm font-semibold text-white mb-4">Application Details</h4>
              <div className="space-y-3 text-sm">
                {application.owner && (
                  <div>
                    <p className="text-slate-400">Owner</p>
                    <p className="text-white">{application.owner}</p>
                  </div>
                )}
                {application.department && (
                  <div>
                    <p className="text-slate-400">Department</p>
                    <p className="text-white">{application.department}</p>
                  </div>
                )}
                {application.criticality && (
                  <div>
                    <p className="text-slate-400">Criticality</p>
                    <p className="text-white">{application.criticality}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Risk Breakdown */}
            <RiskBreakdownComponent breakdown={breakdown} />
          </div>

          {/* Metrics Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card className="border border-slate-700 bg-slate-800 p-4">
              <p className="text-xs text-slate-400 mb-2">Incidents</p>
              <p className="text-2xl font-bold text-red-400">{application.incidents}</p>
            </Card>
            <Card className="border border-slate-700 bg-slate-800 p-4">
              <p className="text-xs text-slate-400 mb-2">Audit Findings</p>
              <p className="text-2xl font-bold text-orange-400">{application.auditFindings}</p>
            </Card>
            <Card className="border border-slate-700 bg-slate-800 p-4">
              <p className="text-xs text-slate-400 mb-2">VAPT Findings</p>
              <p className="text-2xl font-bold text-yellow-400">{application.vaptFindings}</p>
            </Card>
            <Card className="border border-slate-700 bg-slate-800 p-4">
              <p className="text-xs text-slate-400 mb-2">Projects</p>
              <p className="text-2xl font-bold text-blue-400">{application.projectCount}</p>
            </Card>
          </div>

          {/* Security Features */}
          <Card className="border border-slate-700 bg-slate-800 p-4 mb-6">
            <h4 className="text-sm font-semibold text-white mb-4">Security Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Multi-Factor Authentication", value: application.mfa },
                { label: "Encryption", value: application.encryption },
                { label: "SIEM Integration", value: application.siemIntegration },
                { label: "WAF Enabled", value: application.wafEnabled },
                { label: "Capacity Management", value: application.capacityManagement },
                { label: "Password Complexity", value: !!application.passwordComplexity },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className={`p-3 rounded text-xs font-medium ${
                    feature.value
                      ? "bg-green-900/30 text-green-300 border border-green-800/50"
                      : "bg-red-900/30 text-red-300 border border-red-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{feature.value ? "✓" : "✗"}</span>
                    <span>{feature.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Projects */}
          {application.projects.length > 0 && (
            <Card className="border border-slate-700 bg-slate-800 p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Related Projects</h4>
              <div className="flex flex-wrap gap-2">
                {application.projects.map((project) => (
                  <span
                    key={project}
                    className="bg-blue-900/30 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-800/50"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </Card>
          )}

          <Button onClick={onClose} className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}
