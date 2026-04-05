import type { Application } from "@/types/application"

export interface RiskBreakdown {
  applicationCriticality: number
  internetFacing: number
  thirdPartyInvolvement: number
  hostingLocation: number
  incidentsSeverity1: number
  incidentsSeverity2: number
  incidentsSeverity3: number
  auditFindings: number
  vaptCritical: number
  vaptHigh: number
  vaptMedium: number
  vaptLow: number
  mfa: number
  siem: number
  encryption: number
  capacityManagement: number
  waf: number
  eol: number
  totalScore: number
}

function criticalityPoints(criticality?: string): number {
  const c = (criticality || "").trim().toLowerCase()
  if (c.includes("very") && c.includes("critical")) return 4
  if (c.includes("non-critical") || c.includes("non critical")) return 0
  if (c === "critical") return 2
  if (c === "required") return 1
  return 0
}

function getIncidentCounts(app: Application): { s1: number; s2: number; s3: number } {
  let s1 = app.incidentsSev1 ?? 0
  let s2 = app.incidentsSev2 ?? 0
  let s3 = app.incidentsSev3 ?? 0
  if (s1 === 0 && s2 === 0 && s3 === 0 && app.incidents > 0) {
    s3 = app.incidents
  }
  return { s1, s2, s3 }
}

function getVaptCounts(app: Application): { c: number; h: number; m: number; l: number } {
  let c = app.vaptCritical ?? 0
  let h = app.vaptHigh ?? 0
  let m = app.vaptMedium ?? 0
  let l = app.vaptLow ?? 0
  if (c + h + m + l === 0 && app.vaptFindings > 0) {
    l = app.vaptFindings
  }
  return { c, h, m, l }
}

function eolPoints(app: Application): number {
  if (app.eolWithin12Months === true) return 5
  if (app.eolWithin12Months === false) return 0
  const s = String(app.endOfLife || "").trim().toLowerCase()
  if (s === "yes" || s === "true") return 5
  return 0
}

function wafPoints(app: Application): number {
  if (app.internetFacing !== true) return 0
  if (app.wafEnabled === true) return 0
  if (app.wafEnabled === false) return 3
  return 0
}

export function calculateRiskScoreWithBreakdown(application: Application): RiskBreakdown {
  const applicationCriticality = criticalityPoints(application.criticality)
  const internetFacing = application.internetFacing === true ? 2 : 0
  const thirdPartyInvolvement = application.thirdPartyInvolvement === true ? 2 : 0
  const hostingLocation = application.hostingExternal === true ? 2 : 0

  const { s1, s2, s3 } = getIncidentCounts(application)
  const incidentsSeverity1 = s1 * 4
  const incidentsSeverity2 = s2 * 2
  const incidentsSeverity3 = s3 * 1

  const auditFindings = application.auditFindings * 1

  const v = getVaptCounts(application)
  const vaptCritical = v.c * 4
  const vaptHigh = v.h * 3
  const vaptMedium = v.m * 2
  const vaptLow = v.l * 1

  const mfa = application.mfa === true ? 0 : 2
  const siem = application.siemIntegration === true ? 0 : 2
  const encryption = application.encryption === true ? 0 : 3
  const capacityManagement = application.capacityManagement === true ? 0 : 1

  const waf = wafPoints(application)
  const eol = eolPoints(application)

  const totalScore =
    applicationCriticality +
    internetFacing +
    thirdPartyInvolvement +
    hostingLocation +
    incidentsSeverity1 +
    incidentsSeverity2 +
    incidentsSeverity3 +
    auditFindings +
    vaptCritical +
    vaptHigh +
    vaptMedium +
    vaptLow +
    mfa +
    siem +
    encryption +
    capacityManagement +
    waf +
    eol

  return {
    applicationCriticality,
    internetFacing,
    thirdPartyInvolvement,
    hostingLocation,
    incidentsSeverity1,
    incidentsSeverity2,
    incidentsSeverity3,
    auditFindings,
    vaptCritical,
    vaptHigh,
    vaptMedium,
    vaptLow,
    mfa,
    siem,
    encryption,
    capacityManagement,
    waf,
    eol,
    totalScore: Math.round(totalScore * 10) / 10,
  }
}

export function calculateRiskScore(application: Application): number {
  return calculateRiskScoreWithBreakdown(application).totalScore
}

/** 0–10 Low, 11–20 Medium, 21–35 High, 36+ Critical */
export function getRiskLevel(score: number): "Low" | "Medium" | "High" | "Critical" {
  if (score >= 36) return "Critical"
  if (score >= 21) return "High"
  if (score >= 11) return "Medium"
  return "Low"
}

export function getRiskCategoryKey(score: number): "critical" | "high" | "medium" | "low" {
  if (score >= 36) return "critical"
  if (score >= 21) return "high"
  if (score >= 11) return "medium"
  return "low"
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

/** Bar fill width: score is capped at 100 for display when above 100. */
export function getRiskScoreBarPercent(score: number): number {
  return Math.min(100, Math.max(0, score))
}

export function getRiskBarToneClass(score: number): string {
  if (score >= 36) return "bg-red-500"
  if (score >= 21) return "bg-orange-500"
  if (score >= 11) return "bg-yellow-500"
  return "bg-green-500"
}

export function getRiskLevelHex(score: number): string {
  const level = getRiskLevel(score)
  switch (level) {
    case "Critical":
      return "#dc2626"
    case "High":
      return "#ea580c"
    case "Medium":
      return "#eab308"
    case "Low":
      return "#16a34a"
    default:
      return "#64748b"
  }
}
