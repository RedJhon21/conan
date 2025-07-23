import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Brush,
  ReferenceLine,
  Scatter,
  ComposedChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimelineEvent, PatternType } from '@/types/pattern-detection';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

interface TimelineViewProps {
  events: TimelineEvent[];
  selectedPattern?: PatternType | null;
  height?: number;
}

interface ChartDataPoint {
  timestamp: string;
  riskScore: number;
  count: number;
  events: TimelineEvent[];
  maxRisk: number;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  events,
  selectedPattern,
  height = 400,
}) => {
  const { t } = useLanguage();
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);

  // Process events into chart data
  const processTimelineData = (): ChartDataPoint[] => {
    const filteredEvents = selectedPattern 
      ? events.filter(event => event.patternType === selectedPattern)
      : events;

    // Group events by hour
    const groupedData = new Map<string, TimelineEvent[]>();
    
    filteredEvents.forEach(event => {
      const hourKey = format(event.timestamp, 'yyyy-MM-dd HH:00');
      if (!groupedData.has(hourKey)) {
        groupedData.set(hourKey, []);
      }
      groupedData.get(hourKey)!.push(event);
    });

    // Convert to chart data
    return Array.from(groupedData.entries())
      .map(([timestamp, eventGroup]) => ({
        timestamp,
        riskScore: eventGroup.reduce((sum, e) => sum + e.riskScore, 0) / eventGroup.length,
        count: eventGroup.length,
        events: eventGroup,
        maxRisk: Math.max(...eventGroup.map(e => e.riskScore)),
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const chartData = processTimelineData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{format(new Date(label), 'MMM dd, HH:mm')}</p>
          <p className="text-sm text-muted-foreground">
            {t('patternDetection.timeline.transactions')}: {data.count}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('patternDetection.timeline.avgRisk')}: {data.riskScore.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            {t('patternDetection.timeline.maxRisk')}: {data.maxRisk.toFixed(1)}%
          </p>
          
          {data.events.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium">{t('patternDetection.timeline.patterns')}:</p>
              {[...new Set(data.events.map(e => e.patternType))].map(pattern => (
                <Badge key={pattern} variant="outline" className="text-xs">
                  {pattern.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const formatXAxisTick = (tickItem: string) => {
    return format(new Date(tickItem), 'HH:mm');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t('patternDetection.timelineView')}
          <div className="text-sm font-normal text-muted-foreground">
            {chartData.length} {t('patternDetection.timeline.dataPoints')}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatXAxisTick}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ 
                value: t('patternDetection.timeline.riskScore'), 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Risk score line */}
            <Line
              type="monotone"
              dataKey="riskScore"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))' }}
            />
            
            {/* Max risk line */}
            <Line
              type="monotone"
              dataKey="maxRisk"
              stroke="hsl(var(--destructive))"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
            
            {/* High risk threshold line */}
            <ReferenceLine 
              y={70} 
              stroke="hsl(var(--warning))" 
              strokeDasharray="3 3"
              label={{ value: "High Risk", position: "top" }}
            />
            
            {/* Brush for zooming */}
            <Brush 
              dataKey="timestamp"
              height={30}
              stroke="hsl(var(--primary))"
              tickFormatter={formatXAxisTick}
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Pattern indicators */}
        {selectedPoint && selectedPoint.events.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">{t('patternDetection.timeline.eventDetails')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedPoint.events.slice(0, 4).map((event, index) => (
                <div key={index} className="text-sm flex justify-between">
                  <span>{event.transactionId}</span>
                  <Badge variant={event.riskScore > 70 ? 'destructive' : 'secondary'}>
                    {event.riskScore.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};