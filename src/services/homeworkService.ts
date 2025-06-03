
import { supabase } from '@/integrations/supabase/client';
import type { HomeworkReview } from '@/types/auth';

export const homeworkService = {
  async createHomeworkReview(review: Omit<HomeworkReview, 'id' | 'created_at' | 'updated_at' | 'student_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('homework_reviews')
      .insert({
        ...review,
        student_id: user.id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getHomeworkReviews() {
    const { data, error } = await supabase
      .from('homework_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async getHomeworkReviewById(id: string) {
    const { data, error } = await supabase
      .from('homework_reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateHomeworkReview(id: string, updates: Partial<HomeworkReview>) {
    const { data, error } = await supabase
      .from('homework_reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteHomeworkReview(id: string) {
    const { error } = await supabase
      .from('homework_reviews')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};
