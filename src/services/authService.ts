
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User, UserRole, UserProfile } from '@/types/auth';

export const authService = {
  async signIn(email: string, password: string) {
    console.log('Attempting login for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }

    console.log('Login successful for:', email);
    return data;
  },

  async signUp(email: string, password: string, name: string, role: UserRole) {
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
      throw new Error(error.message);
    }

    console.log('Registration successful for:', email);
    return data;
  },

  async signOut() {
    console.log('Attempting logout');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw new Error(error.message);
    }
    console.log('Logout successful');
  },

  async fetchUserProfile(supabaseUser: SupabaseUser, retries = 3): Promise<User | null> {
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
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.fetchUserProfile(supabaseUser, retries - 1);
        }
        
        throw new Error('Failed to fetch user profile');
      }

      if (profile) {
        console.log('Profile found:', profile);
        return {
          id: profile.id,
          email: profile.email,
          role: profile.role as UserRole,
          name: profile.display_name,
          avatar: profile.avatar_url || undefined,
        };
      }

      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.fetchUserProfile(supabaseUser, retries - 1);
      }
      throw error;
    }
  }
};
