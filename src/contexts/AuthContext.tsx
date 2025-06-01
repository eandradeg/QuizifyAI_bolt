
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'parent' | 'student' | 'teacher';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('quizifyai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - replace with Supabase auth
      const mockUser: User = {
        id: '1',
        email,
        role: email.includes('teacher') ? 'teacher' : email.includes('parent') ? 'parent' : 'student',
        name: email.split('@')[0],
      };
      setUser(mockUser);
      localStorage.setItem('quizifyai_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Error de autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Mock registration - replace with Supabase auth
      const newUser: User = {
        id: Date.now().toString(),
        email,
        role,
        name,
      };
      setUser(newUser);
      localStorage.setItem('quizifyai_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Error en el registro');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quizifyai_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
