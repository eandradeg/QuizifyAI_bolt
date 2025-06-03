
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { authService } from '@/services/authService';
import type { User } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const userProfile = await authService.fetchUserProfile(supabaseUser);
      setUser(userProfile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Don't throw here to avoid breaking the auth flow
    }
  };

  return { user, setUser, isLoading, setIsLoading };
};
