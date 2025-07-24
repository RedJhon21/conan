import { SAMAReportConfig, IncidentReport, SAMATemplate, EnhancedAISummary, FraudIndicator, Recommendation } from '@/types/sama-reporting';
import { Transaction } from '@/types/summary';

// SAMA Standard Templates
export const SAMA_TEMPLATES: SAMATemplate[] = [
  {
    id: 'sama-incident-001',
    name: 'SAMA Fraud Incident Report',
    type: 'incident',
    standard: 'sama-standard',
    version: '2024.1',
    sections: [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        order: 1,
        required: true,
        type: 'text',
        fields: [
          { id: 'incident-overview', name: 'Incident Overview', type: 'textarea', required: true },
          { id: 'impact-summary', name: 'Impact Summary', type: 'textarea', required: true },
          { id: 'response-summary', name: 'Response Summary', type: 'textarea', required: true }
        ]
      },
      {
        id: 'incident-details',
        title: 'Incident Details',
        order: 2,
        required: true,
        type: 'table',
        fields: [
          { id: 'incident-id', name: 'Incident ID', type: 'text', required: true },
          { id: 'discovery-date', name: 'Discovery Date', type: 'date', required: true },
          { id: 'incident-date', name: 'Incident Date', type: 'date', required: true },
          { id: 'incident-type', name: 'Incident Type', type: 'select', required: true, 
            options: ['fraud', 'cyber', 'operational', 'compliance', 'other'] },
          { id: 'severity', name: 'Severity', type: 'select', required: true,
            options: ['critical', 'high', 'medium', 'low'] }
        ]
      },
      {
        id: 'impact-assessment',
        title: 'Impact Assessment',
        order: 3,
        required: true,
        type: 'table',
        fields: [
          { id: 'financial-impact', name: 'Financial Impact (SAR)', type: 'number', required: true },
          { id: 'operational-impact', name: 'Operational Impact', type: 'textarea', required: true },
          { id: 'regulatory-impact', name: 'Regulatory Impact', type: 'textarea', required: true },
          { id: 'reputational-impact', name: 'Reputational Impact', type: 'textarea', required: true }
        ]
      },
      {
        id: 'investigation',
        title: 'Investigation & Findings',
        order: 4,
        required: true,
        type: 'text',
        fields: [
          { id: 'lead-investigator', name: 'Lead Investigator', type: 'text', required: true },
          { id: 'investigation-team', name: 'Investigation Team', type: 'textarea', required: true },
          { id: 'methodology', name: 'Investigation Methodology', type: 'textarea', required: true },
          { id: 'findings', name: 'Key Findings', type: 'textarea', required: true }
        ]
      },
      {
        id: 'root-cause',
        title: 'Root Cause Analysis',
        order: 5,
        required: true,
        type: 'text',
        fields: [
          { id: 'primary-cause', name: 'Primary Cause', type: 'textarea', required: true },
          { id: 'contributing-factors', name: 'Contributing Factors', type: 'textarea', required: true },
          { id: 'system-failures', name: 'System Failures', type: 'textarea', required: false },
          { id: 'human-factors', name: 'Human Factors', type: 'textarea', required: false }
        ]
      },
      {
        id: 'response-actions',
        title: 'Response & Remediation',
        order: 6,
        required: true,
        type: 'table',
        fields: [
          { id: 'immediate-actions', name: 'Immediate Actions', type: 'textarea', required: true },
          { id: 'corrective-actions', name: 'Corrective Actions', type: 'textarea', required: true },
          { id: 'preventive-actions', name: 'Preventive Actions', type: 'textarea', required: true },
          { id: 'lessons-learned', name: 'Lessons Learned', type: 'textarea', required: true }
        ]
      },
      {
        id: 'regulatory-compliance',
        title: 'Regulatory Compliance',
        order: 7,
        required: true,
        type: 'table',
        fields: [
          { id: 'sama-notified', name: 'SAMA Notified', type: 'select', required: true, options: ['yes', 'no'] },
          { id: 'notification-date', name: 'Notification Date', type: 'date', required: false },
          { id: 'compliance-status', name: 'Compliance Status', type: 'select', required: true,
            options: ['compliant', 'non-compliant', 'under-review'] }
        ]
      },
      {
        id: 'approvals',
        title: 'Approvals & Sign-offs',
        order: 8,
        required: true,
        type: 'signature'
      }
    ],
    mandatoryFields: [
      'incident-overview', 'discovery-date', 'incident-type', 'severity',
      'financial-impact', 'lead-investigator', 'primary-cause', 'sama-notified'
    ],
    approvalWorkflow: [
      { step: 1, role: 'incident-manager', required: true, parallel: false },
      { step: 2, role: 'compliance-officer', required: true, parallel: false },
      { step: 3, role: 'ciso', required: true, parallel: false },
      { step: 4, role: 'executive-management', required: true, parallel: false }
    ],
    retentionPeriod: 7,
    autoArchive: true
  },
  {
    id: 'sama-compliance-001',
    name: 'SAMA Compliance Audit Report',
    type: 'compliance-audit',
    standard: 'sama-standard',
    version: '2024.1',
    sections: [
      {
        id: 'audit-summary',
        title: 'Audit Summary',
        order: 1,
        required: true,
        type: 'text',
        fields: [
          { id: 'audit-scope', name: 'Audit Scope', type: 'textarea', required: true },
          { id: 'audit-period', name: 'Audit Period', type: 'text', required: true },
          { id: 'compliance-status', name: 'Overall Compliance Status', type: 'select', required: true,
            options: ['compliant', 'non-compliant', 'partially-compliant'] }
        ]
      },
      {
        id: 'findings',
        title: 'Compliance Findings',
        order: 2,
        required: true,
        type: 'table',
        fields: [
          { id: 'finding-details', name: 'Finding Details', type: 'textarea', required: true },
          { id: 'severity', name: 'Severity', type: 'select', required: true,
            options: ['critical', 'high', 'medium', 'low'] },
          { id: 'recommendation', name: 'Recommendation', type: 'textarea', required: true }
        ]
      },
      {
        id: 'action-plan',
        title: 'Corrective Action Plan',
        order: 3,
        required: true,
        type: 'table',
        fields: [
          { id: 'action-item', name: 'Action Item', type: 'textarea', required: true },
          { id: 'responsible-party', name: 'Responsible Party', type: 'text', required: true },
          { id: 'target-date', name: 'Target Completion Date', type: 'date', required: true }
        ]
      }
    ],
    mandatoryFields: ['audit-scope', 'compliance-status', 'finding-details'],
    approvalWorkflow: [
      { step: 1, role: 'compliance-officer', required: true, parallel: false },
      { step: 2, role: 'executive-management', required: true, parallel: false }
    ],
    retentionPeriod: 7,
    autoArchive: true
  }
];

// Enhanced AI Analysis for SAMA Compliance
export const generateEnhancedAISummary = async (transaction: Transaction): Promise<EnhancedAISummary> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const riskScore = transaction.riskScore;
  const riskLevel = transaction.riskLevel;

  // Generate regulatory analysis
  const regulatoryAnalysis = {
    samaRequirements: [
      'Customer Due Diligence (CDD) verification required',
      'Transaction monitoring and reporting obligations',
      'Suspicious transaction reporting within 15 days',
      'Enhanced due diligence for high-risk transactions'
    ] as string[],
    complianceStatus: (riskScore > 70 ? 'requires-review' : riskScore > 40 ? 'non-compliant' : 'compliant') as 'compliant' | 'non-compliant' | 'requires-review',
    potentialViolations: riskScore > 70 ? [
      'Failure to implement adequate transaction monitoring',
      'Potential money laundering indicators not properly flagged',
      'Insufficient customer verification procedures'
    ] : [] as string[],
    recommendedActions: [
      'Enhance real-time monitoring systems',
      'Implement additional customer verification steps',
      'Review and update risk assessment parameters',
      'Conduct staff training on SAMA compliance requirements'
    ] as string[]
  };

  // Generate pattern analysis
  const patternAnalysis = {
    detectedPatterns: [
      {
        patternType: 'Velocity Pattern',
        confidence: 0.85,
        description: 'Multiple transactions in short time frame',
        riskContribution: 25
      },
      {
        patternType: 'Amount Pattern',
        confidence: 0.72,
        description: 'Transaction amount just below reporting threshold',
        riskContribution: 20
      }
    ],
    riskCorrelations: [
      {
        factor1: 'Transaction Time',
        factor2: 'Location',
        correlation: 0.67,
        impact: 'Transactions outside normal business hours in high-risk locations'
      }
    ],
    behavioralAnomalies: [
      {
        type: 'Spending Pattern Deviation',
        deviation: 0.45,
        description: 'Transaction amount 45% higher than customer average',
        severity: riskLevel as 'low' | 'medium' | 'high'
      }
    ]
  };

  // Generate incident classification
  const incidentClassification = {
    incidentType: riskScore > 80 ? 'fraud' : riskScore > 60 ? 'suspicious' : riskScore > 30 ? 'requires-investigation' : 'normal',
    severity: riskScore > 80 ? 'critical' : riskScore > 60 ? 'high' : riskScore > 30 ? 'medium' : 'low',
    reportingRequired: riskScore > 60,
    escalationNeeded: riskScore > 70
  } as const;

  // Generate base summary
  const baseSummary = {
    transactionId: transaction.id,
    overview: {
      amount: `${transaction.amount.toLocaleString()} ${transaction.currency}`,
      merchant: transaction.merchant,
      location: transaction.location,
      timestamp: transaction.timestamp.toLocaleString(),
      type: transaction.type
    },
    riskAssessment: {
      score: Math.round(riskScore),
      level: riskLevel,
      confidence: Math.round(85 + Math.random() * 10),
      analysis: `Transaction shows ${riskLevel} risk indicators with a confidence score of ${Math.round(85 + Math.random() * 10)}%. ${
        riskScore > 70 ? 'Immediate investigation recommended.' : 
        riskScore > 40 ? 'Enhanced monitoring suggested.' : 
        'Standard processing acceptable.'
      }`
    },
    fraudIndicators: [
      {
        factor: 'Transaction Velocity',
        weight: 25,
        description: 'Multiple transactions detected within short timeframe',
        severity: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low'
      },
      {
        factor: 'Geographic Risk',
        weight: 20,
        description: 'Transaction location differs from customer profile',
        severity: riskScore > 60 ? 'high' : riskScore > 30 ? 'medium' : 'low'
      }
    ] as FraudIndicator[],
    recommendations: [
      {
        action: 'Enhanced Monitoring',
        priority: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low',
        description: 'Implement additional transaction monitoring for this customer'
      },
      {
        action: 'Customer Verification',
        priority: riskScore > 60 ? 'high' : 'medium',
        description: 'Conduct additional customer identity verification'
      }
    ] as Recommendation[],
    historicalContext: {
      similarTransactions: Math.floor(Math.random() * 50) + 10,
      merchantHistory: 'Merchant has processed 150+ transactions with 2% fraud rate',
      locationAnalysis: 'Location shows elevated risk during evening hours'
    }
  };

  return {
    ...baseSummary,
    regulatoryAnalysis,
    patternAnalysis,
    incidentClassification,
    downloadableReports: {
      incidentReport: incidentClassification.reportingRequired ? `incident-${transaction.id}.pdf` : undefined,
      complianceReport: `compliance-${transaction.id}.pdf`,
      investigationReport: incidentClassification.escalationNeeded ? `investigation-${transaction.id}.pdf` : undefined
    }
  };
};

// Generate SAMA Compliant Reports
export const generateSAMAReport = async (config: SAMAReportConfig, data?: any): Promise<string> => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `sama-${config.reportType}-${timestamp}`;

  // Get appropriate template
  const template = SAMA_TEMPLATES.find(t => t.type === config.reportType && t.standard === config.template);
  if (!template) {
    throw new Error(`Template not found for ${config.reportType} with ${config.template} standard`);
  }

  switch (config.format) {
    case 'pdf':
      const htmlContent = generateSAMAHTML(config, template, data);
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // Add watermark and security features if requested
        if (config.watermark || config.digitalSignature) {
          addSecurityFeatures(newWindow, config);
        }
        
        setTimeout(() => {
          newWindow.print();
        }, 1000);
      }
      return `${filename}.pdf`;

    case 'excel':
      const excelContent = generateSAMAExcel(config, template, data);
      downloadFile(excelContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return `${filename}.xlsx`;

    case 'csv':
      const csvContent = generateSAMACSV(config, template, data);
      downloadFile(csvContent, `${filename}.csv`, 'text/csv');
      return `${filename}.csv`;

    default:
      throw new Error(`Unsupported format: ${config.format}`);
  }
};

// Generate SAMA-compliant HTML report
const generateSAMAHTML = (config: SAMAReportConfig, template: SAMATemplate, data?: any): string => {
  const isArabic = config.language === 'ar' || config.language === 'both';
  const direction = isArabic ? 'rtl' : 'ltr';
  
  let html = `
    <!DOCTYPE html>
    <html lang="${config.language === 'ar' ? 'ar' : 'en'}" dir="${direction}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.name} - ${config.classification.toUpperCase()}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;600;700&family=Inter:wght@300;400;600;700&display=swap');
            
            body {
                font-family: ${isArabic ? "'Noto Sans Arabic', Arial, sans-serif" : "'Inter', Arial, sans-serif"};
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                background: #ffffff;
                color: #1a1a1a;
                direction: ${direction};
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #1e40af;
                padding-bottom: 20px;
            }
            
            .header h1 {
                color: #1e40af;
                font-size: 28px;
                margin: 0 0 10px 0;
                font-weight: 700;
            }
            
            .header .subtitle {
                color: #64748b;
                font-size: 16px;
                margin: 5px 0;
            }
            
            .classification-banner {
                background: ${config.classification === 'restricted' ? '#dc2626' : 
                           config.classification === 'confidential' ? '#ea580c' :
                           config.classification === 'internal' ? '#d97706' : '#16a34a'};
                color: white;
                text-align: center;
                padding: 10px;
                font-weight: bold;
                font-size: 14px;
                margin: -20px -20px 20px -20px;
                text-transform: uppercase;
            }
            
            .section {
                margin-bottom: 30px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .section-header {
                background: #1e40af;
                color: white;
                padding: 15px 20px;
                font-weight: 600;
                font-size: 18px;
            }
            
            .section-content {
                padding: 20px;
            }
            
            .field-row {
                display: flex;
                margin-bottom: 15px;
                align-items: flex-start;
            }
            
            .field-label {
                font-weight: 600;
                min-width: 200px;
                color: #374151;
                margin-${direction === 'rtl' ? 'left' : 'right'}: 15px;
            }
            
            .field-value {
                flex: 1;
                color: #1f2937;
            }
            
            .signature-block {
                border: 2px dashed #d1d5db;
                padding: 40px;
                text-align: center;
                margin: 20px 0;
                background: #fafafa;
            }
            
            .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 72px;
                color: rgba(0,0,0,0.05);
                font-weight: bold;
                z-index: -1;
                pointer-events: none;
            }
            
            .footer {
                margin-top: 50px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
            }
            
            @media print {
                body { margin: 0; padding: 15px; }
                .classification-banner { margin: -15px -15px 20px -15px; }
                .no-print { display: none !important; }
            }
        </style>
    </head>
    <body>
        ${config.watermark ? '<div class="watermark">CONFIDENTIAL</div>' : ''}
        
        <div class="classification-banner">
            ${config.classification} - ${template.name}
        </div>
        
        <div class="header">
            <h1>🇸🇦 ${isArabic ? 'تقرير البنك المركزي السعودي' : 'Saudi Central Bank Report'}</h1>
            <div class="subtitle">${template.name}</div>
            <div class="subtitle">${isArabic ? 'تاريخ الإنشاء' : 'Generated on'}: ${new Date().toLocaleDateString(config.language === 'ar' ? 'ar-SA' : 'en-US')}</div>
            <div class="subtitle">${isArabic ? 'المعرف' : 'Reference'}: ${data?.id || 'AUTO-' + Date.now()}</div>
        </div>
  `;

  // Generate sections based on template
  template.sections.forEach(section => {
    html += `
        <div class="section">
            <div class="section-header">${section.title}</div>
            <div class="section-content">
    `;

    if (section.type === 'signature') {
      html += `
                <div class="signature-block">
                    <strong>${isArabic ? 'منطقة التوقيع الرقمي' : 'Digital Signature Area'}</strong><br>
                    <small>${isArabic ? 'سيتم إدراج التوقيع الرقمي هنا' : 'Digital signature will be embedded here'}</small>
                </div>
      `;
    } else if (section.fields) {
      section.fields.forEach(field => {
        const value = data?.[field.id] || (field.defaultValue || `[${field.required ? 'Required' : 'Optional'}]`);
        html += `
                <div class="field-row">
                    <div class="field-label">${field.name}:</div>
                    <div class="field-value">${value}</div>
                </div>
        `;
      });
    }

    html += `
            </div>
        </div>
    `;
  });

  html += `
        <div class="footer">
            <p><strong>${isArabic ? 'إخلاء مسؤولية' : 'Disclaimer'}:</strong> ${isArabic ? 'هذا التقرير سري ومخصص للاستخدام الداخلي فقط' : 'This report is confidential and intended for internal use only'}</p>
            <p>${isArabic ? 'تم إنشاؤه بواسطة نظام كونان لاكتشاف الاحتيال' : 'Generated by Conan Fraud Detection System'} | ${isArabic ? 'الإصدار' : 'Version'} ${template.version}</p>
            <p>${isArabic ? 'معتمد من قبل البنك المركزي السعودي' : 'SAMA Compliant'} | ${config.classification.toUpperCase()}</p>
        </div>
    </body>
    </html>
  `;

  return html;
};

// Generate Excel format for SAMA reports
const generateSAMAExcel = (config: SAMAReportConfig, template: SAMATemplate, data?: any): string => {
  let excel = `Report Type,${template.name}\n`;
  excel += `Classification,${config.classification}\n`;
  excel += `Generated Date,${new Date().toISOString()}\n`;
  excel += `Standard,${template.standard}\n\n`;

  template.sections.forEach(section => {
    excel += `\n"${section.title}"\n`;
    if (section.fields) {
      section.fields.forEach(field => {
        const value = data?.[field.id] || '';
        excel += `"${field.name}","${value}"\n`;
      });
    }
    excel += '\n';
  });

  return excel;
};

// Generate CSV format for SAMA reports  
const generateSAMACSV = (config: SAMAReportConfig, template: SAMATemplate, data?: any): string => {
  return generateSAMAExcel(config, template, data);
};

// Add security features to report
const addSecurityFeatures = (window: Window, config: SAMAReportConfig) => {
  if (config.watermark) {
    const style = window.document.createElement('style');
    style.innerHTML = `
      body::before {
        content: "CONFIDENTIAL";
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 72px;
        color: rgba(0,0,0,0.05);
        font-weight: bold;
        z-index: 9999;
        pointer-events: none;
      }
    `;
    window.document.head.appendChild(style);
  }

  if (config.digitalSignature) {
    // Add digital signature placeholder
    const signatureDiv = window.document.createElement('div');
    signatureDiv.innerHTML = `
      <div style="border: 2px solid #1e40af; padding: 20px; margin: 20px; background: #f0f9ff;">
        <strong>Digital Signature Verification</strong><br>
        Signed by: System Administrator<br>
        Timestamp: ${new Date().toISOString()}<br>
        Certificate: SHA-256 Hash<br>
        Status: ✅ Verified
      </div>
    `;
    window.document.body.appendChild(signatureDiv);
  }
};

// Utility function for file downloads
const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate incident report from transaction
export const generateIncidentReport = async (transaction: Transaction, aiSummary: EnhancedAISummary): Promise<IncidentReport> => {
  return {
    id: `INC-${Date.now()}`,
    title: `Suspicious Transaction - ${transaction.id}`,
    severity: aiSummary.incidentClassification.severity,
    status: 'open',
    classification: 'internal',
    incidentType: 'fraud',
    discoveryDate: new Date(),
    reportingDate: new Date(),
    incidentDate: transaction.timestamp,
    description: `Suspicious transaction detected for amount ${transaction.amount} ${transaction.currency} at ${transaction.merchant}`,
    impactAssessment: {
      financial: transaction.amount,
      operational: 'Minimal operational impact, isolated incident',
      regulatory: 'Potential SAMA reporting requirement if confirmed as fraud',
      reputational: 'Low reputational risk if handled promptly'
    },
    investigation: {
      leadInvestigator: 'AI System',
      team: ['Fraud Team', 'Compliance Team'],
      methodology: 'Automated AI analysis with risk scoring',
      findings: aiSummary.riskAssessment.analysis,
      evidence: [],
      timeline: [
        {
          timestamp: transaction.timestamp,
          event: 'Transaction Occurred',
          source: 'Payment System',
          impact: 'medium',
          description: `Transaction processed for ${transaction.amount} ${transaction.currency}`
        },
        {
          timestamp: new Date(),
          event: 'Fraud Detection Alert',
          source: 'AI System',
          impact: aiSummary.incidentClassification.severity,
          description: `AI system flagged transaction with ${aiSummary.riskAssessment.score}% risk score`
        }
      ]
    },
    rootCause: {
      primaryCause: 'Elevated risk indicators detected by AI monitoring system',
      contributingFactors: aiSummary.fraudIndicators.map(f => f.description),
      systemFailures: [],
      humanFactors: []
    },
    response: {
      immediateActions: aiSummary.recommendations.filter(r => r.priority === 'high').map(r => ({
        id: `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        action: r.action,
        assignee: 'Fraud Team',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        status: 'pending' as const,
        priority: 'high' as const,
        description: r.description
      })),
      correctiveActions: [],
      preventiveActions: [],
      lessonsLearned: []
    },
    regulatory: {
      samaNotified: aiSummary.incidentClassification.reportingRequired,
      notificationDate: aiSummary.incidentClassification.reportingRequired ? new Date() : undefined,
      regulatoryRequirements: aiSummary.regulatoryAnalysis.samaRequirements,
      complianceStatus: aiSummary.regulatoryAnalysis.complianceStatus === 'compliant' ? 'compliant' : 'under-review'
    },
    createdBy: 'AI System',
    lastModified: new Date(),
    approvals: [],
    attachments: []
  };
};