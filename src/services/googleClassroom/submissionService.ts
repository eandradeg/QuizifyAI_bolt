
import { supabase } from '@/integrations/supabase/client';
import type { GoogleClassroomSubmission, GoogleClassroomSubmissionWithDetails } from './types';

export const submissionService = {
  async saveSubmissions(submissions: Omit<GoogleClassroomSubmission, 'created_at' | 'updated_at'>[]) {
    const { data, error } = await supabase
      .from('google_classroom_submissions')
      .upsert(submissions, {
        onConflict: 'id'
      })
      .select();

    if (error) throw new Error(error.message);
    return data;
  },

  async getSubmissionsByStudent(studentId?: string): Promise<GoogleClassroomSubmissionWithDetails[]> {
    const { data: { user } } = await supabase.auth.getUser();
    const targetStudentId = studentId || user?.id;
    if (!targetStudentId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('google_classroom_submissions')
      .select(`
        *,
        coursework:google_classroom_coursework!inner(title, due_date, max_points, course_id),
        course:google_classroom_coursework!inner(course:google_classroom_courses!inner(name, section))
      `)
      .eq('student_id', targetStudentId)
      .order('update_time', { nullsFirst: false });

    if (error) throw new Error(error.message);
    return (data || []) as GoogleClassroomSubmissionWithDetails[];
  },
};
