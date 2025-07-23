import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        toast({
          title: t('auth.loginFailed'),
          description: t('auth.invalidCredentials'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('auth.loginError'),
        description: t('auth.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'analyst@bank.com', role: 'Analyst', password: 'password123' },
    { email: 'supervisor@bank.com', role: 'Supervisor', password: 'password123' },
    { email: 'admin@bank.com', role: 'Admin', password: 'password123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('auth.welcome')}
          </h1>
          <p className="text-muted-foreground">
            {t('auth.loginDescription')}
          </p>
        </div>

        {/* Bank Logo Placeholder */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-16 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
            <span className="text-xs text-muted-foreground text-center">
              {t('auth.bankLogo')}
            </span>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {t('auth.signIn')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.enterCredentials')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                    dir="ltr"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginLoading || loading}
              >
                {loginLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    <span>{t('auth.signingIn')}</span>
                  </div>
                ) : (
                  t('auth.signIn')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              <span>{t('auth.demoAccounts')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded border border-border/50 text-sm"
              >
                <div>
                  <div className="font-medium">{account.role}</div>
                  <div className="text-muted-foreground text-xs">{account.email}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                  className="text-xs"
                >
                  {t('auth.useAccount')}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          © 2024 CONAN Fraud Detection System. All rights reserved.
        </div>
      </div>
    </div>
  );
};