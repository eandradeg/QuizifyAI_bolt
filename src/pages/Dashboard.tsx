
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Layout/Header';
import ParentDashboard from '@/components/Dashboard/ParentDashboard';
import TeacherDashboard from '@/components/Dashboard/TeacherDashboard';
import StudentDashboard from '@/components/Dashboard/StudentDashboard';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, MessageSquare, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'parent':
        return <ParentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div>Dashboard no encontrado</div>;
    }
  };

  const getNavItems = () => {
    const commonItems = [
      { icon: BookOpen, label: t('quizzes'), action: () => navigate('/quiz') },
      { icon: MessageSquare, label: t('messages'), action: () => console.log('Navigate to messages') },
      { icon: Settings, label: t('settings'), action: () => console.log('Navigate to settings') },
    ];

    if (user?.role === 'parent') {
      return [
        { icon: Users, label: 'Mis Hijos', action: () => console.log('Navigate to children') },
        ...commonItems,
      ];
    }

    if (user?.role === 'teacher') {
      return [
        { icon: Users, label: 'Mis Clases', action: () => console.log('Navigate to classes') },
        ...commonItems,
      ];
    }

    return commonItems;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('dashboard')}
            </h2>
            <nav className="space-y-2">
              {getNavItems().map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={item.action}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('welcome')}, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Panel de control - {t(user?.role || '')}
            </p>
          </div>

          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
