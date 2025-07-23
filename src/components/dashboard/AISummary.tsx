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
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateAISummary } from '@/services/aiService';
import { Transaction, AISummary as AISummaryType, SummaryState } from '@/types/summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AISummaryProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

const AISummary: React.FC<AISummaryProps> = ({ transaction, isOpen, onClose }) => {
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
      const summary = await generateAISummary(transaction);
      setSummaryState({ isLoading: false, data: summary, error: null });
    } catch (error) {
      setSummaryState({ 
        isLoading: false, 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
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
        description: 'Summary copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatSummaryForClipboard = (summary: AISummaryType): string => {
    return `
${t('summary.overview')}:
- Amount: ${summary.overview.amount}
- Merchant: ${summary.overview.merchant}
- Location: ${summary.overview.location}
- Time: ${summary.overview.timestamp}

${t('summary.riskAssessment')}:
- Score: ${summary.riskAssessment.score}/100
- Level: ${summary.riskAssessment.level.toUpperCase()}
- Analysis: ${summary.riskAssessment.analysis}

${t('summary.fraudIndicators')}:
${summary.fraudIndicators.map(indicator => `- ${indicator.factor}: ${indicator.description}`).join('\n')}

${t('summary.recommendations')}:
${summary.recommendations.map(rec => `- ${rec.action}: ${rec.description}`).join('\n')}
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
            "bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden",
            language === 'ar' && "text-right"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">{t('ai.summary')}</h2>
            </div>
            <div className="flex items-center gap-2">
              {summaryState.data && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyToClipboard}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {t('ai.copyToClipboard')}
                </Button>
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
                <h3 className="text-lg font-medium mb-2">{t('ai.generateSummary')}</h3>
                <p className="text-muted-foreground mb-6">
                  Generate an AI-powered analysis of this transaction
                </p>
                <Button onClick={handleGenerateSummary} className="gap-2">
                  <Brain className="h-4 w-4" />
                  {t('ai.generateSummary')}
                </Button>
              </div>
            )}

            {summaryState.isLoading && <LoadingSkeleton />}

            {summaryState.error && (
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('ai.error')}</h3>
                <p className="text-muted-foreground mb-6">{summaryState.error}</p>
                <Button onClick={handleGenerateSummary} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {t('ai.retry')}
                </Button>
              </div>
            )}

            {summaryState.data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <SummarySection
                  title={t('summary.overview')}
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

                <SummarySection
                  title={t('summary.riskAssessment')}
                  icon={<TrendingUp className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold">
                        {summaryState.data.riskAssessment.score}/100
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

                <SummarySection
                  title={t('summary.fraudIndicators')}
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
                        <div className="space-y-1">
                          <div className="font-medium">{indicator.factor}</div>
                          <div className="text-sm text-muted-foreground">
                            {indicator.description}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{indicator.weight}%</div>
                          <Badge variant="outline" className={getRiskColor(indicator.severity)}>
                            {indicator.severity}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </SummarySection>

                <SummarySection
                  title={t('summary.recommendations')}
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
                        <Badge variant={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </SummarySection>

                <SummarySection
                  title={t('summary.historicalContext')}
                  icon={<Clock className="h-5 w-5" />}
                >
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Similar Transactions: </span>
                      {summaryState.data.historicalContext.similarTransactions}
                    </div>
                    <div>
                      <span className="font-medium">Merchant History: </span>
                      {summaryState.data.historicalContext.merchantHistory}
                    </div>
                    <div>
                      <span className="font-medium">Location Analysis: </span>
                      {summaryState.data.historicalContext.locationAnalysis}
                    </div>
                  </div>
                </SummarySection>
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

export default AISummary;