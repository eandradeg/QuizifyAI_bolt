import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  GraduationCap, 
  Calendar,
  School,
  ClipboardList,
  Bell,
  ClipboardCheck
} from 'lucide-react';
import ParentGoogleClassroomDashboard from '@/components/GoogleClassroom/ParentGoogleClassroomDashboard';

const ParentDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Mock data para los hijos (mantenemos para la pestaña de resumen)
  const children = [
    {
      id: '1',
      name: 'María Rodríguez',
      grade: '8º Grado',
      school: 'Colegio San José',
      avatar: null,
      progress: 92,
      classes: ['Matemáticas', 'Historia', 'Ciencias'],
      recentActivity: 'Completó Quiz de Matemáticas',
      nextClass: 'Historia - Mañana 09:00',
      pendingHomework: 2,
      gradedHomework: 8
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      grade: '6º Grado',
      school: 'Colegio San José',
      avatar: null,
      progress: 78,
      classes: ['Matemáticas', 'Ciencias Naturales', 'Lengua'],
      recentActivity: 'Entregó tarea de Ciencias',
      nextClass: 'Matemáticas - Hoy 14:00',
      pendingHomework: 1,
      gradedHomework: 5
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Button 
          className="h-20 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          onClick={() => navigate('/homework-review')}
        >
          <div className="flex flex-col items-center">
            <ClipboardCheck className="h-6 w-6 mb-2" />
            <span>Revisar Tareas</span>
          </div>
        </Button>
        <Button 
          className="h-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={() => navigate('/messages')}
        >
          <div className="flex flex-col items-center">
            <MessageSquare className="h-6 w-6 mb-2" />
            <span>Mensajes</span>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-20"
          onClick={() => navigate('/quiz')}
        >
          <div className="flex flex-col items-center">
            <BookOpen className="h-6 w-6 mb-2" />
            <span>Ver Quizzes</span>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-20"
        >
          <div className="flex flex-col items-center">
            <Calendar className="h-6 w-6 mb-2" />
            <span>Calendario</span>
          </div>
        </Button>
      </div>

      {/* Pestañas principales */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="classroom">Google Classroom</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hijos Registrados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{children.length}</div>
                <p className="text-xs text-muted-foreground">Estudiantes activos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {children.reduce((acc, child) => acc + child.pendingHomework, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Por entregar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('progress')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Promedio general</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Sin leer</p>
              </CardContent>
            </Card>
          </div>

          {/* Children Information */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Información de mis Hijos
              </h2>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Gestionar Hijos
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {children.map((child) => (
                <Card key={child.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={child.avatar || ""} />
                        <AvatarFallback>
                          {child.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{child.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {child.grade} • {child.school}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {child.progress}% progreso
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progreso General</span>
                        <span className="text-sm text-gray-500">{child.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${child.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <p className="text-lg font-bold text-orange-600">{child.pendingHomework}</p>
                        <p className="text-xs text-orange-600">Tareas Pendientes</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <p className="text-lg font-bold text-green-600">{child.gradedHomework}</p>
                        <p className="text-xs text-green-600">Tareas Calificadas</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Materias</h4>
                      <div className="flex flex-wrap gap-1">
                        {child.classes.map((className, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {className}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <ClipboardList className="h-3 w-3" />
                        <span>Actividad reciente:</span>
                      </div>
                      <p className="text-sm">{child.recentActivity}</p>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>Próxima clase: {child.nextClass}</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate('/homework-review')}>
                        <ClipboardCheck className="h-3 w-3 mr-1" />
                        Ver Tareas
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contactar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividades Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">María completó tarea de Matemáticas - 95%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Carlos envió tarea de Historia</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Nueva tarea asignada por Prof. González</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Comentario del profesor en Ciencias</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximas Fechas Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded">
                    <div>
                      <p className="text-sm font-medium">Tarea de Matemáticas</p>
                      <p className="text-xs text-gray-500">María - Viernes 15/01</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">Urgente</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <div>
                      <p className="text-sm font-medium">Entrega Proyecto</p>
                      <p className="text-xs text-gray-500">Carlos - Lunes 18/01</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Proyecto</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div>
                      <p className="text-sm font-medium">Reunión de Padres</p>
                      <p className="text-xs text-gray-500">Colegio - Miércoles 20/01</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">Reunión</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="classroom">
          <ParentGoogleClassroomDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;
