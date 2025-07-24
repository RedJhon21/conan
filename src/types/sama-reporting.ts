// SAMA (Saudi Central Bank) Reporting Standards Types

export interface SAMAReportConfig extends BaseReportConfig {
  reportType: 'incident' | 'regulatory' | 'investigation' | 'risk-assessment' | 'compliance-audit' | 'executive';
  template: 'sama-standard' | 'iso27001' | 'nist' | 'custom';
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  language: 'en' | 'ar' | 'both';
  digitalSignature: boolean;
  watermark: boolean;
  distribution: {
    internal: string[];
    external: string[];
    regulatorySubmission: boolean;
  };
}

export interface BaseReportConfig {
  type: 'summary' | 'detailed' | 'trends' | 'performance';
  format: 'pdf' | 'excel' | 'csv' | 'print';
  period: 'last24h' | 'last7d' | 'last30d' | 'custom';
  includeCharts: boolean;
  includePatterns: boolean;
  includePerformance: boolean;
  confidentialityLevel: 'public' | 'internal' | 'confidential';
}

export interface IncidentReport {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  
  // SAMA Required Fields
  incidentType: 'fraud' | 'cyber' | 'operational' | 'compliance' | 'other';
  discoveryDate: Date;
  reportingDate: Date;
  incidentDate: Date;
  description: string;
  impactAssessment: {
    financial: number;
    operational: string;
    regulatory: string;
    reputational: string;
  };
  
  // Investigation Details
  investigation: {
    leadInvestigator: string;
    team: string[];
    methodology: string;
    findings: string;
    evidence: EvidenceItem[];
    timeline: TimelineEvent[];
  };
  
  // Root Cause Analysis
  rootCause: {
    primaryCause: string;
    contributingFactors: string[];
    systemFailures: string[];
    humanFactors: string[];
  };
  
  // Response & Remediation
  response: {
    immediateActions: ResponseAction[];
    correctiveActions: ResponseAction[];
    preventiveActions: ResponseAction[];
    lessonsLearned: string[];
  };
  
  // Regulatory Compliance
  regulatory: {
    samaNotified: boolean;
    notificationDate?: Date;
    regulatoryRequirements: string[];
    complianceStatus: 'compliant' | 'non-compliant' | 'under-review';
  };
  
  // Metadata
  createdBy: string;
  lastModified: Date;
  approvals: ApprovalRecord[];
  attachments: AttachmentInfo[];
}

export interface EvidenceItem {
  id: string;
  type: 'document' | 'screenshot' | 'log-file' | 'transaction-data' | 'other';
  name: string;
  description: string;
  hash: string;
  chainOfCustody: ChainOfCustodyRecord[];
}

export interface TimelineEvent {
  timestamp: Date;
  event: string;
  source: string;
  impact: 'critical' | 'high' | 'medium' | 'low' | 'none';
  description: string;
}

export interface ResponseAction {
  id: string;
  action: string;
  assignee: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  completionDate?: Date;
  evidence?: string[];
}

export interface ChainOfCustodyRecord {
  timestamp: Date;
  person: string;
  action: 'created' | 'accessed' | 'modified' | 'transferred' | 'archived';
  details: string;
}

export interface ApprovalRecord {
  approver: string;
  role: string;
  timestamp: Date;
  status: 'approved' | 'rejected' | 'pending';
  comments?: string;
  digitalSignature?: string;
}

export interface AttachmentInfo {
  id: string;
  filename: string;
  size: number;
  contentType: string;
  uploadDate: Date;
  uploadedBy: string;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface SAMATemplate {
  id: string;
  name: string;
  type: 'incident' | 'regulatory' | 'investigation' | 'risk-assessment' | 'compliance-audit' | 'executive';
  standard: 'sama-standard' | 'iso27001' | 'nist' | 'custom';
  version: string;
  sections: TemplateSection[];
  mandatoryFields: string[];
  approvalWorkflow: ApprovalWorkflow[];
  retentionPeriod: number; // in years
  autoArchive: boolean;
}

export interface TemplateSection {
  id: string;
  title: string;
  order: number;
  required: boolean;
  type: 'text' | 'table' | 'chart' | 'image' | 'attachment' | 'signature';
  content?: string;
  fields?: TemplateField[];
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'textarea' | 'file';
  required: boolean;
  validation?: string;
  options?: string[];
  defaultValue?: any;
}

export interface ApprovalWorkflow {
  step: number;
  role: string;
  required: boolean;
  parallel: boolean;
  conditions?: string[];
}

export interface EnhancedAISummary {
  // Existing fields
  transactionId: string;
  overview: TransactionOverview;
  riskAssessment: RiskAssessment;
  fraudIndicators: FraudIndicator[];
  recommendations: Recommendation[];
  historicalContext: HistoricalContext;
  
  // Enhanced fields for SAMA compliance
  regulatoryAnalysis: {
    samaRequirements: string[];
    complianceStatus: 'compliant' | 'non-compliant' | 'requires-review';
    potentialViolations: string[];
    recommendedActions: string[];
  };
  
  patternAnalysis: {
    detectedPatterns: PatternMatch[];
    riskCorrelations: RiskCorrelation[];
    behavioralAnomalies: BehavioralAnomaly[];
  };
  
  incidentClassification: {
    incidentType: 'fraud' | 'suspicious' | 'normal' | 'requires-investigation';
    severity: 'critical' | 'high' | 'medium' | 'low';
    reportingRequired: boolean;
    escalationNeeded: boolean;
  };
  
  downloadableReports: {
    incidentReport?: string;
    complianceReport?: string;
    investigationReport?: string;
  };
}

export interface TransactionOverview {
  amount: string;
  merchant: string;
  location: string;
  timestamp: string;
  type: string;
}

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high';
  confidence: number;
  analysis: string;
}

export interface FraudIndicator {
  factor: string;
  weight: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  action: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
}

export interface HistoricalContext {
  similarTransactions: number;
  merchantHistory: string;
  locationAnalysis: string;
}

export interface PatternMatch {
  patternType: string;
  confidence: number;
  description: string;
  riskContribution: number;
}

export interface RiskCorrelation {
  factor1: string;
  factor2: string;
  correlation: number;
  impact: string;
}

export interface BehavioralAnomaly {
  type: string;
  deviation: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ReportGenerationOptions {
  includeAIAnalysis: boolean;
  includePatternDetection: boolean;
  includeRegulatoryCompliance: boolean;
  includeDigitalSignature: boolean;
  includeWatermark: boolean;
  autoDistribute: boolean;
  scheduleGeneration?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string;
    recipients: string[];
  };
}
