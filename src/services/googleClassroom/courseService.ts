
import { supabase } from '@/integrations/supabase/client';
import type { GoogleClassroomCourse } from './types';

export const courseService = {
  async saveCourses(courses: Omit<GoogleClassroomCourse, 'created_at' | 'updated_at'>[]) {
    const { data, error } = await supabase
      .from('google_classroom_courses')
      .upsert(courses, {
        onConflict: 'id'
      })
      .select();

    if (error) throw new Error(error.message);
    return data;
  },

  async getCoursesByStudent(studentId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetStudentId = studentId || user?.id;
    if (!targetStudentId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('google_classroom_courses')
      .select('*')
      .eq('student_id', targetStudentId)
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },
};
