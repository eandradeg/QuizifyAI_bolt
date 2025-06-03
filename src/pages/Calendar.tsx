
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CalendarView from '@/components/Calendar/CalendarView';
import Header from '@/components/Layout/Header';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

const CalendarPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <CalendarView />
      </div>
    </ProtectedRoute>
  );
};

export default CalendarPage;
