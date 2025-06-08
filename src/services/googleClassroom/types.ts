
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
