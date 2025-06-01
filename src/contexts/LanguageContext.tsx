
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en' | 'de';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  dashboard: { es: 'Panel Principal', en: 'Dashboard', de: 'Dashboard' },
  quizzes: { es: 'Quizzes', en: 'Quizzes', de: 'Quiz' },
  tasks: { es: 'Tareas', en: 'Tasks', de: 'Aufgaben' },
  messages: { es: 'Mensajes', en: 'Messages', de: 'Nachrichten' },
  profile: { es: 'Perfil', en: 'Profile', de: 'Profil' },
  logout: { es: 'Cerrar Sesión', en: 'Logout', de: 'Abmelden' },
  
  // Auth
  login: { es: 'Iniciar Sesión', en: 'Login', de: 'Anmelden' },
  register: { es: 'Registrarse', en: 'Register', de: 'Registrieren' },
  email: { es: 'Correo Electrónico', en: 'Email', de: 'E-Mail' },
  password: { es: 'Contraseña', en: 'Password', de: 'Passwort' },
  name: { es: 'Nombre', en: 'Name', de: 'Name' },
  role: { es: 'Rol', en: 'Role', de: 'Rolle' },
  parent: { es: 'Padre/Madre', en: 'Parent', de: 'Elternteil' },
  teacher: { es: 'Docente', en: 'Teacher', de: 'Lehrer' },
  student: { es: 'Estudiante', en: 'Student', de: 'Schüler' },
  
  // Dashboard
  welcome: { es: 'Bienvenido', en: 'Welcome', de: 'Willkommen' },
  createQuiz: { es: 'Crear Quiz', en: 'Create Quiz', de: 'Quiz Erstellen' },
  recentQuizzes: { es: 'Quizzes Recientes', en: 'Recent Quizzes', de: 'Neueste Quiz' },
  progress: { es: 'Progreso', en: 'Progress', de: 'Fortschritt' },
  
  // Quiz Creation
  uploadDocument: { es: 'Subir Documento', en: 'Upload Document', de: 'Dokument Hochladen' },
  enterText: { es: 'Ingresar Texto', en: 'Enter Text', de: 'Text Eingeben' },
  generateQuestions: { es: 'Generar Preguntas', en: 'Generate Questions', de: 'Fragen Generieren' },
  
  // Quiz Taking
  question: { es: 'Pregunta', en: 'Question', de: 'Frage' },
  correct: { es: '¡Correcto!', en: 'Correct!', de: 'Richtig!' },
  incorrect: { es: 'Incorrecto', en: 'Incorrect', de: 'Falsch' },
  nextQuestion: { es: 'Siguiente Pregunta', en: 'Next Question', de: 'Nächste Frage' },
  finish: { es: 'Finalizar', en: 'Finish', de: 'Beenden' },
  
  // Settings
  settings: { es: 'Configuración', en: 'Settings', de: 'Einstellungen' },
  language: { es: 'Idioma', en: 'Language', de: 'Sprache' },
  theme: { es: 'Tema', en: 'Theme', de: 'Thema' },
  light: { es: 'Claro', en: 'Light', de: 'Hell' },
  dark: { es: 'Oscuro', en: 'Dark', de: 'Dunkel' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('quizifyai_language') as Language;
    if (savedLanguage && ['es', 'en', 'de'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('quizifyai_language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
