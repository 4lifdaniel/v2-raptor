import prisma from '../lib/prisma.js';
import { Application, CreateApplicationDto } from '../types/application.js';
import { calculateRiskScore } from './riskCalculator.js';

export async function getAllApplications(): Promise<Application[]> {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return applications.map(formatApplication);
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const application = await prisma.application.findUnique({
    where: { id },
  });
  return application ? formatApplication(application) : null;
}

export async function getApplicationByName(name: string): Promise<Application | null> {
  const application = await prisma.application.findUnique({
    where: { name },
  });
  return application ? formatApplication(application) : null;
}

export async function upsertApplication(data: CreateApplicationDto): Promise<{ application: Application; created: boolean }> {
  const formatted = {
    ...data,
    passwordComplexity: data.passwordComplexity ?? null,
    mfa: data.mfa ?? null,
    endOfLife: data.endOfLife ?? null,
    eolWithin12Months: data.eolWithin12Months ?? null,
    siemIntegration: data.siemIntegration ?? null,
    encryption: data.encryption ?? null,
    capacityManagement: data.capacityManagement ?? null,
    wafEnabled: data.wafEnabled ?? null,
    internetFacing: data.internetFacing ?? null,
    thirdPartyInvolvement: data.thirdPartyInvolvement ?? null,
  };

  const riskScore = calculateRiskScore({
    id: '',
    name: data.name,
    incidents: data.incidents ?? 0,
    auditFindings: data.auditFindings ?? 0,
    vaptFindings: data.vaptFindings ?? 0,
    riskScore: 0,
    ...data,
  });

  const existing = await prisma.application.findUnique({
    where: { name: data.name },
  });

  let application;
  const isNew = !existing;

  if (existing) {
    application = await prisma.application.update({
      where: { name: data.name },
      data: {
        ...formatted,
        riskScore,
      },
    });
  } else {
    application = await prisma.application.create({
      data: {
        ...formatted,
        riskScore,
      },
    });
  }

  return { application: formatApplication(application), created: isNew };
}

export async function createManyApplications(applications: CreateApplicationDto[]): Promise<Application[]> {
  const results: Application[] = [];

  for (const data of applications) {
    const { application } = await upsertApplication(data);
    results.push(application);
  }

  return results;
}

export async function updateApplication(id: string, data: Partial<CreateApplicationDto>): Promise<Application | null> {
  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) return null;

  const formatted = {
    ...data,
    passwordComplexity: data.passwordComplexity ?? null,
    mfa: data.mfa ?? null,
    endOfLife: data.endOfLife ?? null,
    eolWithin12Months: data.eolWithin12Months ?? null,
    siemIntegration: data.siemIntegration ?? null,
    encryption: data.encryption ?? null,
    capacityManagement: data.capacityManagement ?? null,
    wafEnabled: data.wafEnabled ?? null,
    internetFacing: data.internetFacing ?? null,
    thirdPartyInvolvement: data.thirdPartyInvolvement ?? null,
  };

  const updated = await prisma.application.update({
    where: { id },
    data: formatted as never,
  });

  const formattedApp = formatApplication(updated);
  const riskScore = calculateRiskScore(formattedApp);

  const withRisk = await prisma.application.update({
    where: { id },
    data: { riskScore },
  });

  return formatApplication(withRisk);
}

export async function deleteApplication(id: string): Promise<boolean> {
  try {
    await prisma.application.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function deleteAllApplications(): Promise<number> {
  const result = await prisma.application.deleteMany({});
  return result.count;
}

function formatApplication(app: {
  id: string;
  name: string;
  criticality?: string | null;
  description?: string | null;
  owner?: string | null;
  department?: string | null;
  incidents: number;
  incidentsSev1?: number | null;
  incidentsSev2?: number | null;
  incidentsSev3?: number | null;
  auditFindings: number;
  vaptFindings: number;
  vaptCritical?: number | null;
  vaptHigh?: number | null;
  vaptMedium?: number | null;
  vaptLow?: number | null;
  passwordComplexity?: boolean | null;
  mfa?: boolean | null;
  endOfLife?: boolean | null;
  eolWithin12Months?: boolean | null;
  siemIntegration?: boolean | null;
  encryption?: boolean | null;
  capacityManagement?: boolean | null;
  wafEnabled?: boolean | null;
  internetFacing?: boolean | null;
  thirdPartyInvolvement?: boolean | null;
  hostingExternal?: string | null;
  riskScore: number;
  createdAt: Date;
  updatedAt: Date;
}): Application {
  return {
    id: app.id,
    name: app.name,
    criticality: app.criticality ?? undefined,
    description: app.description ?? undefined,
    owner: app.owner ?? undefined,
    department: app.department ?? undefined,
    incidents: app.incidents,
    incidentsSev1: app.incidentsSev1 ?? undefined,
    incidentsSev2: app.incidentsSev2 ?? undefined,
    incidentsSev3: app.incidentsSev3 ?? undefined,
    auditFindings: app.auditFindings,
    vaptFindings: app.vaptFindings,
    vaptCritical: app.vaptCritical ?? undefined,
    vaptHigh: app.vaptHigh ?? undefined,
    vaptMedium: app.vaptMedium ?? undefined,
    vaptLow: app.vaptLow ?? undefined,
    passwordComplexity: app.passwordComplexity ?? undefined,
    mfa: app.mfa ?? undefined,
    endOfLife: app.endOfLife ?? undefined,
    eolWithin12Months: app.eolWithin12Months ?? undefined,
    siemIntegration: app.siemIntegration ?? undefined,
    encryption: app.encryption ?? undefined,
    capacityManagement: app.capacityManagement ?? undefined,
    wafEnabled: app.wafEnabled ?? undefined,
    internetFacing: app.internetFacing ?? undefined,
    thirdPartyInvolvement: app.thirdPartyInvolvement ?? undefined,
    hostingExternal: app.hostingExternal ?? undefined,
    riskScore: app.riskScore,
  };
}
