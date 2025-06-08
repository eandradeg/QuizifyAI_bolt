
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Copy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  EyeOff,
  Calendar,
  User,
  Mail 
} from 'lucide-react';
import { studentLinkingService } from '@/services/studentLinkingService';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import type { StudentLinkingCode } from '@/services/studentLinkingService';

const StudentLinkingCodeManager: React.FC = () => {
  const [codes, setCodes] = useState<StudentLinkingCode[]>([]);
  const [usedCodes, setUsedCodes] = useState<any[]>([]);
  const [showUsedCodes, setShowUsedCodes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailInstitucional, setEmailInstitucional] = useState('');
  const [googleClassroomEmail, setGoogleClassroomEmail] = useState('');
  const { user } = useAuthContext();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.role === 'student') {
      loadLinkingCodes();
    } else if (user?.role === 'parent') {
      loadUsedCodes();
    }
  }, [user]);

  const loadLinkingCodes = async () => {
    try {
      setIsLoading(true);
      const data = await studentLinkingService.getLinkingCodesByStudent();
      setCodes(data);
    } catch (error) {
      console.error('Error loading linking codes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los códigos de vinculación',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsedCodes = async () => {
    try {
      setIsLoading(true);
      const data = await studentLinkingService.getUsedCodes();
      setUsedCodes(data);
    } catch (error) {
      console.error('Error loading used codes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los códigos utilizados',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewCode = async () => {
    if (!user) return;

    try {
      setIsGenerating(true);
      const newCode = await studentLinkingService.generateLinkingCode(
        user.id,
        emailInstitucional || undefined,
        googleClassroomEmail || undefined
      );
      
      setCodes(prev => [newCode, ...prev]);
      setEmailInstitucional('');
      setGoogleClassroomEmail('');
      
      toast({
        title: 'Código generado',
        description: 'Se ha generado un nuevo código de vinculación',
      });
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el código de vinculación',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCodeToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: 'Código copiado',
        description: 'El código se ha copiado al portapapeles',
      });
    } catch (error) {
      console.error('Error copying code:', error);
      toast({
        title: 'Error',
        description: 'No se pudo copiar el código',
        variant: 'destructive',
      });
    }
  };

  const expireCode = async (codeId: string) => {
    try {
      await studentLinkingService.expireLinkingCode(codeId);
      setCodes(prev => prev.map(code => 
        code.id === codeId 
          ? { ...code, expires_at: new Date().toISOString() }
          : code
      ));
      
      toast({
        title: 'Código expirado',
        description: 'El código ha sido marcado como expirado',
      });
    } catch (error) {
      console.error('Error expiring code:', error);
      toast({
        title: 'Error',
        description: 'No se pudo expirar el código',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isCodeExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getCodeStatus = (code: StudentLinkingCode) => {
    if (code.is_used) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Usado</Badge>;
    } else if (isCodeExpired(code.expires_at)) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Expirado</Badge>;
    } else {
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Activo</Badge>;
    }
  };

  if (user?.role === 'student') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generar Código de Vinculación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Genera un código para que tus padres puedan acceder a tu progreso académico. 
                Los códigos expiran automáticamente después de 7 días.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-institucional">Email Institucional (Opcional)</Label>
                <Input
                  id="email-institucional"
                  type="email"
                  value={emailInstitucional}
                  onChange={(e) => setEmailInstitucional(e.target.value)}
                  placeholder="nombre@colegio.edu"
                />
              </div>
              
              <div>
                <Label htmlFor="google-classroom-email">Email de Google Classroom (Opcional)</Label>
                <Input
                  id="google-classroom-email"
                  type="email"
                  value={googleClassroomEmail}
                  onChange={(e) => setGoogleClassroomEmail(e.target.value)}
                  placeholder="nombre@gmail.com"
                />
              </div>
              
              <Button 
                onClick={generateNewCode} 
                disabled={isGenerating}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generando...' : 'Generar Nuevo Código'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Códigos de Vinculación</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Cargando códigos...</p>
            ) : codes.length === 0 ? (
              <p className="text-muted-foreground">No has generado códigos de vinculación.</p>
            ) : (
              <div className="space-y-4">
                {codes.map((code) => (
                  <div key={code.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-bold">{code.code}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCodeToClipboard(code.code)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      {getCodeStatus(code)}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>Creado: {formatDate(code.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>Expira: {formatDate(code.expires_at)}</span>
                      </div>
                      {code.email_institucional && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>Email institucional: {code.email_institucional}</span>
                        </div>
                      )}
                      {code.google_classroom_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>Email Google Classroom: {code.google_classroom_email}</span>
                        </div>
                      )}
                      {code.used_at && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3" />
                          <span>Usado: {formatDate(code.used_at)}</span>
                        </div>
                      )}
                    </div>
                    
                    {!code.is_used && !isCodeExpired(code.expires_at) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => expireCode(code.id)}
                        className="mt-2"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Expirar código
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role === 'parent') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Códigos Utilizados
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUsedCodes(!showUsedCodes)}
              >
                {showUsedCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showUsedCodes ? 'Ocultar' : 'Mostrar'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Cargando códigos...</p>
            ) : usedCodes.length === 0 ? (
              <p className="text-muted-foreground">No has utilizado códigos de vinculación.</p>
            ) : showUsedCodes ? (
              <div className="space-y-4">
                {usedCodes.map((codeData) => (
                  <div key={codeData.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-bold">{codeData.code}</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />Usado
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>Estudiante: {codeData.student?.display_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>Email: {codeData.student?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>Usado el: {formatDate(codeData.used_at)}</span>
                      </div>
                      {codeData.email_institucional && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>Email institucional: {codeData.email_institucional}</span>
                        </div>
                      )}
                      {codeData.google_classroom_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>Email Google Classroom: {codeData.google_classroom_email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  Haz clic en "Mostrar" para ver los códigos que has utilizado para vincularte con estudiantes.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Alert>
      <AlertDescription>
        Esta funcionalidad solo está disponible para estudiantes y padres.
      </AlertDescription>
    </Alert>
  );
};

export default StudentLinkingCodeManager;
