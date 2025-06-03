
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';

const Quiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al Dashboard</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quizzes
              </h1>
            </div>
            {user?.role === 'teacher' && (
              <Button 
                onClick={() => navigate('/quiz-creator')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Crear Quiz</span>
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for quiz cards */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Quiz de Matemáticas</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">10 preguntas sobre álgebra básica</p>
              <Button className="w-full">Comenzar Quiz</Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Quiz de Historia</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">15 preguntas sobre la Revolución Francesa</p>
              <Button className="w-full">Comenzar Quiz</Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Quiz;
