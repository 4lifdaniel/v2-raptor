import { Application } from '../types/application.js';

export function calculateRiskScore(application: Application): number {
  const breakdown = calculateRiskScoreWithBreakdown(application);
  return breakdown.totalScore;
}

export function calculateRiskScoreWithBreakdown(application: Application): {
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
} {
  let applicationCriticality = 0;
  let internetFacing = 0;
  let thirdPartyInvolvement = 0;
  let hostingLocation = 0;
  let incidentsSeverity1 = 0;
  let incidentsSeverity2 = 0;
  let incidentsSeverity3 = 0;
  let auditFindings = 0;
  let vaptCritical = 0;
  let vaptHigh = 0;
  let vaptMedium = 0;
  let vaptLow = 0;
  let mfa = 0;
  let siem = 0;
  let encryption = 0;
  let capacityManagement = 0;
  let waf = 0;
  let eol = 0;

  switch (application.criticality?.toLowerCase()) {
    case 'very critical':
      applicationCriticality = 4;
      break;
    case 'critical':
      applicationCriticality = 2;
      break;
    case 'required':
      applicationCriticality = 1;
      break;
    case 'non-critical':
    default:
      applicationCriticality = 0;
      break;
  }

  if (application.internetFacing) {
    internetFacing = 2;
  }

  if (application.thirdPartyInvolvement) {
    thirdPartyInvolvement = 2;
  }

  if (application.hostingExternal?.toLowerCase() === 'yes') {
    hostingLocation = 2;
  }

  if (application.incidentsSev1 && application.incidentsSev1 > 0) {
    incidentsSeverity1 = application.incidentsSev1 * 4;
  }

  if (application.incidentsSev2 && application.incidentsSev2 > 0) {
    incidentsSeverity2 = application.incidentsSev2 * 2;
  }

  if (application.incidentsSev3 && application.incidentsSev3 > 0) {
    incidentsSeverity3 = application.incidentsSev3 * 1;
  }

  if (application.auditFindings && application.auditFindings > 0) {
    auditFindings = application.auditFindings * 1;
  }

  if (application.vaptCritical && application.vaptCritical > 0) {
    vaptCritical = application.vaptCritical * 4;
  }

  if (application.vaptHigh && application.vaptHigh > 0) {
    vaptHigh = application.vaptHigh * 3;
  }

  if (application.vaptMedium && application.vaptMedium > 0) {
    vaptMedium = application.vaptMedium * 2;
  }

  if (application.vaptLow && application.vaptLow > 0) {
    vaptLow = application.vaptLow * 1;
  }

  if (!application.mfa) {
    mfa = 2;
  }

  if (!application.siemIntegration) {
    siem = 2;
  }

  if (!application.encryption) {
    encryption = 3;
  }

  if (!application.capacityManagement) {
    capacityManagement = 1;
  }

  if (application.internetFacing && application.wafEnabled === false) {
    waf = 3;
  }

  if (application.endOfLife) {
    eol = 5;
  }

  const totalScore =
    applicationCriticality +
    internetFacing +
    thirdPartyInvolvement +
    hostingLocation +
    incidentsSeverity1 +
    incidentsSeverity2 +
    incidentsSeverity3 +
    auditFindings +
    vaptCritical +
    vaptHigh +
    vaptMedium +
    vaptLow +
    mfa +
    siem +
    encryption +
    capacityManagement +
    waf +
    eol;

  return {
    applicationCriticality,
    internetFacing,
    thirdPartyInvolvement,
    hostingLocation,
    incidentsSeverity1,
    incidentsSeverity2,
    incidentsSeverity3,
    auditFindings,
    vaptCritical,
    vaptHigh,
    vaptMedium,
    vaptLow,
    mfa,
    siem,
    encryption,
    capacityManagement,
    waf,
    eol,
    totalScore,
  };
}

export function getRiskLevel(score: number): 'Low' | 'Medium' | 'High' | 'Critical' {
  if (score <= 10) return 'Low';
  if (score <= 20) return 'Medium';
  if (score <= 35) return 'High';
  return 'Critical';
}
