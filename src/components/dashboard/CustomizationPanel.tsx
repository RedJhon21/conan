import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  Settings, 
  Palette, 
  Layout, 
  Eye, 
  EyeOff,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardPreferences {
  widgets: {
    statistics: boolean;
    riskGauge: boolean;
    riskFactors: boolean;
    transactionMonitor: boolean;
    fraudChart: boolean;
    patternDetection: boolean;
    alerts: boolean;
    performance: boolean;
  };
  theme: 'dark' | 'light' | 'auto';
  refreshInterval: number;
  compactMode: boolean;
  showTooltips: boolean;
}

const defaultPreferences: DashboardPreferences = {
  widgets: {
    statistics: true,
    riskGauge: true,
    riskFactors: true,
    transactionMonitor: true,
    fraudChart: true,
    patternDetection: true,
    alerts: true,
    performance: true,
  },
  theme: 'dark',
  refreshInterval: 30000,
  compactMode: false,
  showTooltips: true,
};

export const CustomizationPanel: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<DashboardPreferences>(defaultPreferences);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem('conan_dashboard_preferences');
    if (saved) {
      try {
        setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to load preferences:', e);
      }
    }
  }, []);

  const savePreferences = (newPreferences: DashboardPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('conan_dashboard_preferences', JSON.stringify(newPreferences));
    toast({
      title: t('customization.saved'),
      description: t('customization.savedDescription'),
    });
  };

  const toggleWidget = (widget: keyof DashboardPreferences['widgets']) => {
    const newPreferences = {
      ...preferences,
      widgets: {
        ...preferences.widgets,
        [widget]: !preferences.widgets[widget],
      },
    };
    savePreferences(newPreferences);
  };

  const resetToDefaults = () => {
    savePreferences(defaultPreferences);
    toast({
      title: t('customization.reset'),
      description: t('customization.resetDescription'),
    });
  };

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(preferences, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conan-dashboard-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t('customization.exported'),
      description: t('customization.exportedDescription'),
    });
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          savePreferences({ ...defaultPreferences, ...imported });
          toast({
            title: t('customization.imported'),
            description: t('customization.importedDescription'),
          });
        } catch (error) {
          toast({
            title: t('customization.importError'),
            description: t('customization.importErrorDescription'),
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const widgetLabels = {
    statistics: t('widgets.statistics'),
    riskGauge: t('widgets.riskGauge'),
    riskFactors: t('widgets.riskFactors'),
    transactionMonitor: t('widgets.transactionMonitor'),
    fraudChart: t('widgets.fraudChart'),
    patternDetection: t('widgets.patternDetection'),
    alerts: t('widgets.alerts'),
    performance: t('widgets.performance'),
  };

  const activeWidgets = Object.values(preferences.widgets).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>{t('customization.customize')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>{t('customization.title')}</span>
          </DialogTitle>
          <DialogDescription>
            {t('customization.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Widget Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Layout className="h-4 w-4" />
                <span>{t('customization.widgets')}</span>
                <Badge variant="secondary">{activeWidgets}/8</Badge>
              </CardTitle>
              <CardDescription>
                {t('customization.widgetsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(preferences.widgets).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      {enabled ? (
                        <Eye className="h-4 w-4 text-success" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Label htmlFor={key} className="text-sm font-medium">
                        {widgetLabels[key as keyof typeof widgetLabels]}
                      </Label>
                    </div>
                    <Switch
                      id={key}
                      checked={enabled}
                      onCheckedChange={() => toggleWidget(key as keyof DashboardPreferences['widgets'])}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Theme & Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Palette className="h-4 w-4" />
                <span>{t('customization.appearance')}</span>
              </CardTitle>
              <CardDescription>
                {t('customization.appearanceDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-mode">{t('customization.compactMode')}</Label>
                <Switch
                  id="compact-mode"
                  checked={preferences.compactMode}
                  onCheckedChange={(checked) => 
                    savePreferences({ ...preferences, compactMode: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-tooltips">{t('customization.showTooltips')}</Label>
                <Switch
                  id="show-tooltips"
                  checked={preferences.showTooltips}
                  onCheckedChange={(checked) => 
                    savePreferences({ ...preferences, showTooltips: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={exportSettings}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>{t('customization.export')}</span>
            </Button>
            
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => document.getElementById('import-settings')?.click()}
              >
                <Upload className="h-4 w-4" />
                <span>{t('customization.import')}</span>
              </Button>
              <input
                id="import-settings"
                type="file"
                accept=".json"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={importSettings}
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{t('customization.reset')}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};