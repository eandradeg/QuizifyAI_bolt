
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { googleClassroomService } from '@/services/googleClassroom';
import type { 
  GoogleClassroomCourse, 
  GoogleClassroomCourseworkWithCourse, 
  GoogleClassroomSubmissionWithDetails 
} from '@/services/googleClassroom';

interface ChildClassroomData {
  childId: string;
  childName: string;
  hasGoogleClassroom: boolean;
  courses: GoogleClassroomCourse[];
  upcomingWork: GoogleClassroomCourseworkWithCourse[];
  submissions: GoogleClassroomSubmissionWithDetails[];
  stats: {
    totalCourses: number;
    completedSubmissions: number;
    pendingSubmissions: number;
    averageGrade: number | null;
  };
}

interface Child {
  id: string;
  display_name: string;
  email: string;
}

export const useParentClassroomData = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [childrenClassroomData, setChildrenClassroomData] = useState<ChildClassroomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParentData();
  }, []);

  const loadParentData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener la información del usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Obtener los hijos del padre actual
      const { data: parentStudentData, error: parentStudentError } = await supabase
        .from('parent_student_relations')
        .select('student_id')
        .eq('parent_id', user.id);

      if (parentStudentError) {
        throw new Error(parentStudentError.message);
      }

      if (!parentStudentData || parentStudentData.length === 0) {
        setChildren([]);
        setChildrenClassroomData([]);
        setIsLoading(false);
        return;
      }

      // Obtener los perfiles de los estudiantes usando los IDs
      const studentIds = parentStudentData.map(relation => relation.student_id);
      const { data: studentsProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .in('id', studentIds);

      if (profilesError) {
        throw new Error(profilesError.message);
      }

      const childrenData: Child[] = studentsProfiles?.map(profile => ({
        id: profile.id,
        display_name: profile.display_name,
        email: profile.email
      })) || [];

      setChildren(childrenData);

      // Cargar datos de Google Classroom para cada hijo
      const classroomDataPromises = childrenData.map(async (child) => {
        try {
          // Verificar si el hijo tiene token de Google Classroom
          const token = await googleClassroomService.getToken(child.id);
          
          if (!token) {
            return {
              childId: child.id,
              childName: child.display_name,
              hasGoogleClassroom: false,
              courses: [],
              upcomingWork: [],
              submissions: [],
              stats: {
                totalCourses: 0,
                completedSubmissions: 0,
                pendingSubmissions: 0,
                averageGrade: null
              }
            };
          }

          // Cargar datos de Google Classroom
          const [courses, upcomingWork, submissions] = await Promise.all([
            googleClassroomService.getCoursesByStudent(child.id),
            googleClassroomService.getUpcomingCoursework(child.id),
            googleClassroomService.getSubmissionsByStudent(child.id)
          ]);

          // Calcular estadísticas
          const completedSubmissions = submissions.filter(s => 
            s.state === 'TURNED_IN' || s.state === 'RETURNED'
          ).length;
          
          const pendingSubmissions = submissions.filter(s => 
            s.state === 'NEW' || s.state === 'CREATED'
          ).length;

          const gradedSubmissions = submissions.filter(s => 
            s.assigned_grade !== null && s.coursework?.max_points
          );
          
          const averageGrade = gradedSubmissions.length > 0 
            ? Math.round(
                gradedSubmissions.reduce((acc, submission) => {
                  if (submission.assigned_grade && submission.coursework?.max_points) {
                    return acc + (submission.assigned_grade / submission.coursework.max_points) * 100;
                  }
                  return acc;
                }, 0) / gradedSubmissions.length
              )
            : null;

          return {
            childId: child.id,
            childName: child.display_name,
            hasGoogleClassroom: true,
            courses,
            upcomingWork,
            submissions,
            stats: {
              totalCourses: courses.length,
              completedSubmissions,
              pendingSubmissions,
              averageGrade
            }
          };
        } catch (error) {
          console.error(`Error loading classroom data for ${child.display_name}:`, error);
          return {
            childId: child.id,
            childName: child.display_name,
            hasGoogleClassroom: false,
            courses: [],
            upcomingWork: [],
            submissions: [],
            stats: {
              totalCourses: 0,
              completedSubmissions: 0,
              pendingSubmissions: 0,
              averageGrade: null
            }
          };
        }
      });

      const classroomData = await Promise.all(classroomDataPromises);
      setChildrenClassroomData(classroomData);

    } catch (error) {
      console.error('Error loading parent data:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshChildData = async (childId: string) => {
    try {
      const childIndex = childrenClassroomData.findIndex(child => child.childId === childId);
      if (childIndex === -1) return;

      const child = children.find(c => c.id === childId);
      if (!child) return;

      // Recargar datos específicos del hijo
      const token = await googleClassroomService.getToken(childId);
      
      if (!token) {
        setChildrenClassroomData(prev => 
          prev.map((data, index) => 
            index === childIndex 
              ? { ...data, hasGoogleClassroom: false, courses: [], upcomingWork: [], submissions: [] }
              : data
          )
        );
        return;
      }

      const [courses, upcomingWork, submissions] = await Promise.all([
        googleClassroomService.getCoursesByStudent(childId),
        googleClassroomService.getUpcomingCoursework(childId),
        googleClassroomService.getSubmissionsByStudent(childId)
      ]);

      // Actualizar datos específicos del hijo
      setChildrenClassroomData(prev => 
        prev.map((data, index) => 
          index === childIndex 
            ? {
                ...data,
                hasGoogleClassroom: true,
                courses,
                upcomingWork,
                submissions,
                stats: {
                  totalCourses: courses.length,
                  completedSubmissions: submissions.filter(s => s.state === 'TURNED_IN' || s.state === 'RETURNED').length,
                  pendingSubmissions: submissions.filter(s => s.state === 'NEW' || s.state === 'CREATED').length,
                  averageGrade: (() => {
                    const graded = submissions.filter(s => s.assigned_grade !== null && s.coursework?.max_points);
                    return graded.length > 0 
                      ? Math.round(graded.reduce((acc, s) => acc + (s.assigned_grade! / s.coursework!.max_points!) * 100, 0) / graded.length)
                      : null;
                  })()
                }
              }
            : data
        )
      );
    } catch (error) {
      console.error('Error refreshing child data:', error);
    }
  };

  const getOverallStats = () => {
    const totalCourses = childrenClassroomData.reduce((acc, child) => acc + child.stats.totalCourses, 0);
    const totalCompleted = childrenClassroomData.reduce((acc, child) => acc + child.stats.completedSubmissions, 0);
    const totalPending = childrenClassroomData.reduce((acc, child) => acc + child.stats.pendingSubmissions, 0);
    
    const childrenWithGrades = childrenClassroomData.filter(child => child.stats.averageGrade !== null);
    const overallAverage = childrenWithGrades.length > 0
      ? Math.round(
          childrenWithGrades.reduce((acc, child) => acc + (child.stats.averageGrade || 0), 0) / childrenWithGrades.length
        )
      : null;

    return {
      totalCourses,
      totalCompleted,
      totalPending,
      overallAverage,
      childrenWithClassroom: childrenClassroomData.filter(child => child.hasGoogleClassroom).length,
      totalChildren: children.length
    };
  };

  return {
    children,
    childrenClassroomData,
    isLoading,
    error,
    refreshData: loadParentData,
    refreshChildData,
    overallStats: getOverallStats()
  };
};
