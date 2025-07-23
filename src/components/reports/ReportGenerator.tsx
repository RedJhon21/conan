import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportConfig {
  type: 'summary' | 'detailed' | 'trends' | 'performance';
  format: 'pdf' | 'excel' | 'csv' | 'print';
  period: 'last24h' | 'last7d' | 'last30d' | 'custom';
  includeCharts: boolean;
  includePatterns: boolean;
  includePerformance: boolean;
  confidentialityLevel: 'public' | 'internal' | 'confidential';
}

export const ReportGenerator: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<ReportConfig>({
    type: 'summary',
    format: 'pdf',
    period: 'last24h',
    includeCharts: true,
    includePatterns: true,
    includePerformance: false,
    confidentialityLevel: 'internal',
  });

  const canExportAdvanced = hasPermission('export_advanced');
  const canExportBasic = hasPermission('export_basic');

  const reportTypes = [
    { 
      value: 'summary', 
      label: t('reports.types.summary'), 
      icon: BarChart3,
      description: t('reports.types.summaryDesc'),
      permission: 'export_basic'
    },
    { 
      value: 'detailed', 
      label: t('reports.types.detailed'), 
      icon: FileText,
      description: t('reports.types.detailedDesc'),
      permission: 'export_advanced'
    },
    { 
      value: 'trends', 
      label: t('reports.types.trends'), 
      icon: TrendingUp,
      description: t('reports.types.trendsDesc'),
      permission: 'export_basic'
    },
    { 
      value: 'performance', 
      label: t('reports.types.performance'), 
      icon: PieChart,
      description: t('reports.types.performanceDesc'),
      permission: 'export_advanced'
    },
  ];

  const formats = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'excel', label: 'Excel', icon: BarChart3 },
    { value: 'csv', label: 'CSV', icon: FileText },
    { value: 'print', label: t('reports.print'), icon: Printer },
  ];

  const periods = [
    { value: 'last24h', label: t('reports.periods.last24h') },
    { value: 'last7d', label: t('reports.periods.last7d') },
    { value: 'last30d', label: t('reports.periods.last30d') },
    { value: 'custom', label: t('reports.periods.custom') },
  ];

  const generateReport = async () => {
    if (!canExportBasic) {
      toast({
        title: t('reports.noPermission'),
        description: t('reports.noPermissionDesc'),
        variant: 'destructive',
      });
      return;
    }

    const selectedType = reportTypes.find(type => type.value === config.type);
    if (selectedType?.permission === 'export_advanced' && !canExportAdvanced) {
      toast({
        title: t('reports.noPermissionAdvanced'),
        description: t('reports.noPermissionAdvancedDesc'),
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (config.format === 'print') {
        // Trigger print dialog
        window.print();
      } else {
        // Simulate file download
        const fileName = `conan-fraud-report-${config.type}-${Date.now()}.${config.format}`;
        toast({
          title: t('reports.generated'),
          description: `${t('reports.downloadStarted')}: ${fileName}`,
        });
      }

      setIsOpen(false);
    } catch (error) {
      toast({
        title: t('reports.error'),
        description: t('reports.errorDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>{t('reports.generate')}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{t('reports.title')}</span>
            </DialogTitle>
            <DialogDescription>
              {t('reports.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Report Type Selection */}
            <div className="space-y-3">
              <Label>{t('reports.selectType')}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportTypes.map((type) => {
                  const hasAccess = type.permission === 'export_basic' ? canExportBasic : canExportAdvanced;
                  const Icon = type.icon;
                  
                  return (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-all border-2 ${
                        config.type === type.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      } ${!hasAccess ? 'opacity-50' : ''}`}
                      onClick={() => hasAccess && setConfig({...config, type: type.value as ReportConfig['type']})}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-sm">{type.label}</h4>
                              {!hasAccess && (
                                <Badge variant="destructive" className="text-xs">
                                  {t('reports.restricted')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Format & Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('reports.format')}</Label>
                <Select value={config.format} onValueChange={(value: ReportConfig['format']) => 
                  setConfig({...config, format: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((format) => {
                      const Icon = format.icon;
                      return (
                        <SelectItem key={format.value} value={format.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{format.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('reports.period')}</Label>
                <Select value={config.period} onValueChange={(value: ReportConfig['period']) => 
                  setConfig({...config, period: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <Label>{t('reports.options')}</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t('reports.includeCharts')}</span>
                  </div>
                  <Switch
                    checked={config.includeCharts}
                    onCheckedChange={(checked) => setConfig({...config, includeCharts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t('reports.includePatterns')}</span>
                  </div>
                  <Switch
                    checked={config.includePatterns}
                    onCheckedChange={(checked) => setConfig({...config, includePatterns: checked})}
                    disabled={!canExportAdvanced}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t('reports.includePerformance')}</span>
                  </div>
                  <Switch
                    checked={config.includePerformance}
                    onCheckedChange={(checked) => setConfig({...config, includePerformance: checked})}
                    disabled={!canExportAdvanced}
                  />
                </div>
              </div>
            </div>

            {/* Confidentiality Level */}
            <div className="space-y-2">
              <Label>{t('reports.confidentiality')}</Label>
              <Select value={config.confidentialityLevel} onValueChange={(value: ReportConfig['confidentialityLevel']) => 
                setConfig({...config, confidentialityLevel: value})
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">{t('reports.confidentiality.public')}</SelectItem>
                  <SelectItem value="internal">{t('reports.confidentiality.internal')}</SelectItem>
                  <SelectItem value="confidential">{t('reports.confidentiality.confidential')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={generateReport} disabled={isGenerating}>
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    <span>{t('reports.generating')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>{t('reports.generate')}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 1in;
            size: A4;
          }
          .no-print {
            display: none !important;
          }
          .print-header {
            display: block !important;
            text-align: center;
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: bold;
          }
          .print-footer {
            display: block !important;
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
        }
      `}</style>
    </>
  );
};