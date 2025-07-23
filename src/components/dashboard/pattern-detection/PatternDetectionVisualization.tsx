import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatternDetectionData, PatternType } from '@/types/pattern-detection';
import { generatePatternDetectionData } from '@/services/patternDetectionService';
import { NetworkGraph } from './NetworkGraph';
import { TimelineView } from './TimelineView';
import { RiskHeatmap } from './RiskHeatmap';
import { PatternBadges } from './PatternBadges';

export const PatternDetectionVisualization: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<PatternDetectionData | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<PatternType | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadData = () => {
      const patternData = generatePatternDetectionData();
      setData(patternData);
    };
    
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('patternDetection.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('patternDetection.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <PatternBadges 
              patterns={data.patterns}
              onPatternClick={setSelectedPattern}
              selectedPattern={selectedPattern}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NetworkGraph 
                nodes={data.nodes}
                links={data.links}
                selectedPattern={selectedPattern}
                height={300}
              />
              <TimelineView 
                events={data.timeline}
                selectedPattern={selectedPattern}
                height={300}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="network">
            <NetworkGraph 
              nodes={data.nodes}
              links={data.links}
              selectedPattern={selectedPattern}
              height={500}
            />
          </TabsContent>
          
          <TabsContent value="timeline">
            <TimelineView 
              events={data.timeline}
              selectedPattern={selectedPattern}
              height={500}
            />
          </TabsContent>
          
          <TabsContent value="heatmap">
            <RiskHeatmap 
              data={data.heatmap}
              height={500}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};