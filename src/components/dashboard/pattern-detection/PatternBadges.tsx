import { Badge } from '@/components/ui/badge';
import { PatternBadge, PatternType } from '@/types/pattern-detection';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Shield, 
  MapPin, 
  DollarSign, 
  Store, 
  Clock 
} from 'lucide-react';

interface PatternBadgesProps {
  patterns: PatternBadge[];
  onPatternClick?: (pattern: PatternType) => void;
  selectedPattern?: PatternType | null;
}

const patternIcons: Record<PatternType, React.ComponentType<any>> = {
  velocity_attack: Zap,
  account_takeover: Shield,
  location_anomaly: MapPin,
  amount_pattern: DollarSign,
  merchant_fraud: Store,
  time_based: Clock,
};

const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'high':
      return 'bg-destructive text-destructive-foreground border-destructive/20';
    case 'medium':
      return 'bg-warning text-warning-foreground border-warning/20';
    case 'low':
      return 'bg-muted text-muted-foreground border-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const PatternBadges: React.FC<PatternBadgesProps> = ({
  patterns,
  onPatternClick,
  selectedPattern,
}) => {
  const { t } = useLanguage();

  const getPatternLabel = (type: PatternType): string => {
    const labels: Record<PatternType, string> = {
      velocity_attack: t('patternDetection.patterns.velocityAttack'),
      account_takeover: t('patternDetection.patterns.accountTakeover'),
      location_anomaly: t('patternDetection.patterns.locationAnomaly'),
      amount_pattern: t('patternDetection.patterns.amountPattern'),
      merchant_fraud: t('patternDetection.patterns.merchantFraud'),
      time_based: t('patternDetection.patterns.timeBased'),
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('patternDetection.detectedPatterns')}</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {patterns.map((pattern) => {
          const Icon = patternIcons[pattern.type];
          const isSelected = selectedPattern === pattern.type;
          
          return (
            <div
              key={pattern.type}
              onClick={() => onPatternClick?.(pattern.type)}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                "hover:shadow-lg hover:scale-105",
                isSelected ? "ring-2 ring-primary" : "",
                getSeverityColor(pattern.severity)
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-5 w-5" />
                <Badge variant={pattern.severity === 'high' ? 'destructive' : 'secondary'}>
                  {pattern.count}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  {getPatternLabel(pattern.type)}
                </p>
                <p className="text-xs opacity-80">
                  {pattern.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};