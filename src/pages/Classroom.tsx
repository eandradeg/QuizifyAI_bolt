
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Layout/Header';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import ClassroomList from '@/components/Classroom/ClassroomList';
import ClassroomDetails from '@/components/Classroom/ClassroomDetails';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Plus, Settings } from 'lucide-react';

const Classroom = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'classes' | 'students' | 'assignments'>('classes');

  if (user?.role !== 'teacher') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <div className="flex items-center justify-center min-h-screen">
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Solo los profesores pueden acceder a Google Classroom.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Google Classroom
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Gestiona tus clases, estudiantes y asignaciones
                </p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Clase
              </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('classes')}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'classes'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Mis Clases
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'students'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Estudiantes
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'assignments'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Tareas
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'classes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ClassroomList 
                  onSelectClass={setSelectedClassId}
                  selectedClassId={selectedClassId}
                />
              </div>
              <div className="lg:col-span-2">
                {selectedClassId ? (
                  <ClassroomDetails classId={selectedClassId} />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Selecciona una clase
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Elige una clase de la lista para ver sus detalles y gestionar estudiantes.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <Card>
              <CardHeader>
                <CardTitle>Todos los Estudiantes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Aquí se mostrará la lista de todos los estudiantes de tus clases.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'assignments' && (
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Aquí podrás crear y gestionar tareas para tus clases.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Classroom;
