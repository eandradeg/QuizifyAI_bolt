
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, TrendingUp, Plus, School, GraduationCap } from 'lucide-react';

const TeacherDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Button 
          className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => navigate('/classroom')}
        >
          <div className="flex flex-col items-center">
            <School className="h-6 w-6 mb-2" />
            <span>Google Classroom</span>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-20"
          onClick={() => navigate('/quiz-creator')}
        >
          <div className="flex flex-col items-center">
            <Plus className="h-6 w-6 mb-2" />
            <span>Crear Quiz</span>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-20"
        >
          <div className="flex flex-col items-center">
            <BookOpen className="h-6 w-6 mb-2" />
            <span>Nueva Tarea</span>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-20"
          onClick={() => navigate('/classroom')}
        >
          <div className="flex flex-col items-center">
            <Users className="h-6 w-6 mb-2" />
            <span>Mis Estudiantes</span>
          </div>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">En todas las clases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clases Activas</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Este semestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Creados</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Este semestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participación</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Promedio de clase</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Mis Clases</CardTitle>
            <Button size="sm" onClick={() => navigate('/classroom')}>
              <School className="h-4 w-4 mr-2" />
              Ver Todas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Matemáticas 8º A</p>
                  <p className="text-sm text-gray-500">24 estudiantes</p>
                </div>
                <span className="text-sm text-green-600">Activa</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Historia Universal</p>
                  <p className="text-sm text-gray-500">18 estudiantes</p>
                </div>
                <span className="text-sm text-green-600">Activa</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Ciencias Naturales</p>
                  <p className="text-sm text-gray-500">22 estudiantes</p>
                </div>
                <span className="text-sm text-green-600">Activa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Quizzes Recientes</CardTitle>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              {t('createQuiz')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Revolución Francesa</p>
                  <p className="text-sm text-gray-500">Historia - 15 preguntas</p>
                </div>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Ecuaciones Cuadráticas</p>
                  <p className="text-sm text-gray-500">Matemáticas - 12 preguntas</p>
                </div>
                <span className="text-sm text-blue-600">Draft</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
