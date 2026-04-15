import * as XLSX from 'xlsx';
import { Application } from '../types/application.js';
import { calculateRiskScore } from './riskCalculator.js';

const SKIP_ROW_LABELS = new Set(['application risk assessment', 'application risk']);

function parseYesNo(value: unknown): boolean {
  const s = String(value ?? '').trim().toLowerCase();
  return s === 'yes' || s === 'true';
}

function parseWaf(value: unknown): boolean | null {
  const s = String(value ?? '').trim().toLowerCase();
  if (s === 'yes' || s === 'true') return true;
  if (s === 'no' || s === 'false') return false;
  if (s === 'n/a' || s === 'na' || s === '') return null;
  return null;
}

function resolveWafEnabled(value: unknown): boolean | null {
  const w = parseWaf(value);
  if (w !== null) return w;
  const s = String(value ?? '').trim();
  if (s === '') return null;
  return parseYesNo(value) ? true : false;
}

function parseHostingExternal(value: unknown): string {
  const s = String(value ?? '').trim().toLowerCase();
  if (s.includes('external') || s.includes('cloud') || s.includes('vendor')) return 'Yes';
  if (s.includes('internal') || s.includes('on-prem') || s.includes('on prem') || s.includes('onprem')) return 'No';
  return '';
}

function buildLabelMap(rows: unknown[][]): Record<string, unknown> {
  const labelMap: Record<string, unknown> = {};
  
  for (const row of rows) {
    if (!row || row.length < 2) continue;
    
    const label = String(row[0] ?? '').trim();
    if (!label) continue;
    
    const lower = label.toLowerCase();
    const canonical = lower.replace(/:\s*$/, '').trim();
    
    if (SKIP_ROW_LABELS.has(canonical)) continue;
    
    const value = row[1];
    labelMap[lower] = value;
    labelMap[canonical] = value;
  }
  
  return labelMap;
}

function pickString(map: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const lower = k.toLowerCase();
    if (map[lower] !== undefined) {
      return String(map[lower] ?? '').trim();
    }
  }
  return '';
}

function pickInt(map: Record<string, unknown>, ...keys: string[]): number {
  for (const k of keys) {
    const lower = k.toLowerCase();
    if (map[lower] !== undefined) {
      const raw = map[lower];
      if (raw === undefined || raw === null || raw === '') return 0;
      const n = Number.parseInt(String(raw).replace(/,/g, '').trim(), 10);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 0;
}

function generateId(): string {
  return 'app_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function parseExcelFile(buffer: Buffer): Application[] {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!worksheet) {
    throw new Error('No worksheet found in Excel file');
  }

  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

  if (jsonData.length < 2) {
    throw new Error('Excel file appears to be empty');
  }

  const dataMap = buildLabelMap(jsonData);

  const applicationName = pickString(dataMap, 'Application Name', 'application name') || 'Unknown App';

  const incidentsSev1 = pickInt(dataMap, 'Incident-S1', 'incident-s1', 'incident s1');
  const incidentsSev2 = pickInt(dataMap, 'Incident-S2', 'incident-s2', 'incident s2');
  const incidentsSev3 = pickInt(dataMap, 'Incident-S3', 'incident-s3', 'incident s3');

  const auditFindings = pickInt(dataMap, 'Audit Findings', 'audit findings');

  const vaptCritical = pickInt(dataMap, 'VAPT-Critical', 'vapt-critical', 'vapt critical');
  const vaptHigh = pickInt(dataMap, 'VAPT-High', 'vapt-high', 'vapt high');
  const vaptMedium = pickInt(dataMap, 'VAPT-Medium', 'vapt-medium', 'vapt medium');
  const vaptLow = pickInt(dataMap, 'VAPT-Low', 'vapt-low', 'vapt low');

  const vaptSum = vaptCritical + vaptHigh + vaptMedium + vaptLow;
  const vaptFindingsTotal = vaptSum > 0 ? vaptSum : pickInt(dataMap, 'VAPT Findings', 'vapt findings');

  const mfa = parseYesNo(pickString(dataMap, 'MFA Enabled', 'mfa enabled'));
  const siemIntegration = parseYesNo(pickString(dataMap, 'SIEM Integration', 'siem integration'));
  const encryption = parseYesNo(pickString(dataMap, 'Encryption', 'encryption'));
  const capacityManagement = parseYesNo(pickString(dataMap, 'Capacity Management', 'capacity management'));
  const passwordComplexity = parseYesNo(pickString(dataMap, 'Password Complexity as per ISPG'));

  const wafEnabled = resolveWafEnabled(pickString(dataMap, 'WAF Enabled', 'waf enabled'));
  const internetFacing = parseYesNo(pickString(dataMap, 'Internet Facing', 'internet facing'));
  const thirdPartyInvolvement = parseYesNo(pickString(dataMap, 'Third Party Involvement', 'third party involvement'));
  const hostingExternal = parseHostingExternal(pickString(dataMap, 'Hosting Location', 'hosting location'));

  const endOfLifeRaw = pickString(dataMap, 'End-of-Life', 'end-of-life', 'end of life');
  const endOfLife = endOfLifeRaw.toLowerCase() === 'yes';

  const application: Application = {
    id: generateId(),
    name: applicationName,
    criticality: pickString(dataMap, 'Application Criticality', 'application criticality', 'criticality') || undefined,
    description: pickString(dataMap, 'Description', 'description') || undefined,
    owner: pickString(dataMap, 'Owner', 'owner') || undefined,
    department: pickString(dataMap, 'Department', 'department') || undefined,
    incidents: incidentsSev1 + incidentsSev2 + incidentsSev3,
    incidentsSev1: incidentsSev1 || undefined,
    incidentsSev2: incidentsSev2 || undefined,
    incidentsSev3: incidentsSev3 || undefined,
    auditFindings,
    vaptFindings: vaptFindingsTotal,
    vaptCritical: vaptCritical || undefined,
    vaptHigh: vaptHigh || undefined,
    vaptMedium: vaptMedium || undefined,
    vaptLow: vaptLow || undefined,
    passwordComplexity: passwordComplexity || undefined,
    mfa: mfa || undefined,
    endOfLife: endOfLife || undefined,
    eolWithin12Months: endOfLife || undefined,
    siemIntegration: siemIntegration || undefined,
    encryption: encryption || undefined,
    capacityManagement: capacityManagement || undefined,
    wafEnabled: wafEnabled ?? undefined,
    internetFacing: internetFacing || undefined,
    thirdPartyInvolvement: thirdPartyInvolvement || undefined,
    hostingExternal: hostingExternal || undefined,
    riskScore: 0,
  };

  application.riskScore = calculateRiskScore(application);

  return [application];
}
