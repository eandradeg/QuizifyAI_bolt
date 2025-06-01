
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'parent' | 'teacher'>('parent');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name) {
      toast({
        title: t('error'),
        description: t('requiredField') + ': ' + t('name'),
        variant: 'destructive',
      });
      return;
    }
    
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
    
    if (password.length < 6) {
      toast({
        title: t('error'),
        description: t('passwordTooShort'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name, role);
    } catch (error) {
      console.error('Register error:', error);
      // Error toast is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('register')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
          <div className="space-y-2">
            <Label htmlFor="role">{t('role')}</Label>
            <Select value={role} onValueChange={(value: 'parent' | 'teacher') => setRole(value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">{t('parent')}</SelectItem>
                <SelectItem value="teacher">{t('teacher')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? t('loading') : t('register')}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={onToggleMode} disabled={isLoading}>
            {t('hasAccount')} {t('login')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
