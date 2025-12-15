"use client"

import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { exportToCSV, exportToJSON, generateHTMLReport } from "@/lib/export-utils"
import type { Application } from "@/types/application"

interface ExportPanelProps {
  applications: Application[]
}

export function ExportPanel({ applications }: ExportPanelProps) {
  const handleExportCSV = () => {
    exportToCSV(applications)
  }

  const handleExportJSON = () => {
    exportToJSON(applications)
  }

  const handleExportHTML = () => {
    const html = generateHTMLReport(applications)
    const blob = new Blob([html], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `risk-assessment-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card className="border border-slate-700 bg-slate-800/50 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <Download className="w-5 h-5 text-slate-400 md:mt-1" />
        <span className="text-sm font-medium text-white">Export Report:</span>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="gap-2 border-slate-600 text-white hover:bg-slate-700 bg-transparent"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </Button>
          <Button
            onClick={handleExportJSON}
            variant="outline"
            size="sm"
            className="gap-2 border-slate-600 text-white hover:bg-slate-700 bg-transparent"
          >
            <FileJson className="w-4 h-4" />
            JSON
          </Button>
          <Button
            onClick={handleExportHTML}
            variant="outline"
            size="sm"
            className="gap-2 border-slate-600 text-white hover:bg-slate-700 bg-transparent"
          >
            <FileText className="w-4 h-4" />
            HTML Report
          </Button>
        </div>
      </div>
    </Card>
  )
}
