import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface GoogleClassroomToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at: string;
  scope: string;
  created_at: string;
  updated_at: string;
}

export interface GoogleClassroomCourse {
  id: string;
  student_id: string;
  name: string;
  section?: string;
  description_heading?: string;
  description?: string;
  room?: string;
  owner_id: string;
  creation_time?: string;
  update_time?: string;
  enrollment_code?: string;
  course_state?: string;
  alternate_link?: string;
  teacher_group_email?: string;
  course_group_email?: string;
  teacher_folder_id?: string;
  teacher_folder_title?: string;
  guardians_enabled?: boolean;
  calendar_id?: string;
  synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GoogleClassroomCoursework {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  materials?: Json;
  state?: string;
  alternate_link?: string;
  creation_time?: string;
  update_time?: string;
  due_date?: string;
  due_time?: string;
  scheduled_time?: string;
  max_points?: number;
  work_type?: string;
  submission_modification_mode?: string;
  assignment_submission?: Json;
  multiple_choice_question?: Json;
  synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GoogleClassroomSubmission {
  id: string;
  coursework_id: string;
  student_id: string;
  creation_time?: string;
  update_time?: string;
  state?: string;
  late?: boolean;
  draft_grade?: number;
  assigned_grade?: number;
  alternate_link?: string;
  course_work_type?: string;
  associated_with_developer?: boolean;
  submission_history?: Json;
  assignment_submission?: Json;
  short_answer_submission?: Json;
  multiple_choice_submission?: Json;
  synced_at?: string;
  created_at: string;
  updated_at: string;
}

// Extended interface for submissions with joined data
export interface GoogleClassroomSubmissionWithDetails extends GoogleClassroomSubmission {
  coursework?: {
    title: string;
    due_date?: string;
    max_points?: number;
    course_id: string;
  };
  course?: {
    course?: {
      name: string;
      section?: string;
    };
  };
}

// Extended interface for coursework with course details
export interface GoogleClassroomCourseworkWithCourse extends GoogleClassroomCoursework {
  course?: {
    name: string;
    section?: string;
  };
}

export const googleClassroomService = {
  // Token management
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

  // Course management
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

  // Coursework management
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

  // Submission management
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

  // Sync logging
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
