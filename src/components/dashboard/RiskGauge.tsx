import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface RiskGaugeProps {
  value: number; // 0-100
  title?: string;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ 
  value, 
  title,
  size = 200 
}) => {
  const { t } = useLanguage();
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = (size - 40) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'High', color: 'hsl(var(--destructive))' };
    if (score >= 40) return { level: 'Medium', color: 'hsl(var(--warning))' };
    return { level: 'Low', color: 'hsl(var(--success))' };
  };

  const riskInfo = getRiskLevel(value);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-center text-foreground">
          {title || t('risk.overallScore') || 'Overall Risk Score'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
              opacity="0.3"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={riskInfo.color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{
                filter: value >= 70 ? 'drop-shadow(0 0 8px hsla(var(--destructive), 0.5))' : 'none'
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-foreground" style={{ color: riskInfo.color }}>
                {animatedValue}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t('risk.score') || 'Score'}
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Risk level indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: riskInfo.color }}
          />
          <span className="text-lg font-medium text-foreground">
            {t(`risk.level.${riskInfo.level.toLowerCase()}`) || riskInfo.level} {t('risk.risk') || 'Risk'}
          </span>
        </motion.div>
        
        {/* Pulse animation for high risk */}
        {value >= 70 && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: riskInfo.color }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        
        {/* Risk threshold indicators */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>0</span>
            <span>40</span>
            <span>70</span>
            <span>100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full flex">
              <div className="flex-1 bg-success"></div>
              <div className="flex-1 bg-warning"></div>
              <div className="flex-1 bg-destructive"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{t('risk.low') || 'Low'}</span>
            <span>{t('risk.medium') || 'Medium'}</span>
            <span>{t('risk.high') || 'High'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};