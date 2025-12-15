import type { Application } from "@/types/application"

// Default weights for each metric (total should sum to 100)
export const DEFAULT_WEIGHTS = {
  incidents: 25,
  auditFindings: 25,
  vaptFindings: 20,
  projectCount: 10,
  security: 20,
}

// Thresholds for normalizing metrics to 0-100 scale
export const THRESHOLDS = {
  incidents: { max: 5, critical: 10 },
  auditFindings: { max: 5, critical: 10 },
  vaptFindings: { max: 10, critical: 20 },
  projectCount: { max: 5, critical: 10 },
}

export interface RiskBreakdown {
  incidentScore: number
  auditScore: number
  vaptScore: number
  projectScore: number
  securityScore: number
  totalScore: number
}

export function calculateRiskScoreWithBreakdown(application: Application, weights = DEFAULT_WEIGHTS): RiskBreakdown {
  // Normalize each metric to a 0-100 scale
  const incidentScore = Math.min(100, (application.incidents / THRESHOLDS.incidents.max) * 100)
  const auditScore = Math.min(100, (application.auditFindings / THRESHOLDS.auditFindings.max) * 100)
  const vaptScore = Math.min(100, (application.vaptFindings / THRESHOLDS.vaptFindings.max) * 100)
  const projectScore = Math.min(100, (application.projectCount / THRESHOLDS.projectCount.max) * 100)

  // Security Features: Each missing feature increases risk
  const securityFeatures = [
    application.mfa ? 1 : 0,
    application.encryption ? 1 : 0,
    application.siemIntegration ? 1 : 0,
    application.wafEnabled ? 1 : 0,
    application.capacityManagement ? 1 : 0,
  ]
  const securityScore = 100 - (securityFeatures.reduce((a, b) => a + b, 0) / 5) * 100

  // Calculate weighted risk score
  const totalScore =
    (incidentScore * weights.incidents +
      auditScore * weights.auditFindings +
      vaptScore * weights.vaptFindings +
      projectScore * weights.projectCount +
      securityScore * weights.security) /
    100

  return {
    incidentScore: Math.round(incidentScore * 10) / 10,
    auditScore: Math.round(auditScore * 10) / 10,
    vaptScore: Math.round(vaptScore * 10) / 10,
    projectScore: Math.round(projectScore * 10) / 10,
    securityScore: Math.round(securityScore * 10) / 10,
    totalScore: Math.round(totalScore * 10) / 10,
  }
}

export function calculateRiskScore(application: Application): number {
  const breakdown = calculateRiskScoreWithBreakdown(application, DEFAULT_WEIGHTS)
  return breakdown.totalScore
}

export function getRiskLevel(score: number): string {
  if (score >= 75) return "Critical"
  if (score >= 50) return "High"
  if (score >= 25) return "Medium"
  return "Low"
}

export function getRiskColor(score: number): string {
  const level = getRiskLevel(score)
  switch (level) {
    case "Critical":
      return "bg-red-900/80 text-red-200"
    case "High":
      return "bg-orange-900/80 text-orange-200"
    case "Medium":
      return "bg-yellow-900/80 text-yellow-200"
    case "Low":
      return "bg-green-900/80 text-green-200"
    default:
      return "bg-slate-700 text-slate-200"
  }
}

export function getRiskBgColor(score: number): string {
  const level = getRiskLevel(score)
  switch (level) {
    case "Critical":
      return "bg-red-500/20 border-red-500/30"
    case "High":
      return "bg-orange-500/20 border-orange-500/30"
    case "Medium":
      return "bg-yellow-500/20 border-yellow-500/30"
    case "Low":
      return "bg-green-500/20 border-green-500/30"
    default:
      return "bg-slate-500/20 border-slate-500/30"
  }
}

export function getScorePercentage(score: number): number {
  return Math.round((score / 100) * 100)
}
