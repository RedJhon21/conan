import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AlertSeverity = 'high' | 'medium' | 'low';

interface AlertCardProps {
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  title,
  description,
  severity,
  timestamp,
  actionLabel,
  onAction,
}) => {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'high':
        return {
          icon: AlertTriangle,
          badgeVariant: 'destructive' as const,
          cardClass: 'border-destructive/20 bg-destructive/5',
        };
      case 'medium':
        return {
          icon: Shield,
          badgeVariant: 'secondary' as const,
          cardClass: 'border-warning/20 bg-warning/5',
        };
      case 'low':
        return {
          icon: Info,
          badgeVariant: 'outline' as const,
          cardClass: 'border-primary/20 bg-primary/5',
        };
    }
  };

  const { icon: Icon, badgeVariant, cardClass } = getSeverityConfig();

  return (
    <Card className={cn('transition-all duration-200 hover:shadow-md', cardClass)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-foreground" />
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Badge variant={badgeVariant} className="text-xs">
            {severity.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{timestamp}</span>
          {actionLabel && onAction && (
            <Button variant="outline" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};