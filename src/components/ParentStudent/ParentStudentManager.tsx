
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  UserPlus, 
  School, 
  Mail, 
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useParentClassroomData } from '@/hooks/useParentClassroomData';
import ParentStudentLinker from './ParentStudentLinker';
import StudentLinkingCodeManager from './StudentLinkingCodeManager';

const ParentStudentManager: React.FC = () => {
  const { 
    children, 
    childrenClassroomData, 
    isLoading, 
    error, 
    refreshData 
  } = useParentClassroomData();
  
  const [activeTab, setActiveTab] = useState('children');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Cargando información de hijos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar los datos: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestionar Hijos</h1>
          <p className="text-muted-foreground">
            Administra las cuentas de tus hijos y sus conexiones con Google Classroom
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshData}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="children">
            <Users className="w-4 h-4 mr-2" />
            Mis Hijos ({children.length})
          </TabsTrigger>
          <TabsTrigger value="link">
            <UserPlus className="w-4 h-4 mr-2" />
            Vincular Hijo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="children" className="space-y-6">
          {children.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">No tienes hijos registrados</h3>
                    <p className="text-muted-foreground">
                      Utiliza la pestaña "Vincular Hijo" para conectar con las cuentas de tus hijos
                    </p>
                  </div>
                  <Button onClick={() => setActiveTab('link')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Vincular Primer Hijo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {children.map((child) => {
                const childData = childrenClassroomData.find(data => data.childId === child.id);
                
                return (
                  <Card key={child.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          {child.display_name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {childData?.hasGoogleClassroom ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <School className="w-3 h-3 mr-1" />
                              Google Classroom
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Sin Google Classroom
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{child.email}</span>
                      </div>

                      {childData?.hasGoogleClassroom && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-lg font-bold text-blue-600">
                              {childData.stats.totalCourses}
                            </p>
                            <p className="text-xs text-blue-600">Clases</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-lg font-bold text-green-600">
                              {childData.stats.completedSubmissions}
                            </p>
                            <p className="text-xs text-green-600">Entregadas</p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <p className="text-lg font-bold text-orange-600">
                              {childData.stats.pendingSubmissions}
                            </p>
                            <p className="text-xs text-orange-600">Pendientes</p>
                          </div>
                        </div>
                      )}

                      {!childData?.hasGoogleClassroom && (
                        <Alert>
                          <School className="h-4 w-4" />
                          <AlertDescription>
                            Este hijo no ha vinculado su cuenta de Google Classroom. 
                            Pídele que conecte su cuenta para ver sus datos académicos.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Mail className="w-3 w-3 mr-1" />
                          Contactar
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <School className="w-3 h-3 mr-1" />
                          Ver Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="link" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Vincular con Código
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Usa el código de vinculación que tu hijo ha generado en su cuenta para conectar sus datos contigo.
                </p>
                <ParentStudentLinker onSuccess={refreshData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Generar Código para Estudiante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Si tu hijo no tiene cuenta aún, puedes generar un código especial para que se registre y se vincule automáticamente contigo.
                </p>
                <StudentLinkingCodeManager />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Instrucciones para Google Classroom</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Registro del Estudiante</p>
                  <p className="text-sm text-muted-foreground">
                    Tu hijo debe registrarse en la plataforma usando su email institucional del colegio
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Vinculación de Cuentas</p>
                  <p className="text-sm text-muted-foreground">
                    Una vez registrado, deberás vincularte usando un código que él genere o que tú generes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Conexión con Google Classroom</p>
                  <p className="text-sm text-muted-foreground">
                    Tu hijo debe conectar su cuenta de Google Classroom desde su perfil para que puedas ver sus datos académicos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentStudentManager;
