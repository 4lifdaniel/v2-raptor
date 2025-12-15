import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Application } from "@/types/application"

const DATA_FILE = path.join(process.cwd(), "data", "applications.json")

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read applications from file
async function readApplications(): Promise<Application[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return []
  }
}

// Write applications to file
async function writeApplications(applications: Application[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(applications, null, 2), "utf-8")
}

// GET: Retrieve all applications
export async function GET() {
  try {
    const applications = await readApplications()
    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error reading applications:", error)
    return NextResponse.json({ error: "Failed to read applications" }, { status: 500 })
  }
}

// POST: Add or update applications
export async function POST(request: Request) {
  try {
    const newApps: Application[] = await request.json()
    const existingApps = await readApplications()

    // Merge applications: overwrite if name matches, otherwise add
    const updated = [...existingApps]

    for (const newApp of newApps) {
      const existingIndex = updated.findIndex((app) => app.name.toLowerCase() === newApp.name.toLowerCase())

      if (existingIndex >= 0) {
        updated[existingIndex] = newApp
      } else {
        updated.push(newApp)
      }
    }

    await writeApplications(updated)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error saving applications:", error)
    return NextResponse.json({ error: "Failed to save applications" }, { status: 500 })
  }
}

// DELETE: Remove an application by ID
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const applications = await readApplications()
    const filtered = applications.filter((app) => app.id !== id)
    await writeApplications(filtered)
    return NextResponse.json(filtered)
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
  }
}
