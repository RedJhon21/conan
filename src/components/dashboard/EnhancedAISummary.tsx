import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Copy, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Clock,
  MapPin,
  CreditCard,
  TrendingUp,
  Download,
  FileText,
  Shield,
  Flag,
  BarChart3,
  Network
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { enhancedAiService } from '@/services/enhancedAiService';
import { generateSAMAReport } from '@/services/samaReportService';
import { Transaction } from '@/types/summary';
import { EnhancedAISummary as EnhancedAISummaryType, SAMAReportConfig } from '@/types/sama-reporting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EnhancedAISummaryProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

interface SummaryState {
  isLoading: boolean;
  data: EnhancedAISummaryType | null;
  error: string | null;
}

const EnhancedAISummary: React.FC<EnhancedAISummaryProps> = ({ transaction, isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [summaryState, setSummaryState] = useState<SummaryState>({
    isLoading: false,
    data: null,
    error: null,
  });

  const handleGenerateSummary = async () => {
    setSummaryState({ isLoading: true, data: null, error: null });
    
    try {
      const summary = await enhancedAiService.generateEnhancedSummary(transaction);
      setSummaryState({ isLoading: false, data: summary, error: null });
      
      // Auto-generate incident report if required
      if (summary.incidentClassification.reportingRequired) {
        const incidentReport = await enhancedAiService.generateIncidentReportIfNeeded(transaction, summary);
        if (incidentReport) {
          toast({
            title: "Incident Report Generated",
            description: `Incident ${incidentReport.id} created and ready for review`,
          });
        }
      }
    } catch (error) {
      setSummaryState({ 
        isLoading: false, 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const handleDownloadReport = async (reportType: 'incident' | 'compliance-audit' | 'investigation') => {
    if (!summaryState.data) return;

    try {
      const config: SAMAReportConfig = {
        reportType,
        template: 'sama-standard',
        classification: 'internal',
        language: 'en',
        digitalSignature: true,
        watermark: true,
        distribution: {
          internal: [],
          external: [],
          regulatorySubmission: reportType === 'incident'
        },
        type: 'detailed',
        format: 'pdf',
        period: 'last24h',
        includeCharts: true,
        includePatterns: true,
        includePerformance: false,
        confidentialityLevel: 'internal'
      };

      const filename = await generateSAMAReport(config, {
        'transaction-id': transaction.id,
        'incident-overview': `Suspicious transaction detected with ${summaryState.data.riskAssessment.score}% risk score`,
        'discovery-date': new Date().toISOString().split('T')[0],
        'incident-date': transaction.timestamp.toISOString().split('T')[0],
        'incident-type': 'fraud',
        'severity': summaryState.data.incidentClassification.severity,
        'financial-impact': transaction.amount,
        'operational-impact': 'Minimal operational impact, isolated incident',
        'regulatory-impact': 'Potential SAMA reporting requirement',
        'reputational-impact': 'Low reputational risk if handled promptly',
        'lead-investigator': 'AI System',
        'investigation-team': 'Fraud Team, Compliance Team',
        'methodology': 'Automated AI analysis with risk scoring',
        'findings': summaryState.data.riskAssessment.analysis,
        'primary-cause': 'Elevated risk indicators detected by AI monitoring system',
        'contributing-factors': summaryState.data.fraudIndicators.map(f => f.description).join(', '),
        'immediate-actions': summaryState.data.recommendations.filter(r => r.priority === 'high').map(r => r.action).join(', '),
        'corrective-actions': 'Enhanced monitoring and customer verification',
        'preventive-actions': 'System parameter adjustment and staff training',
        'lessons-learned': 'AI detection successful, process improvements identified',
        'sama-notified': summaryState.data.incidentClassification.reportingRequired ? 'yes' : 'no',
        'notification-date': summaryState.data.incidentClassification.reportingRequired ? new Date().toISOString().split('T')[0] : '',
        'compliance-status': summaryState.data.regulatoryAnalysis.complianceStatus
      });

      toast({
        title: "Report Generated",
        description: `${reportType} report downloaded: ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    }
  };

  const handleCopyToClipboard = async () => {
    if (!summaryState.data) return;
    
    const summaryText = formatSummaryForClipboard(summaryState.data);
    
    try {
      await navigator.clipboard.writeText(summaryText);
      toast({
        title: t('ai.copied'),
        description: 'Enhanced summary copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatSummaryForClipboard = (summary: EnhancedAISummaryType): string => {
    return `
Enhanced AI Summary - Transaction ${summary.transactionId}

Risk Assessment:
- Score: ${summary.riskAssessment.score}/100
- Level: ${summary.riskAssessment.level.toUpperCase()}
- Analysis: ${summary.riskAssessment.analysis}

Incident Classification:
- Type: ${summary.incidentClassification.incidentType}
- Severity: ${summary.incidentClassification.severity}
- Reporting Required: ${summary.incidentClassification.reportingRequired ? 'Yes' : 'No'}

Regulatory Analysis:
- Compliance Status: ${summary.regulatoryAnalysis.complianceStatus}
- SAMA Requirements: ${summary.regulatoryAnalysis.samaRequirements.join(', ')}

Fraud Indicators:
${summary.fraudIndicators.map(indicator => `- ${indicator.factor}: ${indicator.description} (Weight: ${indicator.weight}%)`).join('\n')}

Recommendations:
${summary.recommendations.map(rec => `- ${rec.action}: ${rec.description} (Priority: ${rec.priority})`).join('\n')}

Pattern Analysis:
${summary.patternAnalysis.detectedPatterns.map(pattern => `- ${pattern.patternType}: ${pattern.description} (Confidence: ${(pattern.confidence * 100).toFixed(1)}%)`).join('\n')}
    `.trim();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50';
      case 'non-compliant': return 'text-red-600 bg-red-50';
      case 'requires-review': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={cn(
            "bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden",
            language === 'ar' && "text-right"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Enhanced AI Analysis</h2>
                <p className="text-sm text-muted-foreground">SAMA Compliant Transaction Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {summaryState.data && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyToClipboard}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Analysis
                  </Button>
                  {summaryState.data.incidentClassification.reportingRequired && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReport('incident')}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Incident Report
                    </Button>
                  )}
                </>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {!summaryState.data && !summaryState.isLoading && !summaryState.error && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Generate Enhanced AI Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Comprehensive analysis including SAMA compliance, pattern detection, and regulatory assessment
                </p>
                <Button onClick={handleGenerateSummary} className="gap-2">
                  <Brain className="h-4 w-4" />
                  Generate Enhanced Analysis
                </Button>
              </div>
            )}

            {summaryState.isLoading && <LoadingSkeleton />}

            {summaryState.error && (
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Analysis Failed</h3>
                <p className="text-muted-foreground mb-6">{summaryState.error}</p>
                <Button onClick={handleGenerateSummary} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry Analysis
                </Button>
              </div>
            )}

            {summaryState.data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Quick Actions Bar */}
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownloadReport('compliance-audit')}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Compliance Report
                  </Button>
                  {summaryState.data.incidentClassification.escalationNeeded && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownloadReport('investigation')}
                      className="gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Investigation Report
                    </Button>
                  )}
                  <Badge 
                    className={getComplianceColor(summaryState.data.regulatoryAnalysis.complianceStatus)}
                  >
                    SAMA: {summaryState.data.regulatoryAnalysis.complianceStatus.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                    <TabsTrigger value="patterns">Patterns</TabsTrigger>
                    <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {/* Transaction Overview */}
                    <SummarySection
                      title="Transaction Overview"
                      icon={<CreditCard className="h-5 w-5" />}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Amount:</span>
                            <span>{summaryState.data.overview.amount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Merchant:</span>
                            <span>{summaryState.data.overview.merchant}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{summaryState.data.overview.location}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{summaryState.data.overview.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Type:</span>
                            <span>{summaryState.data.overview.type}</span>
                          </div>
                        </div>
                      </div>
                    </SummarySection>

                    {/* Incident Classification */}
                    <SummarySection
                      title="Incident Classification"
                      icon={<Flag className="h-5 w-5" />}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="font-semibold text-lg">{summaryState.data.incidentClassification.incidentType}</div>
                          <div className="text-sm text-muted-foreground">Type</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="font-semibold text-lg">{summaryState.data.incidentClassification.severity}</div>
                          <div className="text-sm text-muted-foreground">Severity</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="font-semibold text-lg">{summaryState.data.incidentClassification.reportingRequired ? 'Yes' : 'No'}</div>
                          <div className="text-sm text-muted-foreground">Reporting Required</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="font-semibold text-lg">{summaryState.data.incidentClassification.escalationNeeded ? 'Yes' : 'No'}</div>
                          <div className="text-sm text-muted-foreground">Escalation Needed</div>
                        </div>
                      </div>
                    </SummarySection>
                  </TabsContent>

                  <TabsContent value="risk" className="space-y-4">
                    {/* Risk Assessment */}
                    <SummarySection
                      title="Risk Assessment"
                      icon={<TrendingUp className="h-5 w-5" />}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold">
                            {summaryState.data.riskAssessment.score}/100
                          </div>
                          <div className="flex-1">
                            <Progress value={summaryState.data.riskAssessment.score} className="h-3" />
                          </div>
                          <Badge className={getRiskColor(summaryState.data.riskAssessment.level)}>
                            {summaryState.data.riskAssessment.level.toUpperCase()}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {summaryState.data.riskAssessment.confidence}% confidence
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {summaryState.data.riskAssessment.analysis}
                        </p>
                      </div>
                    </SummarySection>

                    {/* Fraud Indicators */}
                    <SummarySection
                      title="Fraud Indicators"
                      icon={<AlertTriangle className="h-5 w-5" />}
                    >
                      <div className="space-y-3">
                        {summaryState.data.fraudIndicators.map((indicator, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="font-medium">{indicator.factor}</div>
                              <div className="text-sm text-muted-foreground">
                                {indicator.description}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-medium">{indicator.weight}%</div>
                              <Badge variant="outline" className={getRiskColor(indicator.severity)}>
                                {indicator.severity}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </SummarySection>
                  </TabsContent>

                  <TabsContent value="patterns" className="space-y-4">
                    {/* Pattern Analysis */}
                    <SummarySection
                      title="Detected Patterns"
                      icon={<Network className="h-5 w-5" />}
                    >
                      <div className="space-y-3">
                        {summaryState.data.patternAnalysis.detectedPatterns.map((pattern, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">{pattern.patternType}</div>
                              <div className="text-sm font-medium text-primary">
                                {(pattern.confidence * 100).toFixed(1)}% confidence
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {pattern.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Risk Contribution: {pattern.riskContribution}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </SummarySection>

                    {/* Behavioral Anomalies */}
                    <SummarySection
                      title="Behavioral Anomalies"
                      icon={<BarChart3 className="h-5 w-5" />}
                    >
                      <div className="space-y-3">
                        {summaryState.data.patternAnalysis.behavioralAnomalies.map((anomaly, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{anomaly.type}</div>
                                <div className="text-sm text-muted-foreground">{anomaly.description}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{(anomaly.deviation * 100).toFixed(1)}%</div>
                                <Badge variant="outline" className={getRiskColor(anomaly.severity)}>
                                  {anomaly.severity}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SummarySection>
                  </TabsContent>

                  <TabsContent value="regulatory" className="space-y-4">
                    {/* Regulatory Analysis */}
                    <SummarySection
                      title="SAMA Compliance Analysis"
                      icon={<Shield className="h-5 w-5" />}
                    >
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Compliance Status</div>
                            <Badge className={getComplianceColor(summaryState.data.regulatoryAnalysis.complianceStatus)}>
                              {summaryState.data.regulatoryAnalysis.complianceStatus.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">SAMA Requirements</h4>
                          <ul className="space-y-1">
                            {summaryState.data.regulatoryAnalysis.samaRequirements.map((req, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {summaryState.data.regulatoryAnalysis.potentialViolations.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 text-red-600">Potential Violations</h4>
                            <ul className="space-y-1">
                              {summaryState.data.regulatoryAnalysis.potentialViolations.map((violation, index) => (
                                <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  {violation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium mb-2">Recommended Actions</h4>
                          <ul className="space-y-1">
                            {summaryState.data.regulatoryAnalysis.recommendedActions.map((action, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </SummarySection>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-4">
                    {/* Recommendations */}
                    <SummarySection
                      title="Recommended Actions"
                      icon={<CheckCircle className="h-5 w-5" />}
                    >
                      <div className="space-y-3">
                        {summaryState.data.recommendations.map((rec, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start justify-between p-3 rounded-lg border"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="font-medium">{rec.action}</div>
                              <div className="text-sm text-muted-foreground">
                                {rec.description}
                              </div>
                            </div>
                            <Badge variant={getPriorityColor(rec.priority)} className="ml-4">
                              {rec.priority}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </SummarySection>

                    {/* Historical Context */}
                    <SummarySection
                      title="Historical Context"
                      icon={<Clock className="h-5 w-5" />}
                    >
                      <div className="space-y-3 text-sm">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium">Similar Transactions: </span>
                          {summaryState.data.historicalContext.similarTransactions}
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium">Merchant History: </span>
                          {summaryState.data.historicalContext.merchantHistory}
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium">Location Analysis: </span>
                          {summaryState.data.historicalContext.locationAnalysis}
                        </div>
                      </div>
                    </SummarySection>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SummarySection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default EnhancedAISummary;