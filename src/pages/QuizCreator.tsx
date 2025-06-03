
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import QuizCreator from '@/components/Quiz/QuizCreator';
import Header from '@/components/Layout/Header';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

const QuizCreatorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-teachers to dashboard
  useEffect(() => {
    if (user && user.role !== 'teacher') {
      console.log('User is not a teacher, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user && user.role !== 'teacher') {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="py-8 px-6">
          <QuizCreator />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default QuizCreatorPage;
