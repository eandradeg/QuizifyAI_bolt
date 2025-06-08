
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  TrendingUp,
  RefreshCw 
} from 'lucide-react';
import { googleClassroomService } from '@/services/googleClassroom';
import { useToast } from '@/hooks/use-toast';
import type { 
  GoogleClassroomCourse, 
  GoogleClassroomCourseworkWithCourse, 
  GoogleClassroomSubmissionWithDetails 
} from '@/services/googleClassroom';

interface ChildGoogleClassroomViewProps {
  childId: string;
  childName: string;
}

const ChildGoogleClassroomView: React.FC<ChildGoogleClassroomViewProps> = ({ 
  childId, 
  childName 
}) => {
  const [courses, setCourses] = useState<GoogleClassroomCourse[]>([]);
  const [upcomingWork, setUpcomingWork] = useState<GoogleClassroomCourseworkWithCourse[]>([]);
  const [submissions, setSubmissions] = useState<GoogleClassroomSubmissionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadChildClassroomData();
  }, [childId]);

  const loadChildClassroomData = async () => {
    try {
      setIsLoading(true);
      
      // Verificar si el hijo tiene token de Google Classroom
      const token = await googleClassroomService.getToken(childId);
      setHasToken(!!token);
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Cargar datos del estudiante
      const [coursesData, upcomingData, submissionsData] = await Promise.all([
        googleClassroomService.getCoursesByStudent(childId),
        googleClassroomService.getUpcomingCoursework(childId),
        googleClassroomService.getSubmissionsByStudent(childId)
      ]);

      setCourses(coursesData);
      setUpcomingWork(upcomingData);
      setSubmissions(submissionsData);

    } catch (error) {
      console.error('Error loading child classroom data:', error);
      toast({
        title: 'Error',
        description: `No se pudieron cargar los datos de Google Classroom para ${childName}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSubmissionStats = () => {
    const completed = submissions.filter(s => s.state === 'TURNED_IN' || s.state === 'RETURNED').length;
    const pending = submissions.filter(s => s.state === 'NEW' || s.state === 'CREATED').length;
    const graded = submissions.filter(s => s.assigned_grade !== null).length;
    
    return { completed, pending, graded, total: submissions.length };
  };

  const getAverageGrade = () => {
    const gradedSubmissions = submissions.filter(s => s.assigned_grade !== null && s.coursework?.max_points);
    if (gradedSubmissions.length === 0) return null;
    
    const totalPercentage = gradedSubmissions.reduce((acc, submission) => {
      if (submission.assigned_grade && submission.coursework?.max_points) {
        return acc + (submission.assigned_grade / submission.coursework.max_points) * 100;
      }
      return acc;
    }, 0);
    
    return Math.round(totalPercentage / gradedSubmissions.length);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Cargando datos de {childName}...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{childName}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {childName} no ha vinculado su cuenta de Google Classroom.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const stats = getSubmissionStats();
  const averageGrade = getAverageGrade();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{childName}</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadChildClassroomData}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <BookOpen className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-xl font-bold text-blue-600">{courses.length}</p>
            <p className="text-xs text-blue-600">Clases</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <p className="text-xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-green-600">Entregadas</p>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Clock className="w-5 h-5 mx-auto mb-1 text-orange-600" />
            <p className="text-xl font-bold text-orange-600">{stats.pending}</p>
            <p className="text-xs text-orange-600">Pendientes</p>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <p className="text-xl font-bold text-purple-600">
              {averageGrade ? `${averageGrade}%` : 'N/A'}
            </p>
            <p className="text-xs text-purple-600">Promedio</p>
          </div>
        </div>

        {/* Próximas Tareas */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Próximas Tareas ({upcomingWork.length})
          </h4>
          {upcomingWork.length > 0 ? (
            <div className="space-y-2">
              {upcomingWork.slice(0, 3).map((work) => (
                <div key={work.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{work.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {work.course?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    {work.due_date && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(work.due_date).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                    {work.max_points && (
                      <p className="text-xs font-medium">{work.max_points} pts</p>
                    )}
                  </div>
                </div>
              ))}
              {upcomingWork.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{upcomingWork.length - 3} tareas más
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay tareas próximas</p>
          )}
        </div>

        {/* Entregas Recientes */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Entregas Recientes
          </h4>
          {submissions.length > 0 ? (
            <div className="space-y-2">
              {submissions.slice(0, 3).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {submission.coursework?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {submission.course?.course?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {submission.assigned_grade && submission.coursework?.max_points && (
                      <span className="text-sm font-medium">
                        {submission.assigned_grade}/{submission.coursework.max_points}
                      </span>
                    )}
                    <Badge 
                      variant={submission.state === 'TURNED_IN' ? 'default' : 
                               submission.state === 'RETURNED' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {submission.state === 'TURNED_IN' ? 'Entregado' :
                       submission.state === 'RETURNED' ? 'Calificado' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay entregas registradas</p>
          )}
        </div>

        {/* Clases Actuales */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clases Actuales ({courses.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {courses.map((course) => (
              <Badge key={course.id} variant="outline" className="text-xs">
                {course.name}
                {course.section && ` (${course.section})`}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildGoogleClassroomView;
