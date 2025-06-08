
import { supabase } from '@/integrations/supabase/client';

export const syncService = {
  async createSyncLog(syncType: string, status: string = 'started') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('sync_logs')
      .insert({
        user_id: user.id,
        sync_type: syncType,
        status: status,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateSyncLog(logId: string, updates: { 
    status?: string; 
    records_processed?: number; 
    error_message?: string; 
    completed_at?: string; 
  }) {
    const { data, error } = await supabase
      .from('sync_logs')
      .update({
        ...updates,
        completed_at: updates.status === 'completed' || updates.status === 'failed' 
          ? new Date().toISOString() 
          : undefined,
      })
      .eq('id', logId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getSyncLogs(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('sync_logs')
      .select('*')
      .eq('user_id', targetUserId)
      .order('started_at', { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);
    return data || [];
  },
};
