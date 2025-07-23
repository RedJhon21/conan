import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeatmapCell } from '@/types/pattern-detection';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface RiskHeatmapProps {
  data: HeatmapCell[];
  height?: number;
}

type HeatmapView = 'time-location' | 'time-risk';

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({
  data,
  height = 400,
}) => {
  const { t } = useLanguage();
  const [view, setView] = useState<HeatmapView>('time-location');
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

  // Get unique values for axes
  const xValues = [...new Set(data.map(d => d.x))].sort();
  const yValues = [...new Set(data.map(d => d.y))].sort();

  // Create a map for quick lookup
  const dataMap = new Map<string, HeatmapCell>();
  data.forEach(cell => {
    dataMap.set(`${cell.x}-${cell.y}`, cell);
  });

  // Color scale based on risk value
  const getHeatmapColor = (value: number, suspicious: boolean) => {
    if (suspicious) {
      return 'bg-destructive';
    }
    
    const intensity = value / 100;
    if (intensity > 0.7) return 'bg-red-500';
    if (intensity > 0.5) return 'bg-orange-500';
    if (intensity > 0.3) return 'bg-yellow-500';
    if (intensity > 0.1) return 'bg-green-500';
    return 'bg-muted';
  };

  const getOpacity = (value: number) => {
    return Math.max(0.2, value / 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('patternDetection.riskHeatmap')}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={view === 'time-location' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('time-location')}
            >
              {t('patternDetection.heatmap.timeLocation')}
            </Button>
            <Button
              variant={view === 'time-risk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('time-risk')}
            >
              {t('patternDetection.heatmap.timeRisk')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="relative overflow-auto" style={{ height }}>
            <div className="grid gap-1 p-4" style={{
              gridTemplateColumns: `80px repeat(${xValues.length}, 1fr)`,
              gridTemplateRows: `30px repeat(${yValues.length}, 1fr)`,
              minWidth: `${80 + xValues.length * 40}px`,
              minHeight: `${30 + yValues.length * 30}px`
            }}>
              {/* Header row */}
              <div></div>
              {xValues.map(x => (
                <div 
                  key={x} 
                  className="text-xs font-medium text-center flex items-center justify-center"
                >
                  {x}
                </div>
              ))}
              
              {/* Data rows */}
              {yValues.map(y => (
                <React.Fragment key={y}>
                  <div className="text-xs font-medium flex items-center pr-2 text-right">
                    {y}
                  </div>
                  {xValues.map(x => {
                    const cell = dataMap.get(`${x}-${y}`);
                    const value = cell?.value || 0;
                    const suspicious = cell?.suspicious || false;
                    
                    return (
                      <div
                        key={`${x}-${y}`}
                        className={cn(
                          "aspect-square rounded cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 relative border border-border/20",
                          getHeatmapColor(value, suspicious)
                        )}
                        style={{ 
                          opacity: getOpacity(value),
                          minHeight: '24px',
                          minWidth: '24px'
                        }}
                        onClick={() => setSelectedCell(cell || null)}
                        onMouseEnter={() => setSelectedCell(cell || null)}
                        onMouseLeave={() => setSelectedCell(null)}
                      >
                        {suspicious && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{t('patternDetection.heatmap.riskLevel')}:</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive rounded relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
                <span className="text-xs">{t('patternDetection.legend.suspicious')}</span>
              </div>
            </div>
          </div>

          {/* Selected Cell Details */}
          {selectedCell && (
            <div className="bg-muted rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">{t('patternDetection.heatmap.location')}: {selectedCell.y}</p>
                  <p className="text-sm font-medium">{t('patternDetection.heatmap.time')}: {selectedCell.x}</p>
                </div>
                <div>
                  <p className="text-sm">
                    {t('patternDetection.heatmap.riskScore')}: 
                    <Badge variant={selectedCell.value > 70 ? 'destructive' : 'secondary'} className="ml-2">
                      {selectedCell.value.toFixed(1)}%
                    </Badge>
                  </p>
                  <p className="text-sm">
                    {t('patternDetection.heatmap.transactions')}: 
                    <span className="ml-2 font-medium">{selectedCell.count}</span>
                  </p>
                  {selectedCell.suspicious && (
                    <Badge variant="destructive" className="mt-1">
                      {t('patternDetection.legend.suspicious')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};