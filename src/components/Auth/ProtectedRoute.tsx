import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/' 
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!isLoading) {
      if (requireAuth && !user) {
        console.log('User not authenticated, redirecting to:', redirectTo);
        // Use setTimeout to avoid DOM manipulation conflicts
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 0);
      } else if (!requireAuth && user) {
        console.log('User already authenticated, redirecting to dashboard');
        // Use setTimeout to avoid DOM manipulation conflicts
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 0);
      }
    }
  }, [user, isLoading, navigate, requireAuth, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // For pages that don't require auth (like login), show content if user is not authenticated
  if (!requireAuth && !user) {
    return <>{children}</>;
  }

  // For pages that require auth, show content if user is authenticated
  if (requireAuth && user) {
    return <>{children}</>;
  }

  // Don't render anything while redirecting
  return null;
};

export default ProtectedRoute;