import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'dashboard.title': 'CONAN Fraud Detection',
    'dashboard.subtitle': 'Advanced Fraud Detection & Risk Management System',
    'language.toggle': 'عربي',
    
    // Metrics
    'metrics.totalTransactions': 'Total Transactions',
    'metrics.fraudDetected': 'Fraud Detected',
    'metrics.riskScore': 'Average Risk Score',
    'metrics.falsePositives': 'False Positives',
    
    // Charts
    'charts.fraudTrends': 'Fraud Detection Trends',
    'charts.riskDistribution': 'Risk Score Distribution',
    'charts.transactionVolume': 'Transaction Volume',
    
    // Alerts
    'alerts.highRisk': 'High Risk Transaction Detected',
    'alerts.newFraud': 'New Fraud Pattern Identified',
    'alerts.systemAlert': 'System Alert',
    
    // Status
    'status.online': 'Online',
    'status.processing': 'Processing',
    'status.alert': 'Alert',
    
    // Common
    'common.viewDetails': 'View Details',
    'common.refresh': 'Refresh',
    'common.export': 'Export',
    
    // AI Summary
    'ai.generateSummary': 'Generate AI Summary',
    'ai.summary': 'AI Summary',
    'ai.generating': 'Generating summary...',
    'ai.copyToClipboard': 'Copy to Clipboard',
    'ai.copied': 'Copied to clipboard!',
    'ai.error': 'Failed to generate summary',
    'ai.retry': 'Retry',
    'ai.close': 'Close',
    
    // Summary Sections
    'summary.overview': 'Transaction Overview',
    'summary.riskAssessment': 'Risk Assessment',
    'summary.fraudIndicators': 'Fraud Indicators',
    'summary.recommendations': 'Recommendations',
    'summary.historicalContext': 'Historical Context',
    
    // Pattern Detection
    'patternDetection.title': 'Pattern Detection',
    'patternDetection.networkGraph': 'Network Graph',
    'patternDetection.timelineView': 'Timeline View',
    'patternDetection.riskHeatmap': 'Risk Heatmap',
    'patternDetection.detectedPatterns': 'Detected Patterns',
    'patternDetection.patterns.velocityAttack': 'Velocity Attack',
    'patternDetection.patterns.accountTakeover': 'Account Takeover',
    'patternDetection.patterns.locationAnomaly': 'Location Anomaly',
    'patternDetection.patterns.amountPattern': 'Amount Pattern',
    'patternDetection.patterns.merchantFraud': 'Merchant Fraud',
    'patternDetection.patterns.timeBased': 'Time-Based',
    'patternDetection.legend.suspicious': 'Suspicious',
    'patternDetection.legend.highRisk': 'High Risk',
    'patternDetection.legend.mediumRisk': 'Medium Risk',
    'patternDetection.legend.lowRisk': 'Low Risk',
    'patternDetection.timeline.transactions': 'Transactions',
    'patternDetection.timeline.avgRisk': 'Avg Risk',
    'patternDetection.timeline.maxRisk': 'Max Risk',
    'patternDetection.timeline.patterns': 'Patterns',
    'patternDetection.timeline.dataPoints': 'data points',
    'patternDetection.timeline.riskScore': 'Risk Score',
    'patternDetection.timeline.eventDetails': 'Event Details',
    'patternDetection.heatmap.timeLocation': 'Time & Location',
    'patternDetection.heatmap.timeRisk': 'Time & Risk',
    'patternDetection.heatmap.riskLevel': 'Risk Level',
    'patternDetection.heatmap.location': 'Location',
    'patternDetection.heatmap.time': 'Time',
    'patternDetection.heatmap.riskScore': 'Risk Score',
    'patternDetection.heatmap.transactions': 'Transactions',
  },
  ar: {
    // Header
    'dashboard.title': 'كونان لكشف الاحتيال',
    'dashboard.subtitle': 'نظام متقدم لكشف الاحتيال وإدارة المخاطر',
    'language.toggle': 'English',
    
    // Metrics
    'metrics.totalTransactions': 'إجمالي المعاملات',
    'metrics.fraudDetected': 'الاحتيال المكتشف',
    'metrics.riskScore': 'متوسط درجة المخاطر',
    'metrics.falsePositives': 'الإيجابيات الخاطئة',
    
    // Charts
    'charts.fraudTrends': 'اتجاهات كشف الاحتيال',
    'charts.riskDistribution': 'توزيع درجة المخاطر',
    'charts.transactionVolume': 'حجم المعاملات',
    
    // Alerts
    'alerts.highRisk': 'تم اكتشاف معاملة عالية المخاطر',
    'alerts.newFraud': 'تم تحديد نمط احتيال جديد',
    'alerts.systemAlert': 'تنبيه النظام',
    
    // Status
    'status.online': 'متصل',
    'status.processing': 'قيد المعالجة',
    'status.alert': 'تنبيه',
    
    // Common
    'common.viewDetails': 'عرض التفاصيل',
    'common.refresh': 'تحديث',
    'common.export': 'تصدير',
    
    // AI Summary
    'ai.generateSummary': 'إنشاء ملخص ذكي',
    'ai.summary': 'الملخص الذكي',
    'ai.generating': 'جاري إنشاء الملخص...',
    'ai.copyToClipboard': 'نسخ إلى الحافظة',
    'ai.copied': 'تم النسخ إلى الحافظة!',
    'ai.error': 'فشل في إنشاء الملخص',
    'ai.retry': 'إعادة المحاولة',
    'ai.close': 'إغلاق',
    
    // Summary Sections
    'summary.overview': 'نظرة عامة على المعاملة',
    'summary.riskAssessment': 'تقييم المخاطر',
    'summary.fraudIndicators': 'مؤشرات الاحتيال',
    'summary.recommendations': 'التوصيات',
    'summary.historicalContext': 'السياق التاريخي',
    
    // Pattern Detection
    'patternDetection.title': 'اكتشاف الأنماط',
    'patternDetection.networkGraph': 'الشبكة البيانية',
    'patternDetection.timelineView': 'العرض الزمني',
    'patternDetection.riskHeatmap': 'خريطة المخاطر الحرارية',
    'patternDetection.detectedPatterns': 'الأنماط المكتشفة',
    'patternDetection.patterns.velocityAttack': 'هجوم السرعة',
    'patternDetection.patterns.accountTakeover': 'استيلاء على الحساب',
    'patternDetection.patterns.locationAnomaly': 'شذوذ موقعي',
    'patternDetection.patterns.amountPattern': 'نمط المبلغ',
    'patternDetection.patterns.merchantFraud': 'احتيال التاجر',
    'patternDetection.patterns.timeBased': 'مبني على الوقت',
    'patternDetection.legend.suspicious': 'مشبوه',
    'patternDetection.legend.highRisk': 'مخاطر عالية',
    'patternDetection.legend.mediumRisk': 'مخاطر متوسطة',
    'patternDetection.legend.lowRisk': 'مخاطر منخفضة',
    'patternDetection.timeline.transactions': 'المعاملات',
    'patternDetection.timeline.avgRisk': 'متوسط المخاطر',
    'patternDetection.timeline.maxRisk': 'أقصى مخاطر',
    'patternDetection.timeline.patterns': 'الأنماط',
    'patternDetection.timeline.dataPoints': 'نقاط البيانات',
    'patternDetection.timeline.riskScore': 'نقاط المخاطر',
    'patternDetection.timeline.eventDetails': 'تفاصيل الحدث',
    'patternDetection.heatmap.timeLocation': 'الوقت والموقع',
    'patternDetection.heatmap.timeRisk': 'الوقت والمخاطر',
    'patternDetection.heatmap.riskLevel': 'مستوى المخاطر',
    'patternDetection.heatmap.location': 'الموقع',
    'patternDetection.heatmap.time': 'الوقت',
    'patternDetection.heatmap.riskScore': 'نقاط المخاطر',
    'patternDetection.heatmap.transactions': 'المعاملات',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};