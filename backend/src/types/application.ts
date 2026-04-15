export interface Application {
  id: string;
  name: string;
  criticality?: string;
  description?: string;
  owner?: string;
  department?: string;
  incidents: number;
  incidentsSev1?: number;
  incidentsSev2?: number;
  incidentsSev3?: number;
  auditFindings: number;
  vaptFindings: number;
  vaptCritical?: number;
  vaptHigh?: number;
  vaptMedium?: number;
  vaptLow?: number;
  passwordComplexity?: boolean;
  mfa?: boolean;
  endOfLife?: boolean;
  eolWithin12Months?: boolean;
  siemIntegration?: boolean;
  encryption?: boolean;
  capacityManagement?: boolean;
  wafEnabled?: boolean | null;
  internetFacing?: boolean;
  thirdPartyInvolvement?: boolean;
  hostingExternal?: string;
  projects: string[];
  // projectCount: number;
  riskScore: number;
}

export interface RiskBreakdown {
  applicationCriticality: number;
  internetFacing: number;
  thirdPartyInvolvement: number;
  hostingLocation: number;
  incidentsSeverity1: number;
  incidentsSeverity2: number;
  incidentsSeverity3: number;
  auditFindings: number;
  vaptCritical: number;
  vaptHigh: number;
  vaptMedium: number;
  vaptLow: number;
  mfa: number;
  siem: number;
  encryption: number;
  capacityManagement: number;
  waf: number;
  eol: number;
  totalScore: number;
}

export interface CreateApplicationDto {
  name: string;
  criticality?: string;
  description?: string;
  owner?: string;
  department?: string;
  incidents?: number;
  incidentsSev1?: number;
  incidentsSev2?: number;
  incidentsSev3?: number;
  auditFindings?: number;
  vaptFindings?: number;
  vaptCritical?: number;
  vaptHigh?: number;
  vaptMedium?: number;
  vaptLow?: number;
  passwordComplexity?: string | boolean;
  mfa?: boolean;
  endOfLife?: boolean;
  eolWithin12Months?: boolean;
  siemIntegration?: boolean;
  encryption?: boolean;
  capacityManagement?: boolean;
  wafEnabled?: boolean | null;
  internetFacing?: boolean;
  thirdPartyInvolvement?: boolean;
  hostingExternal?: string;
  projects?: string[];
}
