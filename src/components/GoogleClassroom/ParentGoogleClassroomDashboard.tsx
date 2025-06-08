
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  AlertCircle,
  CalendarDays
} from 'lucide-react';
import { useParentClassroomData } from '@/hooks/useParentClassroomData';
import ChildGoogleClassroomView from './ChildGoogleClassroomView';

const ParentGoogleClassroomDashboard: React.FC = () => {
  const { 
    children, 
    childrenClassroomData, 
    isLoading, 
    error, 
    refreshData, 
    overallStats 
  } = useParentClassroomData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Cargando información de Google Classroom...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar los datos: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (children.length === 0) {
    return (
      <Alert>
        <Users className="h-4 w-4" />
        <AlertDescription>
          No tienes hijos registrados. Utiliza el sistema de códigos de vinculación para conectar con tus hijos.
        </AlertDescription>
      </Alert>
    );
  }

  const upcomingDeadlines = childrenClassroomData.flatMap(child => 
    child.upcomingWork.slice(0, 2).map(work => ({
      ...work,
      childName: child.childName
    }))
  ).sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  }).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Resumen de Google Classroom
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar Todo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">
                {overallStats.childrenWithClassroom}/{overallStats.totalChildren}
              </p>
              <p className="text-sm text-blue-600">Hijos Conectados</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{overallStats.totalCourses}</p>
              <p className="text-sm text-purple-600">Total Clases</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{overallStats.totalCompleted}</p>
              <p className="text-sm text-green-600">Entregadas</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">{overallStats.totalPending}</p>
              <p className="text-sm text-orange-600">Pendientes</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold text-yellow-600">
                {overallStats.overallAverage ? `${overallStats.overallAverage}%` : 'N/A'}
              </p>
              <p className="text-sm text-yellow-600">Promedio General</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximas Fechas Importantes */}
      {upcomingDeadlines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Próximas Fechas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div 
                  key={`${deadline.id}-${index}`} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {deadline.childName} • {deadline.course?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    {deadline.due_date && (
                      <p className="text-sm font-medium">
                        {new Date(deadline.due_date).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </p>
                    )}
                    {deadline.max_points && (
                      <p className="text-xs text-muted-foreground">{deadline.max_points} puntos</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información Detallada por Hijo */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Información Detallada por Hijo</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {childrenClassroomData.map((childData) => (
            <ChildGoogleClassroomView
              key={childData.childId}
              childId={childData.childId}
              childName={childData.childName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentGoogleClassroomDashboard;
