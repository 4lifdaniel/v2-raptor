export interface Application {
  id: string
  name: string
  criticality?: string
  description?: string
  owner?: string
  department?: string
  incidents: number
  auditFindings: number
  vaptFindings: number
  passwordComplexity?: string
  mfa?: boolean
  endOfLife?: string
  siemIntegration?: boolean
  encryption?: boolean
  capacityManagement?: boolean
  wafEnabled?: boolean
  projects: string[]
  projectCount: number
  riskScore: number
}
