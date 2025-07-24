interface ReportConfig {
  type: 'summary' | 'detailed' | 'trends' | 'performance' | 'incident' | 'regulatory' | 'investigation' | 'risk-assessment' | 'compliance-audit' | 'executive';
  format: 'pdf' | 'excel' | 'csv' | 'print';
  period: 'last24h' | 'last7d' | 'last30d' | 'custom';
  includeCharts: boolean;
  includePatterns: boolean;
  includePerformance: boolean;
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  // SAMA specific fields
  template?: 'sama-standard' | 'iso27001' | 'nist' | 'custom';
  language?: 'en' | 'ar' | 'both';
  digitalSignature?: boolean;
  watermark?: boolean;
}

interface ReportData {
  transactions: Array<{
    id: string;
    amount: number;
    currency: string;
    timestamp: string;
    location: string;
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    type: string;
    merchant: string;
  }>;
  analytics: {
    totalTransactions: number;
    totalAmount: number;
    averageRiskScore: number;
    fraudDetected: number;
    falsePositives: number;
  };
  patterns: Array<{
    type: string;
    confidence: number;
    description: string;
    transactions: number;
  }>;
  performance: {
    responseTime: number;
    accuracy: number;
    uptime: number;
  };
}

// Mock data generator
const generateMockData = (config: ReportConfig): ReportData => {
  const now = new Date();
  const periodHours = config.period === 'last24h' ? 24 : config.period === 'last7d' ? 168 : 720;
  
  const transactions = Array.from({ length: Math.floor(Math.random() * 100) + 50 }, (_, i) => {
    const timestamp = new Date(now.getTime() - Math.random() * periodHours * 60 * 60 * 1000);
    const riskScore = Math.random();
    return {
      id: `TXN${String(i + 1).padStart(6, '0')}`,
      amount: Math.floor(Math.random() * 10000) + 10,
      currency: 'USD',
      timestamp: timestamp.toISOString(),
      location: ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'][Math.floor(Math.random() * 5)],
      riskScore,
      riskLevel: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low' as 'low' | 'medium' | 'high',
      type: ['Purchase', 'Withdrawal', 'Transfer', 'Deposit'][Math.floor(Math.random() * 4)],
      merchant: ['Amazon', 'Apple', 'Google', 'Microsoft', 'Meta'][Math.floor(Math.random() * 5)]
    };
  });

  const analytics = {
    totalTransactions: transactions.length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    averageRiskScore: transactions.reduce((sum, t) => sum + t.riskScore, 0) / transactions.length,
    fraudDetected: transactions.filter(t => t.riskLevel === 'high').length,
    falsePositives: Math.floor(Math.random() * 5)
  };

  const patterns = [
    { type: 'Velocity Pattern', confidence: 0.85, description: 'Multiple rapid transactions', transactions: 12 },
    { type: 'Location Pattern', confidence: 0.72, description: 'Unusual geographic activity', transactions: 8 },
    { type: 'Amount Pattern', confidence: 0.91, description: 'Suspicious amount clustering', transactions: 15 }
  ];

  const performance = {
    responseTime: Math.random() * 50 + 10,
    accuracy: 0.94 + Math.random() * 0.05,
    uptime: 0.998 + Math.random() * 0.002
  };

  return { transactions, analytics, patterns, performance };
};

const generateCSV = (data: ReportData, config: ReportConfig): string => {
  let csv = 'Transaction ID,Amount,Currency,Date,Location,Risk Score,Risk Level,Type,Merchant\n';
  
  data.transactions.forEach(t => {
    csv += `${t.id},${t.amount},${t.currency},${t.timestamp},${t.location},${t.riskScore.toFixed(3)},${t.riskLevel},${t.type},${t.merchant}\n`;
  });

  if (config.includePatterns) {
    csv += '\n\nPatterns\n';
    csv += 'Type,Confidence,Description,Transactions\n';
    data.patterns.forEach(p => {
      csv += `${p.type},${p.confidence.toFixed(3)},${p.description},${p.transactions}\n`;
    });
  }

  return csv;
};

const generateHTML = (data: ReportData, config: ReportConfig): string => {
  const formatDate = (date: string) => new Date(date).toLocaleString();
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Conan Fraud Detection Report - ${config.type.toUpperCase()}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { background: #f5f5f5; padding: 20px; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .risk-high { color: #dc2626; font-weight: bold; }
            .risk-medium { color: #f59e0b; font-weight: bold; }
            .risk-low { color: #16a34a; font-weight: bold; }
            .metric { display: inline-block; margin: 10px 20px 10px 0; }
            .metric-value { font-size: 24px; font-weight: bold; color: #1f2937; }
            .metric-label { font-size: 14px; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🛡️ Conan Fraud Detection Report</h1>
            <h2>${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Report</h2>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Period: ${config.period.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
        </div>

        <div class="summary">
            <h3>Executive Summary</h3>
            <div class="metric">
                <div class="metric-value">${data.analytics.totalTransactions}</div>
                <div class="metric-label">Total Transactions</div>
            </div>
            <div class="metric">
                <div class="metric-value">${formatCurrency(data.analytics.totalAmount)}</div>
                <div class="metric-label">Total Amount</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.analytics.fraudDetected}</div>
                <div class="metric-label">Fraud Detected</div>
            </div>
            <div class="metric">
                <div class="metric-value">${(data.analytics.averageRiskScore * 100).toFixed(1)}%</div>
                <div class="metric-label">Avg Risk Score</div>
            </div>
        </div>

        <div class="section">
            <h3>Transaction Details</h3>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Risk Level</th>
                    <th>Merchant</th>
                </tr>
  `;

  data.transactions.slice(0, config.type === 'summary' ? 20 : 100).forEach(t => {
    html += `
                <tr>
                    <td>${t.id}</td>
                    <td>${formatCurrency(t.amount)}</td>
                    <td>${formatDate(t.timestamp)}</td>
                    <td>${t.location}</td>
                    <td class="risk-${t.riskLevel}">${t.riskLevel.toUpperCase()}</td>
                    <td>${t.merchant}</td>
                </tr>
    `;
  });

  html += `
            </table>
        </div>
  `;

  if (config.includePatterns) {
    html += `
        <div class="section">
            <h3>Fraud Patterns Detected</h3>
            <table>
                <tr>
                    <th>Pattern Type</th>
                    <th>Confidence</th>
                    <th>Description</th>
                    <th>Affected Transactions</th>
                </tr>
    `;
    
    data.patterns.forEach(p => {
      html += `
                <tr>
                    <td>${p.type}</td>
                    <td>${(p.confidence * 100).toFixed(1)}%</td>
                    <td>${p.description}</td>
                    <td>${p.transactions}</td>
                </tr>
      `;
    });

    html += `
            </table>
        </div>
    `;
  }

  if (config.includePerformance) {
    html += `
        <div class="section">
            <h3>System Performance</h3>
            <div class="metric">
                <div class="metric-value">${data.performance.responseTime.toFixed(1)}ms</div>
                <div class="metric-label">Avg Response Time</div>
            </div>
            <div class="metric">
                <div class="metric-value">${(data.performance.accuracy * 100).toFixed(1)}%</div>
                <div class="metric-label">Accuracy</div>
            </div>
            <div class="metric">
                <div class="metric-value">${(data.performance.uptime * 100).toFixed(2)}%</div>
                <div class="metric-label">Uptime</div>
            </div>
        </div>
    `;
  }

  html += `
        <div style="margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>This report is ${config.confidentialityLevel.toUpperCase()} and should be handled accordingly.</p>
            <p>Generated by Conan Fraud Detection System</p>
        </div>
    </body>
    </html>
  `;

  return html;
};

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

export const generateReport = async (config: ReportConfig): Promise<string> => {
  // Generate report data
  const data = generateMockData(config);
  
  // Generate timestamp for filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `conan-fraud-report-${config.type}-${timestamp}`;

  switch (config.format) {
    case 'csv':
      const csvContent = generateCSV(data, config);
      downloadFile(csvContent, `${filename}.csv`, 'text/csv');
      return `${filename}.csv`;

    case 'pdf':
      // For PDF, we'll generate HTML and let the user print to PDF
      const htmlContent = generateHTML(data, config);
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        setTimeout(() => {
          newWindow.print();
        }, 500);
      }
      return `${filename}.pdf`;

    case 'excel':
      // Generate CSV with Excel-compatible format
      const excelContent = generateCSV(data, config);
      downloadFile(excelContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return `${filename}.xlsx`;

    default:
      throw new Error(`Unsupported format: ${config.format}`);
  }
};