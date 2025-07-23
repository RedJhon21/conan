import { AISummary, Transaction } from '@/types/summary';

// Mock AI service that simulates realistic delays and responses
export const generateAISummary = async (transaction: Transaction): Promise<AISummary> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  
  // 10% chance of error for testing
  if (Math.random() < 0.1) {
    throw new Error('AI service temporarily unavailable');
  }

  const riskAnalysis = getRiskAnalysis(transaction.riskScore);
  const fraudIndicators = generateFraudIndicators(transaction);
  const recommendations = generateRecommendations(transaction.riskLevel);

  return {
    transactionId: transaction.id,
    overview: {
      amount: `${transaction.currency} ${transaction.amount.toLocaleString()}`,
      merchant: transaction.merchant,
      location: transaction.location,
      timestamp: transaction.timestamp.toLocaleString(),
      type: transaction.type,
    },
    riskAssessment: {
      score: transaction.riskScore,
      level: transaction.riskLevel,
      confidence: Math.round(85 + Math.random() * 10),
      analysis: riskAnalysis,
    },
    fraudIndicators,
    recommendations,
    historicalContext: {
      similarTransactions: Math.floor(Math.random() * 50) + 10,
      merchantHistory: `This merchant has processed ${Math.floor(Math.random() * 1000) + 100} transactions with a ${(Math.random() * 5 + 0.5).toFixed(1)}% fraud rate.`,
      locationAnalysis: `${transaction.location} shows ${transaction.riskScore > 70 ? 'elevated' : 'normal'} risk patterns based on historical data.`,
    },
  };
};

const getRiskAnalysis = (riskScore: number): string => {
  if (riskScore >= 70) {
    return "High risk transaction detected. Multiple fraud indicators present including unusual spending patterns, location anomalies, and velocity checks. Immediate review recommended.";
  } else if (riskScore >= 40) {
    return "Moderate risk transaction. Some unusual patterns detected but within acceptable parameters. Monitor for additional suspicious activity.";
  } else {
    return "Low risk transaction. All fraud checks passed successfully. Transaction patterns align with normal customer behavior.";
  }
};

const generateFraudIndicators = (transaction: Transaction) => {
  const indicators = [
    { factor: 'Location Anomaly', weight: 25, description: 'Transaction from unusual geographic location', severity: 'medium' as const },
    { factor: 'Time Pattern', weight: 15, description: 'Transaction timing outside normal hours', severity: 'low' as const },
    { factor: 'Amount Threshold', weight: 30, description: 'Transaction amount exceeds typical spending', severity: 'high' as const },
    { factor: 'Merchant Category', weight: 20, description: 'High-risk merchant category', severity: 'medium' as const },
    { factor: 'Velocity Check', weight: 35, description: 'Multiple transactions in short timeframe', severity: 'high' as const },
  ];

  // Return 2-4 random indicators based on risk score
  const numIndicators = transaction.riskScore > 70 ? 4 : transaction.riskScore > 40 ? 3 : 2;
  return indicators
    .sort(() => Math.random() - 0.5)
    .slice(0, numIndicators)
    .sort((a, b) => b.weight - a.weight);
};

const generateRecommendations = (riskLevel: string) => {
  const allRecommendations = [
    { action: 'Manual Review', priority: 'high' as const, description: 'Escalate to fraud analyst for immediate review' },
    { action: 'Customer Verification', priority: 'medium' as const, description: 'Contact customer to verify transaction legitimacy' },
    { action: 'Account Monitoring', priority: 'medium' as const, description: 'Increase monitoring for this account for 24-48 hours' },
    { action: 'Block Transaction', priority: 'high' as const, description: 'Temporarily block transaction pending verification' },
    { action: 'Apply Additional Checks', priority: 'low' as const, description: 'Implement enhanced verification for future transactions' },
  ];

  if (riskLevel === 'high') {
    return allRecommendations.slice(0, 3);
  } else if (riskLevel === 'medium') {
    return allRecommendations.slice(1, 4);
  } else {
    return allRecommendations.slice(4, 5);
  }
};