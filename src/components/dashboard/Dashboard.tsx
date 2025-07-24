import { useState, useEffect } from 'react';
import { AlertCard } from './AlertCard';
import { Header } from './Header';
import { VirtualizedTransactionMonitor } from './VirtualizedTransactionMonitor';
import { RiskGauge } from './RiskGauge';
import { RiskFactorsPanel } from './RiskFactorsPanel';
import { StatisticsCards } from './StatisticsCards';
import { PatternDetectionVisualization } from './pattern-detection/PatternDetectionVisualization';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample data
const generateMetrics = () => ({
  totalTransactions: 45672,
  fraudDetected: 142,
  riskScore: 7.3,
  falsePositives: 23,
});


const generateAlerts = (t: (key: string) => string) => [
  {
    id: 1,
    title: t('alerts.highRisk'),
    description: 'Transaction ID: TXN-789456 - Amount: $12,500',
    severity: 'high' as const,
    timestamp: '2 minutes ago',
  },
  {
    id: 2,
    title: t('alerts.newFraud'),
    description: 'Suspicious pattern detected in card-not-present transactions',
    severity: 'medium' as const,
    timestamp: '15 minutes ago',
  },
  {
    id: 3,
    title: t('alerts.systemAlert'),
    description: 'ML model accuracy: 97.8% - Performance optimal',
    severity: 'low' as const,
    timestamp: '1 hour ago',
  },
];

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState(generateMetrics());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        toast({
          title: t('alerts.highRisk'),
          description: `Transaction ID: TXN-${Math.floor(Math.random() * 1000000)}`,
          variant: 'destructive',
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [toast, t]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMetrics(generateMetrics());
    setIsRefreshing(false);
    
    toast({
      title: 'Dashboard Updated',
      description: 'Latest data has been loaded successfully.',
    });
  };

  const alerts = generateAlerts(t);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Fraud Detection Overview
            </h2>
            <p className="text-muted-foreground">
              Real-time monitoring and analysis
            </p>
          </div>
          
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{t('common.refresh')}</span>
          </Button>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="mb-8">
          <StatisticsCards />
        </div>

        {/* Risk Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <RiskGauge value={67} title={t('risk.overallScore') || 'Overall Risk Score'} />
          </div>
          <div className="lg:col-span-2">
            <RiskFactorsPanel />
          </div>
        </div>

        {/* Enhanced Transaction Monitoring */}
        <div className="mb-8">
          <VirtualizedTransactionMonitor />
        </div>

        {/* Pattern Detection */}
        <div className="mb-8">
          <PatternDetectionVisualization />
        </div>


        {/* Alerts Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                description={alert.description}
                severity={alert.severity}
                timestamp={alert.timestamp}
                actionLabel={t('common.viewDetails')}
                onAction={() => {
                  toast({
                    title: 'Alert Details',
                    description: 'Opening detailed view for this alert.',
                  });
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};