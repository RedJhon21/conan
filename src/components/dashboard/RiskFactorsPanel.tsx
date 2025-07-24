import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Wifi, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface RiskFactor {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  weight: number; // 0-100
  impact: 'high' | 'medium' | 'low';
  description: string;
  trend: 'up' | 'down' | 'stable';
}

const mockRiskFactors: RiskFactor[] = [
  {
    id: 'location',
    name: 'Unusual Location',
    icon: MapPin,
    weight: 85,
    impact: 'high',
    description: 'Transaction from high-risk geographic location',
    trend: 'up'
  },
  {
    id: 'time',
    name: 'Off-hours Activity',
    icon: Clock,
    weight: 72,
    impact: 'high',
    description: 'Transaction outside normal business hours',
    trend: 'stable'
  },
  {
    id: 'amount',
    name: 'Amount Anomaly',
    icon: DollarSign,
    weight: 68,
    impact: 'medium',
    description: 'Transaction amount significantly above user average',
    trend: 'down'
  },
  {
    id: 'velocity',
    name: 'Transaction Velocity',
    icon: TrendingUp,
    weight: 58,
    impact: 'medium',
    description: 'High frequency of transactions in short time period',
    trend: 'up'
  },
  {
    id: 'device',
    name: 'New Device',
    icon: Smartphone,
    weight: 45,
    impact: 'medium',
    description: 'Transaction from unrecognized device',
    trend: 'stable'
  },
  {
    id: 'network',
    name: 'Suspicious Network',
    icon: Wifi,
    weight: 38,
    impact: 'low',
    description: 'Connection from flagged IP address or VPN',
    trend: 'down'
  },
  {
    id: 'card',
    name: 'Card Usage Pattern',
    icon: CreditCard,
    weight: 32,
    impact: 'low',
    description: 'Unusual card usage compared to historical behavior',
    trend: 'stable'
  }
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-destructive text-destructive-foreground';
    case 'medium': return 'bg-amber-500 text-amber-50';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return '↗';
    case 'down': return '↘';
    default: return '→';
  }
};

export const RiskFactorsPanel: React.FC = () => {
  const { t } = useLanguage();

  // Sort by weight (highest risk first)
  const sortedFactors = [...mockRiskFactors].sort((a, b) => b.weight - a.weight);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-primary" />
          {t('risk.topFactors') || 'Top Risk Factors'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-80 overflow-y-auto space-y-3 pr-2">
          {sortedFactors.map((factor, index) => (
            <motion.div
              key={factor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={cn(
                "p-3 rounded-lg border transition-all duration-200 hover:bg-accent/5",
                "bg-card/50 border-border/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <factor.icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-foreground text-sm truncate">{factor.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {factor.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`${getImpactColor(factor.impact)} text-xs px-2 py-0.5`}>
                    {factor.impact}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {getTrendIcon(factor.trend)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  {factor.weight}%
                </span>
                <div className="w-20">
                  <Progress 
                    value={factor.weight} 
                    className="h-1.5"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Compact summary footer */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {sortedFactors.length} factors active
            </span>
            <span>
              Avg: {Math.round(sortedFactors.reduce((sum, f) => sum + f.weight, 0) / sortedFactors.length)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};