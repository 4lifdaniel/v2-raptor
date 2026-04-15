"use client"

import { useParams, useRouter } from "next/navigation"
import { useApplicationsStorage } from "@/hooks/use-applications-storage"
import { useEffect } from "react"
import {
  calculateRiskScoreWithBreakdown,
  getRiskLevel,
  getRiskBarToneClass,
  getRiskScoreBarPercent
} from "@/lib/risk-calculator"
import {
  ArrowLeft, Download, Edit,
  User, Building2, Globe, ShieldAlert, Key, Server,
  XCircle, FileText, Check, Shield, Activity, MapPinHouse
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { applications, isLoaded } = useApplicationsStorage()

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/login")
    }
  }, [router])

  if (!isLoaded) return null

  const appId = params.id as string
  const application = applications.find(a => a.id === appId)

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Application not found</h2>
        <Button onClick={() => router.push('/applications')}>Back to Applications</Button>
      </div>
    )
  }

  const riskLevel = getRiskLevel(application.riskScore)
  const breakdown = calculateRiskScoreWithBreakdown(application)

  // Sub-scores derived for the UI
  const exposureScore = breakdown.applicationCriticality + breakdown.internetFacing + breakdown.thirdPartyInvolvement + breakdown.hostingLocation
  const controlPenalty = breakdown.mfa + breakdown.siem + breakdown.encryption + breakdown.capacityManagement + breakdown.waf
  const vulnScore = breakdown.incidentsSeverity1 + breakdown.incidentsSeverity2 + breakdown.incidentsSeverity3 + breakdown.vaptCritical + breakdown.vaptHigh + breakdown.vaptMedium + breakdown.vaptLow + breakdown.auditFindings

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8 pt-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Back navigation */}
        <button
          onClick={() => router.push('/applications')}
          className="flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Applications
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md tracking-wider">
                ASSET ID: {application.id.slice(0, 8).toUpperCase()}-OM
              </span>
              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center text-xs font-bold rounded-md tracking-wider">
                <Check className="w-3 h-3 mr-1" /> VERIFIED
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {application.name}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {application.description || "Omnichannel banking gateway facilitating retail and corporate fund transfers, statement processing, and digital clearing services."}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="outline" className="bg-slate-100/50 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-0 shadow-sm text-slate-700 dark:text-slate-200">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-900 hover:bg-blue-800 text-white shadow-sm border border-blue-800">
              <FileText className="w-4 h-4 mr-2" />
              Edit Data
            </Button>
          </div>
        </div>

        {/* Main 3-col Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Risk Score */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Subtle decorative top bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${getRiskBarToneClass(application.riskScore)}`} />

            <p className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-6">
              Aggregate Risk Score
            </p>

            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span className={`text-7xl font-black ${riskLevel === "Critical" ? "text-red-700 dark:text-red-500" :
                riskLevel === "High" ? "text-orange-600 dark:text-orange-500" :
                  riskLevel === "Medium" ? "text-yellow-600 dark:text-yellow-500" :
                    "text-emerald-600 dark:text-emerald-500"
                }`}>
                {(application.riskScore > 10 ? application.riskScore / 10 : application.riskScore).toFixed(1)}
              </span>
              <span className="text-xl font-semibold text-slate-300 dark:text-slate-600">/ 10</span>
            </div>

            <div className={`mt-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 ${riskLevel === "Critical" ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50" :
              riskLevel === "High" ? "bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50" :
                riskLevel === "Medium" ? "bg-yellow-50 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50" :
                  "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
              }`}>
              • {riskLevel} Exposure
            </div>

            <p className="text-sm italic text-slate-500 dark:text-slate-400 leading-relaxed px-4">
              "Application handles {application.criticality?.toLowerCase().includes('critical') ? 'highly sensitive' : 'internal'} data {application.mfa ? 'with' : 'without'} full-spectrum multi-factor orchestration."
            </p>
          </div>

          {/* Card 2: Infrastructure */}
          <div className="bg-slate-50/80 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-8 ml-2">
              Infrastructure & Ownership
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 py-4 rounded-lg border border-transparent shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Owner</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{application.owner || "Unassigned"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 py-4 rounded-lg border border-transparent shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Department</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{application.department || "Organization wide"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 py-4 rounded-lg border border-transparent shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <MapPinHouse className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Hosting</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{application.hostingExternal}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 py-4 rounded-lg border border-transparent shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Internet Facing</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{application.internetFacing ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Technical Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-6 ml-2">
              Security Controls
            </p>
            <div className="space-y-3">
              <ControlItem label="SIEM Integration" icon={Activity} active={!!application.siemIntegration} />
              <ControlItem label="Data Encryption" icon={Key} active={!!application.encryption} />
              <ControlItem label="Multi-Factor Auth" icon={ShieldAlert} active={!!application.mfa} />
              <ControlItem label="WAF Enabled" icon={Shield} active={!!application.wafEnabled} />
              <ControlItem label="Capacity Management" icon={Server} active={!!application.capacityManagement} />
            </div>
          </div>
        </div>

        {/* Risk Contribution Analysis Bottom Section */}
        <div className="mt-12 pt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Risk Contribution Analysis</h2>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {/* @ts-ignore */}
              Data updated 2 hours ago
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center">

            <ContextMetric
              label="EXPOSURE CONTEXT"
              score={Math.min(4.0, Number((exposureScore / 10 * 4.0).toFixed(1)))}
              max={4.0}
              weight="40%"
              color="bg-red-700 dark:bg-red-600"
            />

            <ContextMetric
              label="CONTROL EFFICACY"
              score={Math.min(3.0, Number((controlPenalty / 10 * 3.0).toFixed(1)))}
              max={3.0}
              weight="30%"
              color="bg-blue-800 dark:bg-blue-600"
            />

            <ContextMetric
              label="DATA SENSITIVITY"
              score={Math.min(3.0, Number((vulnScore / 50 * 3.0).toFixed(1)))}
              max={3.0}
              weight="30%"
              color="bg-red-700 dark:bg-red-600"
            />

            {/* Impact score isolated on right */}
            <div className="flex flex-col justify-center items-center h-full p-4 pl-12 border-l border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Impact Score</p>
              <div className="text-5xl font-black text-blue-950 dark:text-white mb-2 tracking-tighter">
                {getRiskScoreBarPercent(application.riskScore)}%
              </div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-red-700 dark:text-red-400">
                Critical Vector
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

function ControlItem({ label, icon: Icon, active }: { label: string, icon: any, active: boolean }) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-blue-900 dark:bg-slate-700 flex items-center justify-center text-white shrink-0 shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      </div>
      {active ? (
        <div className="w-6 h-6 rounded-full bg-blue-900 border-2 border-blue-200 flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-slate-900 shrink-0">
          <Check className="w-3.5 h-3.5" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-red-700 border-2 border-red-200 flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-slate-900 shrink-0">
          <XCircle className="w-4 h-4" />
        </div>
      )}
    </div>
  )
}

function ContextMetric({ label, score, max, weight, color }: { label: string, score: number, max: number, weight: string, color: string }) {
  const percent = Math.min(100, Math.max(0, (score / max) * 100))

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-slate-900 dark:text-white">{score.toFixed(1)}</span>
        <span className="text-sm font-semibold text-slate-300 dark:text-slate-600">/ {max.toFixed(1)}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Weight: {weight}</p>
    </div>
  )
}
