import * as XLSX from "xlsx"
import { calculateRiskScore } from "./risk-calculator"
import type { Application } from "@/types/application"

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

        const dataMap = jsonData.reduce(
          (acc, row) => {
            const label = String(row[0] || "")
              .trim()
              .toLowerCase()
            const value = row[1]
            if (label) {
              acc[label] = value
            }
            return acc
          },
          {} as Record<string, unknown>,
        )

        console.log("[v0] Parsed data map:", dataMap)

        // Parse the application data with normalized header matching
        const applicationName = String(dataMap["application name:"] || "Unknown App").trim()
        console.log("[v0] Application name extracted:", applicationName)

        const incidents = Number.parseInt(String(dataMap["number of incidents (last 12 months):"] || 0), 10) || 0
        const auditFindings =
          Number.parseInt(String(dataMap["number of audit findings (last 12 months):"] || 0), 10) || 0
        const vaptFindings = Number.parseInt(String(dataMap["number of vapt findings (last 12 months):"] || 0), 10) || 0

        // Parse boolean fields
        const mfa = String(dataMap["multi factor authentication:"]).toLowerCase() === "yes"
        const siemIntegration = String(dataMap["siem integration:"]).toLowerCase() === "yes"
        const encryption = String(dataMap["encryption:"]).toLowerCase() === "yes"
        const wafEnabled = String(dataMap["waf enabled:"]).toLowerCase() === "yes"
        const capacityManagement = String(dataMap["capacity management:"]).toLowerCase() === "yes"

        // Parse projects list
        const projectsRaw = dataMap["project related to application (last 12 months):"]
        const projects = projectsRaw
          ? String(projectsRaw)
              .split("\n")
              .map((p) => p.trim())
              .filter((p) => p && !isNaN(Number(p.charAt(0))))
          : []

        const application: Application = {
          id: `${Date.now()}-${Math.random()}`,
          name: applicationName,
          criticality: String(dataMap["criticality:"] || "").trim(),
          description: String(dataMap["description:"] || "").trim(),
          owner: String(dataMap["owner:"] || "").trim(),
          department: String(dataMap["department:"] || "").trim(),
          incidents,
          auditFindings,
          vaptFindings,
          passwordComplexity: String(dataMap["password complexity as per ispg:"] || "").trim(),
          mfa,
          endOfLife: String(dataMap["end-of-life (next 12 months):"] || "").trim(),
          siemIntegration,
          encryption,
          capacityManagement,
          wafEnabled,
          projects,
          projectCount: projects.length,
          riskScore: 0, // Will be calculated below
        }

        // Calculate risk score
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
