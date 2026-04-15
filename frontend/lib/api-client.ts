const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  count?: number
  message?: string
}

export async function fetchApplications<T>(): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}/api/applications`)
  if (!response.ok) throw new Error("Failed to fetch applications")
  const data: ApiResponse<T[]> = await response.json()
  return data.data ?? []
}

export async function createApplications<T>(applications: T[]): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}/api/applications/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applications }),
  })
  if (!response.ok) throw new Error("Failed to create applications")
  const data: ApiResponse<T[]> = await response.json()
  return data.data ?? []
}

export async function uploadExcelFile<T>(file: File): Promise<T[]> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/api/applications/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to upload file")
  }

  const data: ApiResponse<T[]> = await response.json()
  return data.data ?? []
}

export async function deleteApplication(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

export async function deleteAllApplications(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/applications`, {
    method: "DELETE",
  })
  return response.ok
}
