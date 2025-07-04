import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { authService } from '@/services/authService';
import type { User } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
        } else if (session?.user) {
          console.log('Initial session found for user:', session.user.email);
          await fetchUserProfile(session.user);
        } else {
          console.log('No initial session found');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user.email);
        // For new Google users, add a longer delay to ensure the trigger has time to complete
        const isGoogleUser = session.user.app_metadata?.provider === 'google';
        const delay = isGoogleUser ? 3000 : 1000;
        
        setTimeout(async () => {
          if (mounted) {
            await fetchUserProfile(session.user);
          }
        }, delay);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('Token refreshed for user:', session.user.email);
        if (mounted) {
          await fetchUserProfile(session.user);
        }
      } else {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    });

    const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
      if (!mounted) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching user profile for:', supabaseUser.email);
        const userProfile = await authService.fetchUserProfile(supabaseUser);
        if (userProfile && mounted) {
          console.log('User profile loaded successfully:', userProfile.email);
          setUser(userProfile);
        } else if (mounted) {
          console.log('No user profile found');
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
};