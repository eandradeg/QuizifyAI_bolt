
import { supabase } from '@/integrations/supabase/client';
import type { Quiz, QuizResult } from '@/types/auth';

export const quizService = {
  async createQuiz(quiz: Omit<Quiz, 'id' | 'created_at' | 'updated_at' | 'creator_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        title: quiz.title,
        description: quiz.description,
        content: quiz.content as any, // Type cast to match database Json type
        creator_id: user.id,
        is_shared: quiz.is_shared || false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getQuizzes() {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async getQuizById(id: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateQuiz(id: string, updates: Partial<Quiz>) {
    // Create a copy of updates with proper type casting for content
    const dbUpdates = { ...updates };
    if (dbUpdates.content) {
      (dbUpdates as any).content = dbUpdates.content as any;
    }

    const { data, error } = await supabase
      .from('quizzes')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteQuiz(id: string) {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async submitQuizResult(result: Omit<QuizResult, 'id' | 'completed_at'>) {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert(result)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getQuizResults(quizId?: string) {
    let query = supabase.from('quiz_results').select('*');
    
    if (quizId) {
      query = query.eq('quiz_id', quizId);
    }

    const { data, error } = await query.order('completed_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },
};
