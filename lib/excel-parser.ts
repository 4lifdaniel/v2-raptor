import * as XLSX from "xlsx"
import { calculateRiskScore } from "./risk-calculator"
import type { Application } from "@/types/application"

/** Row labels that are sheet titles/headers, not data fields */
const SKIP_ROW_LABELS = new Set(["application risk assessment"])

function parseYesNo(value: unknown): boolean {
  return String(value ?? "")
    .trim()
    .toLowerCase() === "yes"
}

function parseWaf(value: unknown): boolean | null {
  const s = String(value ?? "")
    .trim()
    .toLowerCase()
  if (s === "yes" || s === "true") return true
  if (s === "no" || s === "false") return false
  if (s === "n/a" || s === "na" || s === "") return null
  return null
}

/** yes/no/n/a, or legacy unknown string → boolean */
function resolveWafEnabled(value: unknown): boolean | null {
  const w = parseWaf(value)
  if (w !== null) return w
  const s = String(value ?? "").trim()
  if (s === "") return null
  return parseYesNo(value) ? true : false
}

function parseHostingExternal(value: unknown): boolean {
  const s = String(value ?? "")
    .trim()
    .toLowerCase()
  if (s.includes("external") || s.includes("cloud") || s.includes("vendor")) return true
  if (s.includes("internal") || s.includes("on-prem") || s.includes("on prem") || s.includes("onprem")) return false
  return false
}

/** Build lookup map: each label is stored with and without trailing colon (lowercased). */
function buildLabelMap(rows: unknown[][]): Record<string, unknown> {
  return rows.reduce(
    (acc, row) => {
      const raw = String(row[0] ?? "").trim()
      if (!raw) return acc
      const lower = raw.toLowerCase()
      const canonical = lower.replace(/:\s*$/, "")
      if (SKIP_ROW_LABELS.has(canonical)) return acc
      const value = row[1]
      acc[lower] = value
      acc[canonical] = value
      return acc
    },
    {} as Record<string, unknown>,
  )
}

function hasKey(map: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(map, key)
}

/** First matching key’s value; prefers keys in order. */
function pick(map: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
    if (hasKey(map, k)) return map[k]
  }
  return undefined
}

function pickString(map: Record<string, unknown>, ...keys: string[]): string {
  const v = pick(map, ...keys)
  return String(v ?? "").trim()
}

function pickInt(map: Record<string, unknown>, ...keys: string[]): number {
  for (const k of keys) {
    if (!hasKey(map, k)) continue
    const raw = map[k]
    if (raw === undefined || raw === null || raw === "") continue
    const n = Number.parseInt(String(raw).replace(/,/g, "").trim(), 10)
    if (!Number.isNaN(n)) return n
  }
  return 0
}

export async function parseExcelFile(file: File): Promise<Application[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]

        if (!worksheet) {
          reject(new Error("No worksheet found in Excel file"))
          return
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]

        if (jsonData.length < 2) {
          reject(new Error("Excel file appears to be empty"))
          return
        }

        const dataMap = buildLabelMap(jsonData)

        console.log("[v0] Parsed data map:", dataMap)

        const applicationName =
          pickString(
            dataMap,
            "application name",
            "application name:",
            "application name :",
          ) || "Unknown App"
        console.log("[v0] Application name extracted:", applicationName)

        const incidentsSev1 = pickInt(
          dataMap,
          "incident-s1",
          "incident-s1:",
          "incidents severity 1 (count):",
          "incidents - severity 1:",
        )
        const incidentsSev2 = pickInt(
          dataMap,
          "incident-s2",
          "incident-s2:",
          "incidents severity 2 (count):",
          "incidents - severity 2:",
        )
        const incidentsSev3 = pickInt(
          dataMap,
          "incident-s3",
          "incident-s3:",
          "incidents severity 3 (count):",
          "incidents - severity 3:",
        )

        const auditFindings = pickInt(
          dataMap,
          "audit findings",
          "audit findings:",
          "number of audit findings (last 12 months):",
        )

        const vaptCritical = pickInt(
          dataMap,
          "vapt-critical",
          "vapt-critical:",
          "vapt critical (count):",
          "vapt - critical:",
        )
        const vaptHigh = pickInt(
          dataMap,
          "vapt-high",
          "vapt-high:",
          "vapt high (count):",
          "vapt - high:",
        )
        const vaptMedium = pickInt(
          dataMap,
          "vapt-medium",
          "vapt-medium:",
          "vapt medium (count):",
          "vapt - medium:",
        )
        const vaptLow = pickInt(
          dataMap,
          "vapt-low",
          "vapt-low:",
          "vapt low (count):",
          "vapt - low:",
        )

        const vaptSum = vaptCritical + vaptHigh + vaptMedium + vaptLow
        const vaptFindings = pickInt(
          dataMap,
          "number of vapt findings (last 12 months):",
        )
        const vaptFindingsTotal = vaptSum > 0 ? vaptSum : vaptFindings

        const mfa = parseYesNo(
          pick(dataMap, "mfa enabled", "mfa enabled:", "multi factor authentication:", "multi factor authentication"),
        )
        const siemIntegration = parseYesNo(pick(dataMap, "siem integration", "siem integration:"))
        const encryption = parseYesNo(pick(dataMap, "encryption", "encryption:"))
        const capacityManagement = parseYesNo(pick(dataMap, "capacity management", "capacity management:"))
        const passwordComplexity = parseYesNo(
          pick(dataMap, "password complexity as per ispg:", "password complexity as per ispg"),
        )

        const wafEnabled = resolveWafEnabled(pick(dataMap, "waf enabled", "waf enabled:"))

        const internetFacing = parseYesNo(pick(dataMap, "internet facing", "internet facing:"))
        const thirdPartyInvolvement = parseYesNo(
          pick(dataMap, "third party involvement", "third party involvement:"),
        )
        const hostingExternal = parseHostingExternal(pick(dataMap, "hosting location", "hosting location:"))

        const endOfLifeRaw = pickString(
          dataMap,
          "end-of-life",
          "end-of-life:",
          "end of life",
          "end of life:",
          "end-of-life (next 12 months):",
          "eol",
          "eol:",
        )
        const eolLower = endOfLifeRaw.toLowerCase()
        const eolWithin12Months = eolLower === "yes" || eolLower === "true"

        const projectsRaw = pick(dataMap, "project related to application (last 12 months):", "projects", "projects:")
        const projects = projectsRaw
          ? String(projectsRaw)
              .split("\n")
              .map((p) => p.trim())
              .filter((p) => p && !isNaN(Number(p.charAt(0))))
          : []

        const application: Application = {
          id: `${Date.now()}-${Math.random()}`,
          name: applicationName,
          criticality: pickString(dataMap, "application criticality", "application criticality:", "criticality:", "criticality"),
          description: pickString(dataMap, "description", "description:"),
          owner: pickString(dataMap, "owner", "owner:"),
          department: pickString(dataMap, "department", "department:"),
          incidents: incidentsSev1 + incidentsSev2 + incidentsSev3,
          incidentsSev1,
          incidentsSev2,
          incidentsSev3,
          auditFindings,
          vaptFindings: vaptFindingsTotal,
          vaptCritical,
          vaptHigh,
          vaptMedium,
          vaptLow,
          passwordComplexity,
          mfa,
          endOfLife: endOfLifeRaw,
          eolWithin12Months,
          siemIntegration,
          encryption,
          capacityManagement,
          wafEnabled,
          internetFacing,
          thirdPartyInvolvement,
          hostingExternal,
          projects,
          projectCount: projects.length,
          riskScore: 0,
        }

        application.riskScore = calculateRiskScore(application)

        console.log("[v0] Parsed application:", application)

        resolve([application])
      } catch (error) {
        console.error("[v0] Error parsing Excel:", error)
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsArrayBuffer(file)
  })
}
