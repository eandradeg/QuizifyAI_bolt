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

  async signInWithGoogle() {
    console.log('Attempting Google sign-in');
    
    // Get the current URL and construct the redirect URL properly for Bolt environment
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('?')[0].replace(/\/$/, '');
    const redirectUrl = `${baseUrl}/dashboard`;
    
    console.log('Current URL:', currentUrl);
    console.log('Redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google sign-in error:', error);
      throw new Error(error.message);
    }

    console.log('Google sign-in initiated');
    return data;
  },

  async signUpWithGoogle(role: UserRole) {
    console.log('Attempting Google sign-up with role:', role);
    
    // Get the current URL and construct the redirect URL properly for Bolt environment
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('?')[0].replace(/\/$/, '');
    const redirectUrl = `${baseUrl}/dashboard`;
    
    console.log('Current URL:', currentUrl);
    console.log('Redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        // Store the role in the state to use after redirect
        scopes: 'email profile',
      },
    });

    if (error) {
      console.error('Google sign-up error:', error);
      throw new Error(error.message);
    }

    // Store the role in localStorage to use after redirect
    localStorage.setItem('pendingGoogleRole', role);
    console.log('Google sign-up initiated with role stored:', role);
    return data;
  },

  async signUp(email: string, password: string, name: string, role: UserRole) {
    console.log('Attempting registration for:', email, 'with role:', role);
    
    // Get the current URL and construct the redirect URL properly for Bolt environment
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('?')[0].replace(/\/$/, '');
    const redirectUrl = `${baseUrl}/dashboard`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          role: role,
        },
        emailRedirectTo: redirectUrl,
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

  async updateUserProfile(userId: string, displayName: string, role: UserRole) {
    try {
      console.log('Updating user profile for:', userId, 'with name:', displayName, 'and role:', role);
      
      // Get current user email from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error('No user email found');
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: user.email,
          display_name: displayName,
          role: role,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      throw error;
    }
  },

  async fetchUserProfile(supabaseUser: SupabaseUser, retries = 3): Promise<User | null> {
    try {
      console.log('Fetching profile for user:', supabaseUser.id);
      
      // Check if this is a new Google user without a profile
      const pendingRole = localStorage.getItem('pendingGoogleRole');
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist and we have a pending Google role, create it
        if (error.code === 'PGRST116' && pendingRole && supabaseUser.user_metadata?.full_name) {
          console.log('Creating profile for new Google user');
          try {
            await this.updateUserProfile(
              supabaseUser.id, 
              supabaseUser.user_metadata.full_name, 
              pendingRole as UserRole
            );
            localStorage.removeItem('pendingGoogleRole');
            
            // Fetch the newly created profile
            const { data: newProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();
            
            if (fetchError) {
              console.error('Error fetching newly created profile:', fetchError);
              throw fetchError;
            }
            
            if (newProfile) {
              return {
                id: newProfile.id,
                email: newProfile.email,
                role: newProfile.role as UserRole,
                name: newProfile.display_name,
                avatar: newProfile.avatar_url || undefined,
              };
            }
          } catch (createError) {
            console.error('Error creating Google user profile:', createError);
          }
        }
        
        // If profile doesn't exist and we have retries left, wait and try again
        if (error.code === 'PGRST116' && retries > 0) {
          console.log(`Profile not found, retrying... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.fetchUserProfile(supabaseUser, retries - 1);
      }
      throw error;
    }
  }
};