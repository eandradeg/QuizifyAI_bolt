
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ExternalLink, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle 
} from 'lucide-react';
import { googleClassroomService } from '@/services/googleClassroomService';
import { useToast } from '@/hooks/use-toast';
import type { 
  GoogleClassroomCourse, 
  GoogleClassroomCourseworkWithCourse, 
  GoogleClassroomSubmissionWithDetails 
} from '@/services/googleClassroomService';

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

  const getSubmissionStatusBadge = (submission: GoogleClassroomSubmissionWithDetails) => {
    const state = submission.state?.toLowerCase();
    
    switch (state) {
      case 'turned_in':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Entregado</Badge>;
      case 'returned':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Devuelto</Badge>;
      case 'new':
      case 'created':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Pendiente</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Desconocido</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          {courses.length === 0 ? (
            <p className="text-muted-foreground">No se encontraron clases.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{course.name}</h4>
                    {course.section && (
                      <p className="text-sm text-muted-foreground">{course.section}</p>
                    )}
                    {course.room && (
                      <p className="text-xs text-muted-foreground">Aula: {course.room}</p>
                    )}
                    {course.alternate_link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 p-0 h-auto"
                        onClick={() => window.open(course.alternate_link, '_blank')}
                      >
                        Ver en Classroom <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
          {upcomingWork.length === 0 ? (
            <p className="text-muted-foreground">No hay tareas próximas.</p>
          ) : (
            <div className="space-y-4">
              {upcomingWork.map((work) => (
                <div key={work.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{work.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {work.course?.name} {work.course?.section && `(${work.course.section})`}
                    </p>
                    {work.description && (
                      <p className="text-sm mt-1 line-clamp-2">{work.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {work.due_date && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(work.due_date)}
                        </div>
                      )}
                      {work.max_points && (
                        <span>{work.max_points} puntos</span>
                      )}
                    </div>
                  </div>
                  {work.alternate_link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(work.alternate_link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
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
          {submissions.length === 0 ? (
            <p className="text-muted-foreground">No hay entregas registradas.</p>
          ) : (
            <div className="space-y-4">
              {submissions.slice(0, 10).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{submission.coursework?.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {submission.course?.course?.name}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      {getSubmissionStatusBadge(submission)}
                      {submission.assigned_grade && (
                        <span className="text-sm font-medium">
                          {submission.assigned_grade}/{submission.coursework?.max_points || '?'} puntos
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(submission.update_time)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleClassroomIntegration;
