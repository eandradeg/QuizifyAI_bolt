
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import ParentStudentManager from '@/components/ParentStudent/ParentStudentManager';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

const ParentStudentManagerPage = () => {
  const { user } = useAuth();

  // Verificar que el usuario sea un padre
  if (user && user.role !== 'parent') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ParentStudentManager />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ParentStudentManagerPage;
