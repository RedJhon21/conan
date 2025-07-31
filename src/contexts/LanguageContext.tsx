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

    // Transactions
    'transactions.realTimeMonitor': 'Real-time Transaction Monitor',
    'transactions.search': 'Search transactions...',

    // Risk
    'risk.topFactors': 'Top Risk Factors',
    
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
    
    // Authentication
    'auth.welcome': 'Welcome to CONAN',
    'auth.loginDescription': 'Advanced Fraud Detection & Risk Management System',
    'auth.bankLogo': 'Bank Logo',
    'auth.signIn': 'Sign In',
    'auth.enterCredentials': 'Enter your credentials',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.signingIn': 'Signing in...',
    'auth.loginFailed': 'Login Failed',
    'auth.invalidCredentials': 'Invalid credentials',
    'auth.loginError': 'Login Error',
    'auth.tryAgain': 'Please try again',
    'auth.demoAccounts': 'Demo Accounts',
    'auth.useAccount': 'Use Account',
    'auth.profile': 'Profile',
    'auth.settings': 'Settings',
    'auth.signOut': 'Sign Out',
    'auth.lastLogin': 'Last Login',
    'auth.roles.analyst': 'Analyst',
    'auth.roles.supervisor': 'Supervisor',
    'auth.roles.admin': 'Admin',
    
    // Customization
    'customization.customize': 'Customize',
    'customization.title': 'Dashboard Customization',
    'customization.description': 'Customize your dashboard to fit your needs',
    'customization.widgets': 'Widgets',
    'customization.widgetsDescription': 'Choose which widgets to display',
    'customization.appearance': 'Appearance',
    'customization.appearanceDescription': 'Customize dashboard appearance',
    'customization.compactMode': 'Compact Mode',
    'customization.showTooltips': 'Show Tooltips',
    'customization.export': 'Export Settings',
    'customization.import': 'Import Settings',
    'customization.reset': 'Reset to Defaults',
    'customization.saved': 'Settings Saved',
    'customization.savedDescription': 'Your preferences have been saved successfully',
    'customization.exported': 'Settings Exported',
    'customization.exportedDescription': 'Settings file has been downloaded',
    'customization.imported': 'Settings Imported',
    'customization.importedDescription': 'Imported settings have been applied',
    'customization.importError': 'Import Error',
    'customization.importErrorDescription': 'Failed to import settings',
    'customization.resetDescription': 'Settings have been reset to defaults',
    
    // Widgets
    'widgets.statistics': 'Statistics',
    'widgets.riskGauge': 'Risk Gauge',
    'widgets.riskFactors': 'Risk Factors',
    'widgets.transactionMonitor': 'Transaction Monitor',
    'widgets.fraudChart': 'Fraud Chart',
    'widgets.patternDetection': 'Pattern Detection',
    'widgets.alerts': 'Alerts',
    'widgets.performance': 'Performance',
    
    // Performance
    'performance.title': 'Performance Monitor',
    'performance.description': 'Real-time system performance metrics',
    'performance.cpu': 'CPU Usage',
    'performance.memory': 'Memory Usage',
    'performance.responseTime': 'Response Time',
    'performance.errorRate': 'Error Rate',
    'performance.uptime': 'Uptime',
    'performance.throughput': 'Throughput',
    'performance.realTime': 'Real-time monitoring',
    'performance.status.connected': 'Connected',
    'performance.status.slow': 'Slow',
    'performance.status.disconnected': 'Disconnected',
    
    // Reports
    'reports.generate': 'Generate Report',
    'reports.title': 'Report Generator',
    'reports.description': 'Generate custom reports for fraud analysis',
    'reports.selectType': 'Select Report Type',
    'reports.format': 'Report Format',
    'reports.period': 'Report Period',
    'reports.options': 'Report Options',
    'reports.confidentiality': 'Confidentiality Level',
    'reports.includeCharts': 'Include Charts',
    'reports.includePatterns': 'Include Patterns',
    'reports.includePerformance': 'Include Performance',
    'reports.print': 'Print',
    'reports.generating': 'Generating...',
    'reports.generated': 'Report Generated',
    'reports.downloadStarted': 'Download started',
    'reports.error': 'Report Error',
    'reports.errorDesc': 'Failed to generate report',
    'reports.noPermission': 'No Permission',
    'reports.noPermissionDesc': 'You do not have permission to generate reports',
    'reports.noPermissionAdvanced': 'Advanced Permission Required',
    'reports.noPermissionAdvancedDesc': 'You need advanced permissions for this report type',
    'reports.restricted': 'Restricted',
    'reports.types.summary': 'Summary',
    'reports.types.summaryDesc': 'Overview of key metrics and indicators',
    'reports.types.detailed': 'Detailed',
    'reports.types.detailedDesc': 'Comprehensive analysis with detailed data',
    'reports.types.trends': 'Trends',
    'reports.types.trendsDesc': 'Trend analysis and forecasting',
    'reports.types.performance': 'Performance',
    'reports.types.performanceDesc': 'Performance metrics and statistics',
    'reports.periods.last24h': 'Last 24 Hours',
    'reports.periods.last7d': 'Last 7 Days',
    'reports.periods.last30d': 'Last 30 Days',
    'reports.periods.custom': 'Custom Period',
    'reports.confidentiality.public': 'Public',
    'reports.confidentiality.internal': 'Internal',
    'reports.confidentiality.confidential': 'Confidential',
    
    // Help
    'help.riskScore': 'Risk score is calculated using machine learning algorithms based on transaction patterns, user behavior, and historical data.',
    'help.fraudDetected': 'Number of fraudulent transactions identified by the system in the current period.',
    'help.falsePositives': 'Legitimate transactions incorrectly flagged as fraudulent. Lower is better.',
    
    // Common
    'common.cancel': 'Cancel',
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

    // Transactions
    'transactions.realTimeMonitor': 'مراقب المعاملات في الوقت الفعلي',
    'transactions.search': 'البحث في المعاملات...',

    // Risk
    'risk.topFactors': 'أهم عوامل المخاطر',
    
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
    
    // Authentication
    'auth.welcome': 'مرحباً بك في كونان',
    'auth.loginDescription': 'نظام متقدم لكشف الاحتيال وإدارة المخاطر',
    'auth.bankLogo': 'شعار البنك',
    'auth.signIn': 'تسجيل الدخول',
    'auth.enterCredentials': 'أدخل بيانات الاعتماد الخاصة بك',
    'auth.email': 'البريد الإلكتروني',
    'auth.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.passwordPlaceholder': 'أدخل كلمة المرور',
    'auth.signingIn': 'جاري تسجيل الدخول...',
    'auth.loginFailed': 'فشل تسجيل الدخول',
    'auth.invalidCredentials': 'بيانات الاعتماد غير صحيحة',
    'auth.loginError': 'خطأ في تسجيل الدخول',
    'auth.tryAgain': 'حاول مرة أخرى',
    'auth.demoAccounts': 'حسابات تجريبية',
    'auth.useAccount': 'استخدم الحساب',
    'auth.profile': 'الملف الشخصي',
    'auth.settings': 'الإعدادات',
    'auth.signOut': 'تسجيل الخروج',
    'auth.lastLogin': 'آخر دخول',
    'auth.roles.analyst': 'محلل',
    'auth.roles.supervisor': 'مشرف',
    'auth.roles.admin': 'مدير',
    
    // Customization
    'customization.customize': 'تخصيص',
    'customization.title': 'تخصيص لوحة القيادة',
    'customization.description': 'قم بتخصيص لوحة القيادة حسب احتياجاتك',
    'customization.widgets': 'الأدوات',
    'customization.widgetsDescription': 'اختر الأدوات التي تريد عرضها',
    'customization.appearance': 'المظهر',
    'customization.appearanceDescription': 'تخصيص مظهر لوحة القيادة',
    'customization.compactMode': 'الوضع المضغوط',
    'customization.showTooltips': 'إظهار التلميحات',
    'customization.export': 'تصدير الإعدادات',
    'customization.import': 'استيراد الإعدادات',
    'customization.saved': 'تم حفظ الإعدادات',
    'customization.savedDescription': 'تم حفظ تفضيلاتك بنجاح',
    'customization.exported': 'تم تصدير الإعدادات',
    'customization.exportedDescription': 'تم تنزيل ملف الإعدادات',
    'customization.imported': 'تم استيراد الإعدادات',
    'customization.importedDescription': 'تم تطبيق الإعدادات المستوردة',
    'customization.importError': 'خطأ في الاستيراد',
    'customization.importErrorDescription': 'فشل في استيراد الإعدادات',
    'customization.reset': 'إعادة تعيين',
    'customization.resetDescription': 'تم إعادة تعيين الإعدادات إلى الافتراضية',
    
    // Widgets
    'widgets.statistics': 'الإحصائيات',
    'widgets.riskGauge': 'مقياس المخاطر',
    'widgets.riskFactors': 'عوامل المخاطر',
    'widgets.transactionMonitor': 'مراقب المعاملات',
    'widgets.fraudChart': 'مخطط الاحتيال',
    'widgets.patternDetection': 'اكتشاف الأنماط',
    'widgets.alerts': 'التنبيهات',
    'widgets.performance': 'الأداء',
    
    // Performance
    'performance.title': 'مراقب الأداء',
    'performance.description': 'مقاييس الأداء في الوقت الفعلي',
    'performance.cpu': 'المعالج',
    'performance.memory': 'الذاكرة',
    'performance.responseTime': 'وقت الاستجابة',
    'performance.errorRate': 'معدل الأخطاء',
    'performance.uptime': 'وقت التشغيل',
    'performance.throughput': 'معدل المعالجة',
    'performance.realTime': 'الوقت الفعلي',
    'performance.status.connected': 'متصل',
    'performance.status.slow': 'بطيء',
    'performance.status.disconnected': 'منقطع',
    
    // Reports
    'reports.generate': 'إنشاء تقرير',
    'reports.title': 'مولد التقارير',
    'reports.description': 'قم بإنشاء تقارير مخصصة لتحليل الاحتيال',
    'reports.selectType': 'اختر نوع التقرير',
    'reports.format': 'تنسيق التقرير',
    'reports.period': 'فترة التقرير',
    'reports.options': 'خيارات التقرير',
    'reports.confidentiality': 'مستوى السرية',
    'reports.includeCharts': 'تضمين المخططات',
    'reports.includePatterns': 'تضمين الأنماط',
    'reports.includePerformance': 'تضمين الأداء',
    'reports.print': 'طباعة',
    'reports.generating': 'جاري الإنشاء...',
    'reports.generated': 'تم إنشاء التقرير',
    'reports.downloadStarted': 'بدأ التنزيل',
    'reports.error': 'خطأ في التقرير',
    'reports.errorDesc': 'فشل في إنشاء التقرير',
    'reports.noPermission': 'لا يوجد إذن',
    'reports.noPermissionDesc': 'ليس لديك إذن لإنشاء التقارير',
    'reports.noPermissionAdvanced': 'إذن متقدم مطلوب',
    'reports.noPermissionAdvancedDesc': 'تحتاج إلى إذن متقدم لهذا النوع من التقارير',
    'reports.restricted': 'مقيد',
    'reports.types.summary': 'ملخص',
    'reports.types.summaryDesc': 'نظرة عامة على المقاييس الرئيسية',
    'reports.types.detailed': 'مفصل',
    'reports.types.detailedDesc': 'تحليل شامل مع البيانات التفصيلية',
    'reports.types.trends': 'الاتجاهات',
    'reports.types.trendsDesc': 'تحليل الاتجاهات والتوقعات',
    'reports.types.performance': 'الأداء',
    'reports.types.performanceDesc': 'مقاييس وإحصائيات الأداء',
    'reports.periods.last24h': 'آخر 24 ساعة',
    'reports.periods.last7d': 'آخر 7 أيام',
    'reports.periods.last30d': 'آخر 30 يوم',
    'reports.periods.custom': 'فترة مخصصة',
    'reports.confidentiality.public': 'عام',
    'reports.confidentiality.internal': 'داخلي',
    'reports.confidentiality.confidential': 'سري',
    
    // Help
    'help.riskScore': 'يتم حساب درجة المخاطر باستخدام خوارزميات التعلم الآلي',
    'help.fraudDetected': 'عدد المعاملات الاحتيالية المكتشفة في الفترة الحالية',
    'help.falsePositives': 'المعاملات الشرعية المصنفة خطأً كاحتيال',
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