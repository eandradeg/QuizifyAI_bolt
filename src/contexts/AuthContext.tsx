import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

type UserRole = 'parent' | 'student' | 'teacher';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        // Add a small delay for new registrations to ensure the trigger has completed
        if (event === 'SIGNED_IN') {
          // Check if this is a new user by looking at the session metadata
          const isNewUser = session.user.email_confirmed_at === session.user.created_at;
          if (isNewUser) {
            setTimeout(() => {
              fetchUserProfile(session.user);
            }, 1000);
          } else {
            await fetchUserProfile(session.user);
          }
        } else {
          await fetchUserProfile(session.user);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [t]);

  const fetchUserProfile = async (supabaseUser: SupabaseUser, retries = 3) => {
    try {
      console.log('Fetching profile for user:', supabaseUser.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist and we have retries left, wait and try again
        if (error.code === 'PGRST116' && retries > 0) {
          console.log(`Profile not found, retrying... (${retries} retries left)`);
          setTimeout(() => {
            fetchUserProfile(supabaseUser, retries - 1);
          }, 1000);
          return;
        }
        
        toast({
          title: t('error'),
          description: t('connectionError'),
          variant: 'destructive',
        });
        return;
      }

      if (profile) {
        console.log('Profile found:', profile);
        setUser({
          id: profile.id,
          email: profile.email,
          role: profile.role as UserRole,
          name: profile.display_name,
          avatar: profile.avatar_url || undefined,
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      if (retries > 0) {
        setTimeout(() => {
          fetchUserProfile(supabaseUser, retries - 1);
        }, 1000);
      }
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
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
        throw new Error(error.message);
      }

      console.log('Login successful for:', email);
      toast({
        title: t('success'),
        description: t('loginSuccess'),
      });

      // User profile will be fetched automatically by the auth state change listener
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      console.log('Attempting registration for:', email, 'with role:', role);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            role: role,
          },
        },
      });

      if (error) {
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
        throw new Error(error.message);
      }

      console.log('Registration successful for:', email);
      toast({
        title: t('success'),
        description: t('registerSuccess'),
      });

      // The profile will be created automatically by the trigger we set up
      // and the user will be set by the auth state change listener
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: t('error'),
          description: t('logoutError'),
          variant: 'destructive',
        });
      } else {
        console.log('Logout successful');
        toast({
          title: t('success'),
          description: t('logoutSuccess'),
        });
      }
      setUser(null);
    } catch (error) {
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