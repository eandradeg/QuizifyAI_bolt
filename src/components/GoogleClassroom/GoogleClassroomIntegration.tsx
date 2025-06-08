
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Calendar, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { googleClassroomService } from '@/services/googleClassroom';
import { useToast } from '@/hooks/use-toast';
import CoursesList from './CoursesList';
import UpcomingWork from './UpcomingWork';
import SubmissionsList from './SubmissionsList';
import type { 
  GoogleClassroomCourse, 
  GoogleClassroomCourseworkWithCourse, 
  GoogleClassroomSubmissionWithDetails 
} from '@/services/googleClassroom';

interface GoogleClassroomIntegrationProps {
  studentId?: string;
  isParentView?: boolean;
}

const GoogleClassroomIntegration: React.FC<GoogleClassroomIntegrationProps> = ({ 
  studentId, 
  isParentView = false 
}) => {
  const [courses, setCourses] = useState<GoogleClassroomCourse[]>([]);
  const [upcomingWork, setUpcomingWork] = useState<GoogleClassroomCourseworkWithCourse[]>([]);
  const [submissions, setSubmissions] = useState<GoogleClassroomSubmissionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadGoogleClassroomData();
  }, [studentId]);

  const loadGoogleClassroomData = async () => {
    try {
      setIsLoading(true);
      
      // Check if user has a token
      const token = await googleClassroomService.getToken(studentId);
      setHasToken(!!token);
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Load courses
      const coursesData = await googleClassroomService.getCoursesByStudent(studentId);
      setCourses(coursesData);

      // Load upcoming coursework
      const upcomingData = await googleClassroomService.getUpcomingCoursework(studentId);
      setUpcomingWork(upcomingData);

      // Load submissions
      const submissionsData = await googleClassroomService.getSubmissionsByStudent(studentId);
      setSubmissions(submissionsData);

    } catch (error) {
      console.error('Error loading Google Classroom data:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos de Google Classroom',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Cargando datos de Google Classroom...</span>
        </div>
      </div>
    );
  }

  if (!hasToken) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {isParentView 
            ? 'Este estudiante no ha vinculado su cuenta de Google Classroom.'
            : 'No has vinculado tu cuenta de Google Classroom. Configura la integración para ver tus clases y tareas.'
          }
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Courses Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Clases de Google Classroom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CoursesList courses={courses} />
        </CardContent>
      </Card>

      {/* Upcoming Work */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Próximas Tareas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingWork upcomingWork={upcomingWork} />
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Entregas Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionsList submissions={submissions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleClassroomIntegration;
