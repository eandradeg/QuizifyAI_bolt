
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  FileText, 
  GraduationCap,
  MessageSquare,
  Star,
  Upload,
  Eye,
  Edit
} from 'lucide-react';

interface HomeworkAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  grade?: number;
  maxGrade: number;
  studentName?: string;
  submittedAt?: string;
  feedback?: string;
  attachments?: string[];
}

const HomeworkReview: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');

  // Mock data - esto se reemplazará con datos reales de la API
  const teacherAssignments: HomeworkAssignment[] = [
    {
      id: '1',
      title: 'Ensayo sobre la Revolución Francesa',
      subject: 'Historia',
      dueDate: '2024-01-20',
      status: 'submitted',
      maxGrade: 100,
      studentName: 'María García',
      submittedAt: '2024-01-19'
    },
    {
      id: '2',
      title: 'Problemas de Álgebra - Capítulo 5',
      subject: 'Matemáticas',
      dueDate: '2024-01-22',
      status: 'graded',
      grade: 85,
      maxGrade: 100,
      studentName: 'Carlos López',
      submittedAt: '2024-01-21',
      feedback: 'Buen trabajo en general, revisar el ejercicio 3.'
    },
    {
      id: '3',
      title: 'Experimento de Física - Péndulo',
      subject: 'Física',
      dueDate: '2024-01-18',
      status: 'late',
      maxGrade: 100,
      studentName: 'Ana Martínez',
      submittedAt: '2024-01-20'
    }
  ];

  const parentAssignments: HomeworkAssignment[] = [
    {
      id: '1',
      title: 'Ensayo sobre Ecosistemas',
      subject: 'Ciencias Naturales',
      dueDate: '2024-01-25',
      status: 'pending',
      maxGrade: 100
    },
    {
      id: '2',
      title: 'Análisis de texto - Don Quijote',
      subject: 'Literatura',
      dueDate: '2024-01-20',
      status: 'graded',
      grade: 92,
      maxGrade: 100,
      submittedAt: '2024-01-19',
      feedback: 'Excelente análisis y comprensión del texto. Muy bien desarrollado.'
    },
    {
      id: '3',
      title: 'Ejercicios de Geometría',
      subject: 'Matemáticas',
      dueDate: '2024-01-23',
      status: 'submitted',
      maxGrade: 100,
      submittedAt: '2024-01-22'
    }
  ];

  const assignments = user?.role === 'teacher' ? teacherAssignments : parentAssignments;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'graded': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'late': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'submitted': return 'Entregada';
      case 'graded': return 'Calificada';
      case 'late': return 'Tardía';
      default: return status;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === 'all') return true;
    return assignment.status === activeTab;
  });

  const renderTeacherView = (assignment: HomeworkAssignment) => (
    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium">{assignment.title}</h3>
              <Badge className={getStatusColor(assignment.status)}>
                {getStatusText(assignment.status)}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>Materia: {assignment.subject}</p>
              <p>Estudiante: {assignment.studentName}</p>
              <p>Fecha límite: {new Date(assignment.dueDate).toLocaleDateString('es-ES')}</p>
              {assignment.submittedAt && (
                <p>Entregada: {new Date(assignment.submittedAt).toLocaleDateString('es-ES')}</p>
              )}
            </div>

            {assignment.grade !== undefined && (
              <div className="flex items-center space-x-2 mt-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{assignment.grade}/{assignment.maxGrade}</span>
              </div>
            )}

            {assignment.feedback && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="text-sm">{assignment.feedback}</p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>
            {assignment.status === 'submitted' && (
              <Button size="sm">
                <Edit className="h-3 w-3 mr-1" />
                Calificar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderParentView = (assignment: HomeworkAssignment) => (
    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium">{assignment.title}</h3>
              <Badge className={getStatusColor(assignment.status)}>
                {getStatusText(assignment.status)}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>Materia: {assignment.subject}</p>
              <p>Fecha límite: {new Date(assignment.dueDate).toLocaleDateString('es-ES')}</p>
              {assignment.submittedAt && (
                <p>Entregada: {new Date(assignment.submittedAt).toLocaleDateString('es-ES')}</p>
              )}
            </div>

            {assignment.grade !== undefined && (
              <div className="flex items-center space-x-2 mt-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-lg">{assignment.grade}/{assignment.maxGrade}</span>
                <span className="text-sm text-gray-500">
                  ({Math.round((assignment.grade / assignment.maxGrade) * 100)}%)
                </span>
              </div>
            )}

            {assignment.feedback && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-3 w-3 mt-0.5 text-green-600" />
                  <div>
                    <p className="text-xs font-medium text-green-800 dark:text-green-300">Comentario del profesor:</p>
                    <p className="text-sm">{assignment.feedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              Ver Detalle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.role === 'teacher' ? 'Revisión de Tareas' : 'Tareas de mis Hijos'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'teacher' 
              ? 'Revisa y califica las tareas enviadas por tus estudiantes' 
              : 'Monitorea el progreso y calificaciones de las tareas'
            }
          </p>
        </div>
        {user?.role === 'teacher' && (
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Pendientes</p>
                <p className="text-2xl font-bold">
                  {assignments.filter(a => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Entregadas</p>
                <p className="text-2xl font-bold">
                  {assignments.filter(a => a.status === 'submitted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Calificadas</p>
                <p className="text-2xl font-bold">
                  {assignments.filter(a => a.status === 'graded').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Promedio</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    assignments
                      .filter(a => a.grade !== undefined)
                      .reduce((acc, a) => acc + (a.grade! / a.maxGrade * 100), 0) /
                    assignments.filter(a => a.grade !== undefined).length || 0
                  )}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="submitted">Entregadas</TabsTrigger>
          <TabsTrigger value="graded">Calificadas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredAssignments.length > 0 ? (
            <div className="space-y-4">
              {filteredAssignments.map(assignment => 
                user?.role === 'teacher' 
                  ? renderTeacherView(assignment)
                  : renderParentView(assignment)
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay tareas en esta categoría</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeworkReview;
