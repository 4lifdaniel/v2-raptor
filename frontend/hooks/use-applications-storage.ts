"use client"

import { useState, useEffect } from "react"
import type { Application } from "@/types/application"
import {
  fetchApplications,
  createApplications,
  deleteApplication,
  deleteAllApplications,
  uploadExcelFile,
} from "@/lib/api-client"

export function useApplicationsStorage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await fetchApplications<Application>()
        setApplications(data)
      } catch (error) {
        console.error("Error loading applications:", error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadApplications()
  }, [])

  const addApplications = async (newApps: Application[]) => {
    try {
      await createApplications(newApps)
      const updated = await fetchApplications<Application>()
      setApplications(updated)
    } catch (error) {
      console.error("Error saving applications:", error)
    }
  }

  const addFromExcel = async (file: File) => {
    try {
      const created = await uploadExcelFile<Application>(file)
      const updated = await fetchApplications<Application>()
      setApplications(updated)
      return created.length
    } catch (error) {
      console.error("Error uploading Excel file:", error)
      throw error
    }
  }

  const removeApplication = async (id: string) => {
    try {
      await deleteApplication(id)
      setApplications((prev) => prev.filter((app) => app.id !== id))
    } catch (error) {
      console.error("Error removing application:", error)
    }
  }

  const clearAll = async () => {
    try {
      await deleteAllApplications()
      setApplications([])
    } catch (error) {
      console.error("Error clearing applications:", error)
    }
  }

  return {
    applications,
    addApplications,
    addFromExcel,
    removeApplication,
    clearAll,
    isLoaded,
  }
}
