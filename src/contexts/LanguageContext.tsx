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

  // Toast messages - Authentication
  loginSuccess: { es: 'Sesión iniciada correctamente', en: 'Login successful', de: 'Anmeldung erfolgreich' },
  loginError: { es: 'Error al iniciar sesión', en: 'Login error', de: 'Anmeldefehler' },
  registerSuccess: { es: 'Registro exitoso. Revisa tu correo para verificar tu cuenta', en: 'Registration successful. Check your email to verify your account', de: 'Registrierung erfolgreich. Überprüfen Sie Ihre E-Mail zur Kontobestätigung' },
  registerError: { es: 'Error en el registro', en: 'Registration error', de: 'Registrierungsfehler' },
  logoutSuccess: { es: 'Sesión cerrada correctamente', en: 'Logout successful', de: 'Abmeldung erfolgreich' },
  logoutError: { es: 'Error al cerrar sesión', en: 'Logout error', de: 'Abmeldefehler' },
  invalidCredentials: { es: 'Credenciales inválidas', en: 'Invalid credentials', de: 'Ungültige Anmeldeinformationen' },
  userAlreadyExists: { es: 'El usuario ya existe', en: 'User already exists', de: 'Benutzer existiert bereits' },
  
  // Google Auth
  continueWithGoogle: { es: 'Continuar con Google', en: 'Continue with Google', de: 'Mit Google fortfahren' },
  googleLoginError: { es: 'Error al iniciar sesión con Google', en: 'Error signing in with Google', de: 'Fehler bei der Anmeldung mit Google' },
  orContinueWith: { es: 'O continúa con', en: 'Or continue with', de: 'Oder fortfahren mit' },
  
  // Toast messages - General
  loading: { es: 'Cargando...', en: 'Loading...', de: 'Laden...' },
  success: { es: 'Éxito', en: 'Success', de: 'Erfolg' },
  error: { es: 'Error', en: 'Error', de: 'Fehler' },
  saveSuccess: { es: 'Guardado correctamente', en: 'Saved successfully', de: 'Erfolgreich gespeichert' },
  saveError: { es: 'Error al guardar', en: 'Error saving', de: 'Fehler beim Speichern' },
  deleteSuccess: { es: 'Eliminado correctamente', en: 'Deleted successfully', de: 'Erfolgreich gelöscht' },
  deleteError: { es: 'Error al eliminar', en: 'Error deleting', de: 'Fehler beim Löschen' },
  updateSuccess: { es: 'Actualizado correctamente', en: 'Updated successfully', de: 'Erfolgreich aktualisiert' },
  updateError: { es: 'Error al actualizar', en: 'Error updating', de: 'Fehler beim Aktualisieren' },
  connectionError: { es: 'Error de conexión', en: 'Connection error', de: 'Verbindungsfehler' },
  
  // Form validation
  requiredField: { es: 'Este campo es requerido', en: 'This field is required', de: 'Dieses Feld ist erforderlich' },
  invalidEmail: { es: 'Email inválido', en: 'Invalid email', de: 'Ungültige E-Mail' },
  passwordTooShort: { es: 'La contraseña debe tener al menos 6 caracteres', en: 'Password must be at least 6 characters', de: 'Passwort muss mindestens 6 Zeichen haben' },
  
  // UI Labels
  noAccount: { es: '¿No tienes cuenta?', en: "Don't have an account?", de: 'Kein Konto?' },
  hasAccount: { es: '¿Ya tienes cuenta?', en: 'Already have an account?', de: 'Haben Sie bereits ein Konto?' },
  confirmEmail: { es: 'Confirma tu email para completar el registro', en: 'Confirm your email to complete registration', de: 'Bestätigen Sie Ihre E-Mail, um die Registrierung abzuschließen' },
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
