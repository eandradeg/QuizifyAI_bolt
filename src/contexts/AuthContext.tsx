
import React, { createContext, useContext, useState } from 'react';
import { authService } from '@/services/authService';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import GoogleRoleModal from '@/components/Auth/GoogleRoleModal';
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
  const [showGoogleRoleModal, setShowGoogleRoleModal] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<any>(null);

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

  const loginWithGoogle = async () => {
    try {
      console.log('Starting Google authentication process');
      await authService.signInWithGoogle();
      // Don't show success toast here as the user will be redirected
      // Also don't set loading to false as the redirect will handle the state
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: t('error'),
        description: t('googleLoginError') || 'Error al iniciar sesión con Google',
        variant: 'destructive',
      });
      setIsLoading(false);
      throw error;
    }
  };

  const registerWithGoogle = async (role: UserRole) => {
    try {
      console.log('Starting Google registration process with role:', role);
      await authService.signUpWithGoogle(role);
      // Don't show success toast here as the user will be redirected
      // Also don't set loading to false as the redirect will handle the state
    } catch (error: any) {
      console.error('Google registration error:', error);
      toast({
        title: t('error'),
        description: 'Error al registrarse con Google',
        variant: 'destructive',
      });
      setIsLoading(false);
      throw error;
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

  const handleGoogleRoleConfirm = async (role: UserRole) => {
    if (pendingGoogleUser) {
      try {
        await authService.updateUserProfile(
          pendingGoogleUser.id, 
          pendingGoogleUser.user_metadata?.full_name || pendingGoogleUser.email, 
          role
        );
        
        setShowGoogleRoleModal(false);
        setPendingGoogleUser(null);
        
        toast({
          title: t('success'),
          description: 'Registro completado exitosamente',
        });
      } catch (error: any) {
        console.error('Error completing Google registration:', error);
        toast({
          title: t('error'),
          description: 'Error al completar el registro',
          variant: 'destructive',
        });
      }
    }
  };

  const handleGoogleRoleCancel = () => {
    setShowGoogleRoleModal(false);
    setPendingGoogleUser(null);
    // Sign out the user since they cancelled the registration
    authService.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle, 
      register, 
      logout, 
      isLoading,
      registerWithGoogle 
    }}>
      {children}
      <GoogleRoleModal
        isOpen={showGoogleRoleModal}
        onClose={handleGoogleRoleCancel}
        onConfirm={handleGoogleRoleConfirm}
        userName={pendingGoogleUser?.user_metadata?.full_name}
      />
    </AuthContext.Provider>
  );
};
