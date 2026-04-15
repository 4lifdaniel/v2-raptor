import type { Application } from "@/types/application"
import { getRiskLevel, getRiskLevelHex } from "@/lib/risk-calculator"

export function exportToCSV(applications: Application[]): void {
  if (applications.length === 0) {
    alert("No applications to export")
    return
  }

  // Define CSV headers
  const headers = [
    "Application Name",
    "Risk Score",
    "Risk Level",
    "Department",
    "Owner",
    "Incidents",
    "Audit Findings",
    "VAPT Findings",
    "MFA",
    "Encryption",
    "SIEM Integration",
    "WAF Enabled",
  ]

  // Create CSV rows
  const rows = applications.map((app) => {
    const riskLevel = getRiskLevel(app.riskScore)

    return [
      `"${app.name}"`,
      app.riskScore.toFixed(1),
      riskLevel,
      `"${app.department || ""}"`,
      `"${app.owner || ""}"`,
      app.incidents,
      app.auditFindings,
      app.vaptFindings,
      app.mfa ? "Yes" : "No",
      app.encryption ? "Yes" : "No",
      app.siemIntegration ? "Yes" : "No",
      app.wafEnabled ? "Yes" : "No",
    ]
  })

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `risk-assessment-${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function exportToJSON(applications: Application[]): void {
  if (applications.length === 0) {
    alert("No applications to export")
    return
  }

  const data = {
    exportDate: new Date().toISOString(),
    totalApplications: applications.length,
    summary: {
      critical: applications.filter((app) => getRiskLevel(app.riskScore) === "Critical").length,
      high: applications.filter((app) => getRiskLevel(app.riskScore) === "High").length,
      medium: applications.filter((app) => getRiskLevel(app.riskScore) === "Medium").length,
      low: applications.filter((app) => getRiskLevel(app.riskScore) === "Low").length,
    },
    applications: applications,
  }

  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `risk-assessment-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function generateHTMLReport(applications: Application[]): string {
  const summary = {
    critical: applications.filter((app) => getRiskLevel(app.riskScore) === "Critical").length,
    high: applications.filter((app) => getRiskLevel(app.riskScore) === "High").length,
    medium: applications.filter((app) => getRiskLevel(app.riskScore) === "Medium").length,
    low: applications.filter((app) => getRiskLevel(app.riskScore) === "Low").length,
  }

  const avgRisk =
    applications.length > 0
      ? (applications.reduce((sum, app) => sum + app.riskScore, 0) / applications.length).toFixed(1)
      : 0

  const applicationsHTML = applications
    .sort((a, b) => b.riskScore - a.riskScore)
    .map((app) => {
      const riskLevel = getRiskLevel(app.riskScore)
      const riskColor = getRiskLevelHex(app.riskScore)

      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${app.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            <span style="background-color: ${riskColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
              ${riskLevel} (${app.riskScore})
            </span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${app.incidents}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${app.auditFindings}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${app.vaptFindings}</td>
        </tr>
      `
    })
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Application Risk Assessment Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          color: #1f2937;
          margin-bottom: 10px;
        }
        .report-date {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 30px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .summary-card {
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .summary-card.critical { background-color: #fee2e2; border-color: #fca5a5; }
        .summary-card.high { background-color: #ffedd5; border-color: #fdba74; }
        .summary-card.medium { background-color: #fef3c7; border-color: #fcd34d; }
        .summary-card.low { background-color: #dcfce7; border-color: #86efac; }
        .summary-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #6b7280;
        }
        .summary-card .value {
          font-size: 32px;
          font-weight: bold;
        }
        .summary-card.critical .value { color: #dc2626; }
        .summary-card.high .value { color: #ea580c; }
        .summary-card.medium .value { color: #eab308; }
        .summary-card.low .value { color: #16a34a; }
        .summary-card.avg .value { color: #2563eb; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        table th {
          background-color: #f3f4f6;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #1f2937;
          border-bottom: 2px solid #d1d5db;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Application Risk Assessment Report</h1>
        <div class="report-date">Generated on ${new Date().toLocaleString()}</div>
        
        <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 20px;">Summary</h2>
        <div class="summary-grid">
          <div class="summary-card critical">
            <h3>Critical</h3>
            <div class="value">${summary.critical}</div>
          </div>
          <div class="summary-card high">
            <h3>High</h3>
            <div class="value">${summary.high}</div>
          </div>
          <div class="summary-card medium">
            <h3>Medium</h3>
            <div class="value">${summary.medium}</div>
          </div>
          <div class="summary-card low">
            <h3>Low</h3>
            <div class="value">${summary.low}</div>
          </div>
          <div class="summary-card avg">
            <h3>Average Risk Score</h3>
            <div class="value">${avgRisk}</div>
          </div>
        </div>

        <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 20px;">Applications</h2>
        <table>
          <thead>
            <tr>
              <th>Application Name</th>
              <th style="text-align: center;">Risk Level</th>
              <th style="text-align: center;">Incidents</th>
              <th style="text-align: center;">Audit Findings</th>
              <th style="text-align: center;">VAPT Findings</th>
            </tr>
          </thead>
          <tbody>
            ${applicationsHTML}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `
}
