"use client"

import { useState, useEffect } from "react"
import type { Application } from "@/types/application"

const STORAGE_KEY = "risk_dashboard_applications"

export function useApplicationsStorage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setApplications(parsed)
      }
    } catch (error) {
      console.error("[v0] Error loading applications from storage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage whenever applications change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
      } catch (error) {
        console.error("[v0] Error saving applications to storage:", error)
      }
    }
  }, [applications, isLoaded])

  // If an app with the same name exists, overwrite it; otherwise add it
  const addApplications = (newApps: Application[]) => {
    setApplications((current) => {
      const updated = [...current]

      for (const newApp of newApps) {
        const existingIndex = updated.findIndex((app) => app.name.toLowerCase() === newApp.name.toLowerCase())

        if (existingIndex >= 0) {
          // Overwrite existing application with same name
          updated[existingIndex] = newApp
        } else {
          // Add new application
          updated.push(newApp)
        }
      }

      return updated
    })
  }

  const removeApplication = (id: string) => {
    setApplications((current) => current.filter((app) => app.id !== id))
  }

  const clearAll = () => {
    setApplications([])
  }

  return {
    applications,
    addApplications,
    removeApplication,
    clearAll,
    isLoaded,
  }
}
