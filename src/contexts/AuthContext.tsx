
import React, { createContext, useContext } from 'react';
import { authService } from '@/services/authService';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AuthContextType, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, isLoading, setIsLoading } = useAuthState();
  const { t } = useLanguage();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.signIn(email, password);
      
      toast({
        title: t('success'),
        description: t('loginSuccess'),
      });
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = t('loginError');
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = t('invalidCredentials');
      }
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      await authService.signUp(email, password, name, role);
      
      toast({
        title: t('success'),
        description: t('registerSuccess'),
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = t('registerError');
      
      if (error.message.includes('User already registered')) {
        errorMessage = t('userAlreadyExists');
      }
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      toast({
        title: t('success'),
        description: t('logoutSuccess'),
      });
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: t('error'),
        description: t('logoutError'),
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
