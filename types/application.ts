export interface Application {
  id: string
  name: string
  criticality?: string
  description?: string
  owner?: string
  department?: string
  /** Legacy total when severity breakdown is absent */
  incidents: number
  incidentsSev1?: number
  incidentsSev2?: number
  incidentsSev3?: number
  auditFindings: number
  /** Legacy total VAPT count when severity breakdown is absent */
  vaptFindings: number
  vaptCritical?: number
  vaptHigh?: number
  vaptMedium?: number
  vaptLow?: number
  passwordComplexity?: string | boolean
  mfa?: boolean
  endOfLife?: string
  eolWithin12Months?: boolean
  siemIntegration?: boolean
  encryption?: boolean
  capacityManagement?: boolean
  /** true = Yes, false = No, null = N/A (WAF N/A adds 0; No adds 3 only when internet-facing) */
  wafEnabled?: boolean | null
  internetFacing?: boolean
  thirdPartyInvolvement?: boolean
  /** External cloud / vendor = true; internal on-prem = false */
  hostingExternal?: boolean
  projects: string[]
  projectCount: number
  riskScore: number
}
