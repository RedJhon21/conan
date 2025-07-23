export type PatternType = 
  | 'velocity_attack' 
  | 'account_takeover' 
  | 'location_anomaly' 
  | 'amount_pattern' 
  | 'merchant_fraud' 
  | 'time_based';

export interface NetworkNode {
  id: string;
  label: string;
  type: 'transaction' | 'account' | 'merchant' | 'location';
  riskScore: number;
  amount?: number;
  suspicious: boolean;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

export interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  relationship: 'same_account' | 'same_merchant' | 'same_location' | 'time_proximity';
  strength: number;
  suspicious: boolean;
}

export interface TimelineEvent {
  timestamp: Date;
  transactionId: string;
  riskScore: number;
  patternType: PatternType;
  location: string;
  amount: number;
  merchant: string;
}

export interface HeatmapCell {
  x: string;
  y: string;
  value: number;
  count: number;
  suspicious: boolean;
}

export interface PatternBadge {
  type: PatternType;
  count: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface PatternDetectionData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  timeline: TimelineEvent[];
  heatmap: HeatmapCell[];
  patterns: PatternBadge[];
}