
import { supabase } from '@/integrations/supabase/client';
import type { ParentStudentRelation } from '@/types/auth';

export const parentStudentService = {
  async createRelation(studentId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('parent_student_relations')
      .insert({
        parent_id: user.id,
        student_id: studentId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getStudentsByParent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('parent_student_relations')
      .select(`
        *,
        student:profiles!parent_student_relations_student_id_fkey(*)
      `)
      .eq('parent_id', user.id);

    if (error) throw new Error(error.message);
    return data;
  },

  async getParentsByStudent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('parent_student_relations')
      .select(`
        *,
        parent:profiles!parent_student_relations_parent_id_fkey(*)
      `)
      .eq('student_id', user.id);

    if (error) throw new Error(error.message);
    return data;
  },

  async removeRelation(relationId: string) {
    const { error } = await supabase
      .from('parent_student_relations')
      .delete()
      .eq('id', relationId);

    if (error) throw new Error(error.message);
  },
};
