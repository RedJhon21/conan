import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
  Users
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface StatisticData {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  trend: number[];
  unit?: string;
  description: string;
}

const AnimatedNumber: React.FC<{ value: number; formatter?: (num: number) => string }> = ({ 
  value, 
  formatter = (num) => num.toString() 
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = value / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.min(stepValue * currentStep, value));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{formatter(displayValue)}</span>;
};

const MiniChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-1 h-8 w-16">
      {data.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${((value - min) / range) * 100}%` }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex-1 rounded-sm opacity-60"
          style={{ backgroundColor: color, minHeight: '2px' }}
        />
      ))}
    </div>
  );
};

export const StatisticsCards: React.FC = () => {
  const { t } = useLanguage();

  const statisticsData: StatisticData[] = [
    {
      id: 'totalTransactions',
      title: t('metrics.totalTransactions') || 'Total Transactions',
      value: 156430,
      formattedValue: '156.4K',
      change: 12.5,
      changeType: 'positive',
      icon: CreditCard,
      trend: [120, 135, 142, 138, 155, 162, 156],
      description: 'Transactions processed today'
    },
    {
      id: 'fraudDetected',
      title: t('metrics.fraudDetected') || 'Fraud Detected',
      value: 847,
      formattedValue: '847',
      change: -8.3,
      changeType: 'positive', // Lower fraud is positive
      icon: AlertTriangle,
      trend: [95, 102, 87, 92, 85, 78, 84],
      description: 'Fraudulent transactions blocked'
    },
    {
      id: 'fraudRate',
      title: 'Fraud Rate',
      value: 0.54,
      formattedValue: '0.54%',
      change: -0.12,
      changeType: 'positive',
      icon: Shield,
      trend: [0.68, 0.72, 0.58, 0.61, 0.56, 0.52, 0.54],
      unit: '%',
      description: 'Percentage of fraudulent transactions'
    },
    {
      id: 'riskScore',
      title: t('metrics.riskScore') || 'Average Risk Score',
      value: 23.7,
      formattedValue: '23.7',
      change: 2.1,
      changeType: 'negative',
      icon: Activity,
      trend: [21, 22, 25, 24, 22, 21, 24],
      description: 'Average risk score across all transactions'
    },
    {
      id: 'falsePositives',
      title: t('metrics.falsePositives') || 'False Positives',
      value: 34,
      formattedValue: '34',
      change: -15.6,
      changeType: 'positive',
      icon: TrendingDown,
      trend: [45, 42, 38, 41, 36, 32, 34],
      description: 'Incorrectly flagged legitimate transactions'
    },
    {
      id: 'activeUsers',
      title: 'Active Users',
      value: 28456,
      formattedValue: '28.5K',
      change: 8.7,
      changeType: 'positive',
      icon: Users,
      trend: [26, 27, 28, 27, 29, 30, 28],
      description: 'Users with transactions today'
    }
  ];

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive': return TrendingUp;
      case 'negative': return TrendingDown;
      default: return Activity;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statisticsData.map((stat, index) => {
        const ChangeIcon = getChangeIcon(stat.changeType);
        
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
          >
            <Card className={cn(
              "h-full bg-card border-border hover:shadow-lg transition-all duration-200",
              "hover:border-primary/20"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      <AnimatedNumber 
                        value={stat.value} 
                        formatter={(num) => {
                          if (stat.id === 'fraudRate') {
                            return (num).toFixed(2) + '%';
                          }
                          if (stat.id === 'riskScore') {
                            return (num).toFixed(1);
                          }
                          if (num >= 1000) {
                            return (num / 1000).toFixed(1) + 'K';
                          }
                          return Math.round(num).toString();
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                        stat.changeType === 'positive' && "bg-success/10 text-success",
                        stat.changeType === 'negative' && "bg-destructive/10 text-destructive",
                        stat.changeType === 'neutral' && "bg-muted/10 text-muted-foreground"
                      )}>
                        <ChangeIcon className="w-3 h-3" />
                        {Math.abs(stat.change)}%
                      </div>
                      <span className="text-xs text-muted-foreground">vs yesterday</span>
                    </div>
                  </div>
                  
                  <MiniChart 
                    data={stat.trend} 
                    color={
                      stat.changeType === 'positive' ? 'hsl(var(--success))' :
                      stat.changeType === 'negative' ? 'hsl(var(--destructive))' :
                      'hsl(var(--muted-foreground))'
                    }
                  />
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                
                {/* Risk level indicator for specific metrics */}
                {(stat.id === 'fraudRate' || stat.id === 'riskScore') && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <Badge className={cn(
                        stat.value < (stat.id === 'fraudRate' ? 1 : 30) ? 
                        "bg-success/10 text-success border-success/20" :
                        stat.value < (stat.id === 'fraudRate' ? 2 : 60) ?
                        "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                        "bg-destructive/10 text-destructive border-destructive/20"
                      )}>
                        {stat.value < (stat.id === 'fraudRate' ? 1 : 30) ? 'Low' :
                         stat.value < (stat.id === 'fraudRate' ? 2 : 60) ? 'Medium' : 'High'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};