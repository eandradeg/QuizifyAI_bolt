
import { supabase } from '@/integrations/supabase/client';
import type { CalendarEvent } from '@/types/auth';

export const calendarService = {
  async createEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        ...event,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getEvents() {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async markEventComplete(id: string, completed: boolean = true) {
    const { data, error } = await supabase
      .from('calendar_events')
      .update({ is_completed: completed })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
