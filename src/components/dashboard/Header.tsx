import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages, Shield, Wifi } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {t('dashboard.title')}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {t('dashboard.subtitle')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-success" />
              <Badge variant="outline" className="text-success border-success">
                {t('status.online')}
              </Badge>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleLanguage}
              className="flex items-center space-x-2"
            >
              <Languages className="h-4 w-4" />
              <span>{t('language.toggle')}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};