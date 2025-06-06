import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  Plus, 
  Settings,
  Mail,
  MoreVertical,
  ClipboardList
} from 'lucide-react';

interface ClassroomDetailsProps {
  classId: string;
}

const ClassroomDetails: React.FC<ClassroomDetailsProps> = ({ classId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - esto se reemplazará con datos reales de la API
  const classData = {
    id: classId,
    name: 'Matemáticas 8º A',
    subject: 'Matemáticas',
    grade: '8º Grado',
    section: 'A',
    description: 'Curso de álgebra y geometría básica para estudiantes de octavo grado.',
    teacher: {
      name: 'María González',
      email: 'maria.gonzalez@school.edu',
      avatar: null
    },
    schedule: 'Lunes, Miércoles, Viernes - 09:00-10:30',
    students: [
      { id: '1', name: 'Ana Martínez', email: 'ana@student.com', lastActive: '2024-01-14' },
      { id: '2', name: 'Carlos López', email: 'carlos@student.com', lastActive: '2024-01-14' },
      { id: '3', name: 'Sofia Rodriguez', email: 'sofia@student.com', lastActive: '2024-01-13' },
      { id: '4', name: 'Miguel Torres', email: 'miguel@student.com', lastActive: '2024-01-14' }
    ],
    assignments: [
      { 
        id: '1', 
        title: 'Ecuaciones de primer grado', 
        dueDate: '2024-01-20', 
        status: 'active',
        submitted: 18,
        total: 24
      },
      { 
        id: '2', 
        title: 'Geometría: Áreas y perímetros', 
        dueDate: '2024-01-25', 
        status: 'draft',
        submitted: 0,
        total: 24
      }
    ],
    announcements: [
      {
        id: '1',
        title: 'Examen próximo viernes',
        content: 'Recuerden estudiar los temas vistos en las últimas 3 clases.',
        date: '2024-01-14'
      },
      {
        id: '2',
        title: 'Material requerido',
        content: 'Para la próxima clase necesitarán calculadora científica.',
        date: '2024-01-13'
      }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{classData.name}</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {classData.subject} • {classData.grade} • Sección {classData.section}
            </p>
            <p className="text-sm text-gray-500 mt-2">{classData.description}</p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
        
        <div className="flex items-center space-x-6 mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{classData.students.length} estudiantes</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{classData.schedule}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="assignments">Tareas</TabsTrigger>
            <TabsTrigger value="announcements">Anuncios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Tareas Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {classData.assignments.slice(0, 2).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">{assignment.title}</p>
                        <p className="text-xs text-gray-500">
                          Vence: {new Date(assignment.dueDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                        {assignment.submitted}/{assignment.total}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm">3 estudiantes entregaron tareas hoy</p>
                    <p className="text-sm">Nueva tarea creada ayer</p>
                    <p className="text-sm">2 estudiantes se unieron esta semana</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Estudiantes ({classData.students.length})</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Invitar Estudiante
              </Button>
            </div>
            
            <div className="space-y-2">
              {classData.students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      Activo: {new Date(student.lastActive).toLocaleDateString('es-ES')}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Tareas</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </Button>
            </div>
            
            <div className="space-y-3">
              {classData.assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">
                          Vence: {new Date(assignment.dueDate).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                          {assignment.status === 'active' ? 'Activa' : 'Borrador'}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          {assignment.submitted}/{assignment.total} entregadas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Anuncios</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Anuncio
              </Button>
            </div>
            
            <div className="space-y-3">
              {classData.announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{announcement.title}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {announcement.content}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 ml-4">
                        {new Date(announcement.date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClassroomDetails;
