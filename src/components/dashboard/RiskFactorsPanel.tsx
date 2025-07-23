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
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          {t('risk.topFactors') || 'Top Risk Factors'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedFactors.map((factor, index) => (
          <motion.div
            key={factor.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              "p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
              "bg-card/50 border-border/50 hover:border-border"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <factor.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{factor.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {factor.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getImpactColor(factor.impact)}>
                  {factor.impact}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {getTrendIcon(factor.trend)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t('risk.weight') || 'Risk Weight'}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {factor.weight}%
                </span>
              </div>
              
              <Progress 
                value={factor.weight} 
                className="h-2"
              />
            </div>
            
            {/* Risk level indicator */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div 
                  className={cn(
                    "w-2 h-2 rounded-full",
                    factor.weight >= 70 && "bg-destructive",
                    factor.weight >= 40 && factor.weight < 70 && "bg-amber-500",
                    factor.weight < 40 && "bg-success"
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  Impact Level: {factor.impact}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Rank #{index + 1}
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Summary footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: sortedFactors.length * 0.1 }}
          className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('risk.totalFactors') || 'Total Active Factors'}
            </span>
            <span className="font-medium text-foreground">
              {sortedFactors.length}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">
              {t('risk.averageWeight') || 'Average Weight'}
            </span>
            <span className="font-medium text-foreground">
              {Math.round(sortedFactors.reduce((sum, f) => sum + f.weight, 0) / sortedFactors.length)}%
            </span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};