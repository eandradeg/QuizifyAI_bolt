
import { supabase } from '@/integrations/supabase/client';

export interface StudentLinkingCode {
  id: string;
  student_id: string;
  code: string;
  email_institucional?: string;
  google_classroom_email?: string;
  is_used: boolean;
  expires_at: string;
  created_at: string;
  used_at?: string;
  used_by?: string;
}

export const studentLinkingService = {
  async generateLinkingCode(studentId: string, emailInstitucional?: string, googleClassroomEmail?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Call the database function to generate a unique code
    const { data: codeData, error: codeError } = await supabase
      .rpc('generate_student_linking_code');

    if (codeError) throw new Error(codeError.message);

    const { data, error } = await supabase
      .from('student_linking_codes')
      .insert({
        student_id: studentId,
        code: codeData,
        email_institucional: emailInstitucional,
        google_classroom_email: googleClassroomEmail,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getLinkingCodesByStudent(studentId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetStudentId = studentId || user?.id;
    if (!targetStudentId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('student_linking_codes')
      .select('*')
      .eq('student_id', targetStudentId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async useCodeToLink(code: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, get the linking code to verify it exists and isn't used
    const { data: linkingCode, error: fetchError } = await supabase
      .from('student_linking_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new Error('Código no válido o ya usado');
      }
      throw new Error(fetchError.message);
    }

    // Create the parent-student relationship
    const { data: relationData, error: relationError } = await supabase
      .from('parent_student_relations')
      .insert({
        parent_id: user.id,
        student_id: linkingCode.student_id,
      })
      .select()
      .single();

    if (relationError) {
      // Check if relationship already exists
      if (relationError.code === '23505') {
        throw new Error('Ya estás vinculado con este estudiante');
      }
      throw new Error(relationError.message);
    }

    // Mark the code as used
    const { error: updateError } = await supabase
      .from('student_linking_codes')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        used_by: user.id,
      })
      .eq('id', linkingCode.id);

    if (updateError) {
      console.error('Error updating linking code:', updateError);
      // Don't throw here as the relationship was already created
    }

    return relationData;
  },

  async getAvailableCodes() {
    const { data, error } = await supabase
      .from('student_linking_codes')
      .select(`
        *,
        student:profiles!student_linking_codes_student_id_fkey(display_name, email)
      `)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async expireLinkingCode(codeId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('student_linking_codes')
      .update({
        expires_at: new Date().toISOString(),
      })
      .eq('id', codeId)
      .eq('student_id', user.id) // Only allow students to expire their own codes
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getUsedCodes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('student_linking_codes')
      .select(`
        *,
        student:profiles!student_linking_codes_student_id_fkey(display_name, email),
        used_by_profile:profiles!student_linking_codes_used_by_fkey(display_name, email)
      `)
      .eq('used_by', user.id)
      .eq('is_used', true)
      .order('used_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },
};
