"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { parseExcelFile } from "@/lib/excel-parser"
import type { Application } from "@/types/application"

interface FileUploadProps {
  onApplicationsAdded: (apps: Application[]) => void
}

interface UploadedFile {
  name: string
  status: "pending" | "success" | "error"
  error?: string
  appCount?: number
}

export function FileUpload({ onApplicationsAdded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsLoading(true)
    const filesArray = Array.from(files)
    const newUploadedFiles: UploadedFile[] = filesArray.map((f) => ({
      name: f.name,
      status: "pending",
    }))
    setUploadedFiles((prev) => [...prev, ...newUploadedFiles])

    const allApplications: Application[] = []

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i]
      try {
        const applications = await parseExcelFile(file)

        if (applications.length === 0) {
          setUploadedFiles((prev) => {
            const updated = [...prev]
            updated[prev.length - filesArray.length + i] = {
              name: file.name,
              status: "error",
              error: "No valid application data found",
            }
            return updated
          })
        } else {
          allApplications.push(...applications)
          setUploadedFiles((prev) => {
            const updated = [...prev]
            updated[prev.length - filesArray.length + i] = {
              name: file.name,
              status: "success",
              appCount: applications.length,
            }
            return updated
          })
        }
      } catch (err) {
        setUploadedFiles((prev) => {
          const updated = [...prev]
          updated[prev.length - filesArray.length + i] = {
            name: file.name,
            status: "error",
            error: err instanceof Error ? err.message : "Failed to parse file",
          }
          return updated
        })
      }
    }

    if (allApplications.length > 0) {
      onApplicationsAdded(allApplications)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setIsLoading(false)
  }

  const handleClearFiles = () => {
    setUploadedFiles([])
  }

  return (
    <Card className="border-2 border-dashed border-slate-600 bg-slate-800/50 p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <Upload className="w-12 h-12 text-slate-400 mb-4" />

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Upload Application Risk Assessment</h3>
          <p className="text-slate-400 text-sm">Select one or more Excel files containing application risk data</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
          multiple
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Processing..." : "Choose Files"}
        </Button>

        {uploadedFiles.length > 0 && (
          <div className="mt-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Upload Status</h4>
              <button onClick={handleClearFiles} className="text-xs text-slate-400 hover:text-slate-300">
                Clear
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-md text-sm">
                  {file.status === "pending" && (
                    <div className="w-4 h-4 mt-0.5 rounded-full border-2 border-slate-400 border-t-blue-400 animate-spin" />
                  )}
                  {file.status === "success" && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />}
                  {file.status === "error" && <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}

                  <div className="flex-1 text-left">
                    <p className="text-white truncate">{file.name}</p>
                    {file.status === "success" && (
                      <p className="text-green-400 text-xs">{file.appCount} application(s) loaded</p>
                    )}
                    {file.status === "error" && <p className="text-red-400 text-xs">{file.error}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
