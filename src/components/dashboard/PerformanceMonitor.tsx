import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Database, 
  Wifi, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
  throughput: number;
  connectionStatus: 'connected' | 'disconnected' | 'slow';
}

export const PerformanceMonitor: React.FC = () => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    responseTime: 0,
    errorRate: 0,
    uptime: 0,
    throughput: 0,
    connectionStatus: 'connected',
  });

  const [history, setHistory] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    const updateMetrics = () => {
      // Simulate realistic performance metrics
      const newMetrics: PerformanceMetrics = {
        cpuUsage: Math.random() * 30 + 15, // 15-45%
        memoryUsage: Math.random() * 20 + 40, // 40-60%
        responseTime: Math.random() * 100 + 50, // 50-150ms
        errorRate: Math.random() * 2, // 0-2%
        uptime: 99.8 + Math.random() * 0.2, // 99.8-100%
        throughput: Math.random() * 500 + 1000, // 1000-1500 req/s
        connectionStatus: Math.random() > 0.95 ? 'slow' : 'connected',
      };

      setMetrics(newMetrics);
      setHistory(prev => {
        const updated = [...prev, newMetrics];
        return updated.slice(-20); // Keep last 20 readings
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'secondary';
    if (value <= thresholds.warning) return 'outline';
    return 'destructive';
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'secondary';
      case 'slow': return 'outline';
      case 'disconnected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTrend = (current: number, history: number[]) => {
    if (history.length < 2) return 'stable';
    const recent = history.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const older = history.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    
    if (recent > older * 1.1) return 'up';
    if (recent < older * 0.9) return 'down';
    return 'stable';
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime * 365 / 100);
    const hours = Math.floor((uptime * 365 * 24 / 100) % 24);
    return `${days}d ${hours}h`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>{t('performance.title')}</span>
          <Badge 
            variant={getConnectionStatusColor(metrics.connectionStatus)}
            className="ml-auto"
          >
            <Wifi className="h-3 w-3 mr-1" />
            {t(`performance.status.${metrics.connectionStatus}`)}
          </Badge>
        </CardTitle>
        <CardDescription>
          {t('performance.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CPU Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{t('performance.cpu')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-mono">{metrics.cpuUsage.toFixed(1)}%</span>
                {getTrend(metrics.cpuUsage, history.map(h => h.cpuUsage)) === 'up' && (
                  <TrendingUp className="h-3 w-3 text-destructive" />
                )}
                {getTrend(metrics.cpuUsage, history.map(h => h.cpuUsage)) === 'down' && (
                  <TrendingDown className="h-3 w-3 text-success" />
                )}
              </div>
            </div>
            <Progress 
              value={metrics.cpuUsage} 
              className="h-2"
              color={getStatusColor(metrics.cpuUsage, { good: 30, warning: 60 })}
            />
          </div>

          {/* Memory Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{t('performance.memory')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-mono">{metrics.memoryUsage.toFixed(1)}%</span>
                {getTrend(metrics.memoryUsage, history.map(h => h.memoryUsage)) === 'up' && (
                  <TrendingUp className="h-3 w-3 text-destructive" />
                )}
                {getTrend(metrics.memoryUsage, history.map(h => h.memoryUsage)) === 'down' && (
                  <TrendingDown className="h-3 w-3 text-success" />
                )}
              </div>
            </div>
            <Progress 
              value={metrics.memoryUsage} 
              className="h-2"
              color={getStatusColor(metrics.memoryUsage, { good: 50, warning: 75 })}
            />
          </div>

          {/* Response Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{t('performance.responseTime')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-mono">{metrics.responseTime.toFixed(0)}ms</span>
                {getTrend(metrics.responseTime, history.map(h => h.responseTime)) === 'up' && (
                  <TrendingUp className="h-3 w-3 text-destructive" />
                )}
                {getTrend(metrics.responseTime, history.map(h => h.responseTime)) === 'down' && (
                  <TrendingDown className="h-3 w-3 text-success" />
                )}
              </div>
            </div>
            <Progress 
              value={Math.min(metrics.responseTime / 2, 100)} 
              className="h-2"
              color={getStatusColor(metrics.responseTime, { good: 100, warning: 300 })}
            />
          </div>

          {/* Error Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('performance.errorRate')}</span>
              <Badge 
                variant={getStatusColor(metrics.errorRate, { good: 0.5, warning: 1.5 })}
                className="text-xs"
              >
                {metrics.errorRate.toFixed(2)}%
              </Badge>
            </div>
          </div>

          {/* Uptime */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('performance.uptime')}</span>
              <div className="text-right">
                <div className="text-sm font-mono">{metrics.uptime.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">
                  {formatUptime(metrics.uptime)}
                </div>
              </div>
            </div>
          </div>

          {/* Throughput */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('performance.throughput')}</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-mono">{metrics.throughput.toFixed(0)}</span>
                <span className="text-xs text-muted-foreground">req/s</span>
                {getTrend(metrics.throughput, history.map(h => h.throughput)) === 'up' && (
                  <TrendingUp className="h-3 w-3 text-success" />
                )}
                {getTrend(metrics.throughput, history.map(h => h.throughput)) === 'down' && (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="flex items-center justify-center mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>{t('performance.realTime')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};