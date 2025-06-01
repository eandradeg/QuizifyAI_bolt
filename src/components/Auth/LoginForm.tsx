
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      toast({
        title: t('error'),
        description: t('requiredField') + ': ' + t('email'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!password) {
      toast({
        title: t('error'),
        description: t('requiredField') + ': ' + t('password'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      // Error toast is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('login')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@correo.com"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? t('loading') : t('login')}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={onToggleMode} disabled={isLoading}>
            {t('noAccount')} {t('register')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
