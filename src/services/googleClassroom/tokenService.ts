
import { supabase } from '@/integrations/supabase/client';
import type { GoogleClassroomToken } from './types';

export const tokenService = {
  async saveToken(tokenData: Omit<GoogleClassroomToken, 'id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('google_classroom_tokens')
      .upsert({
        ...tokenData,
        user_id: user.id,
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getToken(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('google_classroom_tokens')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  },

  async deleteToken(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    if (!targetUserId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('google_classroom_tokens')
      .delete()
      .eq('user_id', targetUserId);

    if (error) throw new Error(error.message);
  },
};
