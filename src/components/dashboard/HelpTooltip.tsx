import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle, Info } from 'lucide-react';

interface HelpTooltipProps {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  variant?: 'help' | 'info';
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  content, 
  side = 'top', 
  align = 'center', 
  variant = 'help',
  className = '' 
}) => {
  const { t } = useLanguage();

  const Icon = variant === 'help' ? HelpCircle : Info;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className={`inline-flex items-center justify-center w-4 h-4 text-muted-foreground hover:text-foreground transition-colors ${className}`}
            type="button"
          >
            <Icon className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Predefined help tooltips for common dashboard elements
export const DashboardTooltips = {
  riskScore: (
    <HelpTooltip content="Risk score is calculated using machine learning algorithms based on transaction patterns, user behavior, and historical data." />
  ),
  fraudDetected: (
    <HelpTooltip content="Number of fraudulent transactions identified by the system in the current period." />
  ),
  falsePositives: (
    <HelpTooltip content="Legitimate transactions incorrectly flagged as fraudulent. Lower is better." />
  ),
  transactionVolume: (
    <HelpTooltip content="Total number of transactions processed in the selected time period." />
  ),
  patternDetection: (
    <HelpTooltip content="Advanced pattern recognition identifies suspicious behaviors and transaction sequences." />
  ),
  velocityAttack: (
    <HelpTooltip content="Rapid sequence of transactions within a short time frame, often indicating card testing or fraud." />
  ),
  accountTakeover: (
    <HelpTooltip content="Unusual access patterns suggesting unauthorized account access or credential compromise." />
  ),
  locationAnomaly: (
    <HelpTooltip content="Transactions from unexpected geographic locations based on user's typical behavior." />
  ),
  performanceMetrics: (
    <HelpTooltip content="Real-time system performance indicators including CPU, memory, and response times." />
  ),
  aiSummary: (
    <HelpTooltip content="AI-generated analysis of current fraud trends and risk factors with actionable insights." />
  ),
  riskHeatmap: (
    <HelpTooltip content="Visual representation of risk distribution across time periods and locations." />
  ),
  networkGraph: (
    <HelpTooltip content="Interactive visualization showing relationships between transactions, accounts, and entities." />
  ),
  timeline: (
    <HelpTooltip content="Chronological view of suspicious activities and pattern detections over time." />
  ),
};

// Custom hook for contextual help
export const useHelpContent = () => {
  const { t } = useLanguage();

  const getHelpContent = (key: string): string => {
    return t(`help.${key}`) || key;
  };

  return { getHelpContent };
};