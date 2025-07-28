import { Transaction } from '@/types/summary';
import { EnhancedAISummary, IncidentReport } from '@/types/sama-reporting';
import { generateEnhancedAISummary, generateIncidentReport } from './samaReportService';

// Enhanced AI Service with SAMA compliance and advanced analytics
export class EnhancedAIService {
  private static instance: EnhancedAIService;

  static getInstance(): EnhancedAIService {
    if (!EnhancedAIService.instance) {
      EnhancedAIService.instance = new EnhancedAIService();
    }
    return EnhancedAIService.instance;
  }

  // Generate enhanced AI summary with regulatory compliance
  async generateEnhancedSummary(transaction: Transaction): Promise<EnhancedAISummary> {
    try {
      return await generateEnhancedAISummary(transaction);
    } catch (error) {
      throw new Error(`Enhanced AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate incident report if required
  async generateIncidentReportIfNeeded(transaction: Transaction, aiSummary: EnhancedAISummary): Promise<IncidentReport | null> {
    if (aiSummary.incidentClassification.reportingRequired) {
      return await generateIncidentReport(transaction, aiSummary);
    }
    return null;
  }

  // Batch analysis for multiple transactions
  async batchAnalyzeTransactions(transactions: Transaction[]): Promise<Map<string, EnhancedAISummary>> {
    const results = new Map<string, EnhancedAISummary>();
    
    // Process in chunks to avoid overwhelming the system
    const chunkSize = 10;
    for (let i = 0; i < transactions.length; i += chunkSize) {
      const chunk = transactions.slice(i, i + chunkSize);
      const chunkPromises = chunk.map(async (transaction) => {
        try {
          const summary = await this.generateEnhancedSummary(transaction);
          return { transaction, summary };
        } catch (error) {
          console.error(`Failed to analyze transaction ${transaction.id}:`, error);
          return null;
        }
      });

      const chunkResults = await Promise.all(chunkPromises);
      chunkResults.forEach(result => {
        if (result) {
          results.set(result.transaction.id, result.summary);
        }
      });

      // Add delay between chunks to prevent rate limiting
      if (i + chunkSize < transactions.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  // Pattern detection across multiple transactions
  async detectCrossTransactionPatterns(transactions: Transaction[]): Promise<{
    patterns: Array<{
      type: string;
      confidence: number;
      transactions: string[];
      description: string;
      riskLevel: 'low' | 'medium' | 'high';
    }>;
    networks: Array<{
      entities: string[];
      connectionType: string;
      riskScore: number;
    }>;
  }> {
    // Simulate pattern detection analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    const patterns = [
      {
        type: 'Circular Money Flow',
        confidence: 0.87,
        transactions: transactions.slice(0, 3).map(t => t.id),
        description: 'Detected potential money laundering pattern with circular fund movements',
        riskLevel: 'high' as const
      },
      {
        type: 'Structuring Pattern',
        confidence: 0.76,
        transactions: transactions.slice(2, 6).map(t => t.id),
        description: 'Multiple transactions just below reporting thresholds',
        riskLevel: 'medium' as const
      },
      {
        type: 'Account Muling',
        confidence: 0.82,
        transactions: transactions.slice(1, 5).map(t => t.id),
        description: 'Money muling activity detected - rapid fund transfers through intermediary accounts',
        riskLevel: 'high' as const
      }
    ];

    const networks = [
      {
        entities: ['Entity_A', 'Entity_B', 'Entity_C'],
        connectionType: 'Shared beneficial ownership',
        riskScore: 0.82
      }
    ];

    return { patterns, networks };
  }

  // Real-time risk scoring with live data
  async calculateRealTimeRiskScore(transaction: Transaction, contextData: {
    customerHistory: any[];
    merchantRisk: number;
    locationRisk: number;
    timeRisk: number;
  }): Promise<{
    score: number;
    factors: Array<{
      name: string;
      weight: number;
      value: number;
      contribution: number;
    }>;
    recommendation: 'approve' | 'review' | 'block';
  }> {
    // Simulate real-time risk calculation
    await new Promise(resolve => setTimeout(resolve, 800));

    const factors = [
      {
        name: 'Transaction Amount',
        weight: 0.25,
        value: Math.min(transaction.amount / 10000, 1),
        contribution: 0
      },
      {
        name: 'Merchant Risk',
        weight: 0.20,
        value: contextData.merchantRisk,
        contribution: 0
      },
      {
        name: 'Location Risk',
        weight: 0.20,
        value: contextData.locationRisk,
        contribution: 0
      },
      {
        name: 'Customer History',
        weight: 0.15,
        value: contextData.customerHistory.length > 0 ? 0.3 : 0.8,
        contribution: 0
      },
      {
        name: 'Transaction Time',
        weight: 0.20,
        value: contextData.timeRisk,
        contribution: 0
      }
    ];

    // Calculate contributions and total score
    factors.forEach(factor => {
      factor.contribution = factor.weight * factor.value;
    });

    const score = factors.reduce((sum, factor) => sum + factor.contribution, 0);
    
    let recommendation: 'approve' | 'review' | 'block';
    if (score > 0.8) {
      recommendation = 'block';
    } else if (score > 0.5) {
      recommendation = 'review';
    } else {
      recommendation = 'approve';
    }

    return {
      score: Math.round(score * 100),
      factors,
      recommendation
    };
  }

  // Generate compliance report for regulatory submission
  async generateComplianceReport(transactions: Transaction[], period: string): Promise<{
    summary: {
      totalTransactions: number;
      flaggedTransactions: number;
      reportedIncidents: number;
      complianceRate: number;
    };
    violations: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
      transactions: string[];
      remediation: string;
    }>;
    recommendations: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const flaggedCount = transactions.filter(t => t.riskScore > 50).length;
    const reportedCount = transactions.filter(t => t.riskScore > 70).length;

    return {
      summary: {
        totalTransactions: transactions.length,
        flaggedTransactions: flaggedCount,
        reportedIncidents: reportedCount,
        complianceRate: Math.round(((transactions.length - flaggedCount) / transactions.length) * 100)
      },
      violations: [
        {
          type: 'Late Reporting',
          severity: 'medium',
          description: 'Some suspicious transactions were not reported within the required 15-day timeframe',
          transactions: transactions.slice(0, 2).map(t => t.id),
          remediation: 'Implement automated reporting system with real-time alerts'
        }
      ],
      recommendations: [
        'Enhance real-time monitoring capabilities',
        'Implement automated SAMA reporting workflows',
        'Conduct quarterly compliance training for staff',
        'Review and update risk parameters monthly'
      ]
    };
  }
}

// Export singleton instance
export const enhancedAiService = EnhancedAIService.getInstance();