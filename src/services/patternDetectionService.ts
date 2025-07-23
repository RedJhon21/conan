import { PatternDetectionData, NetworkNode, NetworkLink, TimelineEvent, HeatmapCell, PatternBadge, PatternType } from '@/types/pattern-detection';

// Mock data generators
export const generatePatternDetectionData = (): PatternDetectionData => {
  const nodes = generateNetworkNodes();
  const links = generateNetworkLinks(nodes);
  const timeline = generateTimelineEvents();
  const heatmap = generateHeatmapData();
  const patterns = generatePatternBadges();

  return { nodes, links, timeline, heatmap, patterns };
};

const generateNetworkNodes = (): NetworkNode[] => {
  const nodes: NetworkNode[] = [];
  
  // Generate transaction nodes
  for (let i = 0; i < 20; i++) {
    nodes.push({
      id: `tx-${i}`,
      label: `TX-${String(i).padStart(4, '0')}`,
      type: 'transaction',
      riskScore: Math.random() * 100,
      amount: Math.random() * 10000 + 100,
      suspicious: Math.random() > 0.7,
    });
  }

  // Generate account nodes
  for (let i = 0; i < 8; i++) {
    nodes.push({
      id: `acc-${i}`,
      label: `Account ${i}`,
      type: 'account',
      riskScore: Math.random() * 100,
      suspicious: Math.random() > 0.8,
    });
  }

  // Generate merchant nodes
  for (let i = 0; i < 10; i++) {
    nodes.push({
      id: `mer-${i}`,
      label: `Merchant ${i}`,
      type: 'merchant',
      riskScore: Math.random() * 100,
      suspicious: Math.random() > 0.75,
    });
  }

  // Generate location nodes
  for (let i = 0; i < 6; i++) {
    nodes.push({
      id: `loc-${i}`,
      label: `Location ${i}`,
      type: 'location',
      riskScore: Math.random() * 100,
      suspicious: Math.random() > 0.85,
    });
  }

  return nodes;
};

const generateNetworkLinks = (nodes: NetworkNode[]): NetworkLink[] => {
  const links: NetworkLink[] = [];
  const relationships = ['same_account', 'same_merchant', 'same_location', 'time_proximity'] as const;
  
  // Create random connections between nodes
  for (let i = 0; i < 40; i++) {
    const source = nodes[Math.floor(Math.random() * nodes.length)];
    const target = nodes[Math.floor(Math.random() * nodes.length)];
    
    if (source.id !== target.id) {
      links.push({
        source: source.id,
        target: target.id,
        relationship: relationships[Math.floor(Math.random() * relationships.length)],
        strength: Math.random(),
        suspicious: Math.random() > 0.6,
      });
    }
  }

  return links;
};

const generateTimelineEvents = (): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  const patternTypes: PatternType[] = ['velocity_attack', 'account_takeover', 'location_anomaly', 'amount_pattern', 'merchant_fraud', 'time_based'];
  const locations = ['New York', 'London', 'Tokyo', 'Dubai', 'Sydney', 'Mumbai'];
  const merchants = ['Amazon', 'PayPal', 'Stripe', 'Square', 'Apple Pay', 'Google Pay'];

  for (let i = 0; i < 50; i++) {
    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - Math.random() * 168); // Last 7 days

    events.push({
      timestamp,
      transactionId: `tx-${i}`,
      riskScore: Math.random() * 100,
      patternType: patternTypes[Math.floor(Math.random() * patternTypes.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      amount: Math.random() * 5000 + 50,
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
    });
  }

  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

const generateHeatmapData = (): HeatmapCell[] => {
  const cells: HeatmapCell[] = [];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const locations = ['New York', 'London', 'Tokyo', 'Dubai', 'Sydney'];

  hours.forEach(hour => {
    locations.forEach(location => {
      cells.push({
        x: hour,
        y: location,
        value: Math.random() * 100,
        count: Math.floor(Math.random() * 20) + 1,
        suspicious: Math.random() > 0.7,
      });
    });
  });

  return cells;
};

const generatePatternBadges = (): PatternBadge[] => {
  const patterns: PatternBadge[] = [
    {
      type: 'velocity_attack',
      count: Math.floor(Math.random() * 10) + 1,
      severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      description: 'Rapid successive transactions detected',
    },
    {
      type: 'account_takeover',
      count: Math.floor(Math.random() * 5) + 1,
      severity: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      description: 'Unusual access patterns identified',
    },
    {
      type: 'location_anomaly',
      count: Math.floor(Math.random() * 8) + 1,
      severity: Math.random() > 0.5 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      description: 'Transactions from unexpected locations',
    },
    {
      type: 'amount_pattern',
      count: Math.floor(Math.random() * 6) + 1,
      severity: Math.random() > 0.8 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      description: 'Unusual spending behavior detected',
    },
    {
      type: 'merchant_fraud',
      count: Math.floor(Math.random() * 4) + 1,
      severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      description: 'Suspicious merchant relationships',
    },
    {
      type: 'time_based',
      count: Math.floor(Math.random() * 7) + 1,
      severity: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      description: 'Transactions outside normal hours',
    },
  ];

  return patterns.filter(() => Math.random() > 0.3); // Randomly include patterns
};