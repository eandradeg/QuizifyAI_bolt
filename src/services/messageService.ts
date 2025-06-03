
import { supabase } from '@/integrations/supabase/client';
import type { Message } from '@/types/auth';

export const messageService = {
  async sendMessage(message: Omit<Message, 'id' | 'created_at' | 'sender_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...message,
        sender_id: user.id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(display_name),
        receiver:profiles!messages_receiver_id_fkey(display_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async markAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteMessage(id: string) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};
