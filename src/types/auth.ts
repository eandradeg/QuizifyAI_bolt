
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'parent' | 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  avatar_url?: string;
}

// Quiz related types
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  creator_id: string;
  content: QuizQuestion[];
  is_shared?: boolean;
  share_link?: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_questions: number;
  answers: Record<string, number>;
  completed_at: string;
}

// Homework review types
export interface HomeworkReview {
  id: string;
  student_id: string;
  title: string;
  content: string;
  context_documents?: string[];
  ai_feedback?: any;
  grade?: string;
  teacher_feedback?: string;
  created_at: string;
  updated_at: string;
}

// Parent-student relation types
export interface ParentStudentRelation {
  id: string;
  parent_id: string;
  student_id: string;
  created_at: string;
}

// Message types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject?: string;
  content: string;
  read_at?: string;
  created_at: string;
}

// Calendar event types
export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  event_type: 'quiz' | 'homework' | 'exam' | 'reminder' | 'other';
  start_date: string;
  end_date?: string;
  is_completed: boolean;
  created_at: string;
}
