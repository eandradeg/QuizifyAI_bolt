
import { supabase } from '@/integrations/supabase/client';
import type { GoogleClassroomCoursework, GoogleClassroomCourseworkWithCourse } from './types';

export const courseworkService = {
  async saveCoursework(coursework: Omit<GoogleClassroomCoursework, 'created_at' | 'updated_at'>[]) {
    const { data, error } = await supabase
      .from('google_classroom_coursework')
      .upsert(coursework, {
        onConflict: 'id'
      })
      .select();

    if (error) throw new Error(error.message);
    return data;
  },

  async getCourseworkByCourse(courseId: string) {
    const { data, error } = await supabase
      .from('google_classroom_coursework')
      .select('*')
      .eq('course_id', courseId)
      .order('due_date', { nullsFirst: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getUpcomingCoursework(studentId?: string, daysAhead: number = 7): Promise<GoogleClassroomCourseworkWithCourse[]> {
    const { data: { user } } = await supabase.auth.getUser();
    const targetStudentId = studentId || user?.id;
    if (!targetStudentId) throw new Error('User not authenticated');

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    const { data, error } = await supabase
      .from('google_classroom_coursework')
      .select(`
        *,
        course:google_classroom_courses!inner(name, section)
      `)
      .eq('google_classroom_courses.student_id', targetStudentId)
      .gte('due_date', today.toISOString().split('T')[0])
      .lte('due_date', futureDate.toISOString().split('T')[0])
      .order('due_date');

    if (error) throw new Error(error.message);
    return (data || []) as GoogleClassroomCourseworkWithCourse[];
  },
};
