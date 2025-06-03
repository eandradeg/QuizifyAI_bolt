
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
