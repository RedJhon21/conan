export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  timestamp: Date;
  location: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  type: string;
  merchant: string;
}

export interface AISummary {
  transactionId: string;
  overview: {
    amount: string;
    merchant: string;
    location: string;
    timestamp: string;
    type: string;
  };
  riskAssessment: {
    score: number;
    level: 'low' | 'medium' | 'high';
    confidence: number;
    analysis: string;
  };
  fraudIndicators: Array<{
    factor: string;
    weight: number;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high';
    description: string;
  }>;
  historicalContext: {
    similarTransactions: number;
    merchantHistory: string;
    locationAnalysis: string;
  };
}

export interface SummaryState {
  isLoading: boolean;
  data: AISummary | null;
  error: string | null;
}