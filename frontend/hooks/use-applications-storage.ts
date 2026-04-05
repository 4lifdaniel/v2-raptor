"use client"

import { useState, useEffect } from "react"
import type { Application } from "@/types/application"

export function useApplicationsStorage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await fetch("/api/applications")
        if (response.ok) {
          const data = await response.json()
          setApplications(data)
        }
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
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApps),
      })

      if (response.ok) {
        const updated = await response.json()
        setApplications(updated)
      }
    } catch (error) {
      console.error("Error saving applications:", error)
    }
  }

  const removeApplication = async (id: string) => {
    try {
      const response = await fetch("/api/applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        const updated = await response.json()
        setApplications(updated)
      }
    } catch (error) {
      console.error("Error removing application:", error)
    }
  }

  const clearAll = async () => {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      })

      if (response.ok) {
        setApplications([])
      }
    } catch (error) {
      console.error("Error clearing applications:", error)
    }
  }

  return {
    applications,
    addApplications,
    removeApplication,
    clearAll,
    isLoaded,
  }
}
