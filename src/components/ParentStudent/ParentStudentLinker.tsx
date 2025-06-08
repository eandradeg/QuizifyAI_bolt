
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, UserPlus, CheckCircle } from 'lucide-react';
import { studentLinkingService } from '@/services/studentLinkingService';
import { useToast } from '@/hooks/use-toast';

const ParentStudentLinker: React.FC = () => {
  const [linkingCode, setLinkingCode] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkingSuccess, setLinkingSuccess] = useState(false);
  const { toast } = useToast();

  const handleLinkStudent = async () => {
    if (!linkingCode.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor, ingresa un código de vinculación',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLinking(true);
      await studentLinkingService.useCodeToLink(linkingCode.trim());
      
      setLinkingSuccess(true);
      setLinkingCode('');
      
      toast({
        title: 'Vinculación exitosa',
        description: 'Te has vinculado correctamente con el estudiante',
      });
    } catch (error: any) {
      console.error('Error linking student:', error);
      toast({
        title: 'Error de vinculación',
        description: error.message || 'No se pudo completar la vinculación',
        variant: 'destructive',
      });
    } finally {
      setIsLinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLinking) {
      handleLinkStudent();
    }
  };

  if (linkingSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">¡Vinculación exitosa!</h3>
            <p className="text-muted-foreground">
              Te has vinculado correctamente con el estudiante. Ahora puedes ver su progreso académico.
            </p>
            <Button 
              onClick={() => setLinkingSuccess(false)}
              variant="outline"
            >
              Vincular otro estudiante
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Vincular Estudiante
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Solicita al estudiante que te proporcione su código de vinculación para poder acceder a su progreso académico.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="linking-code">Código de Vinculación</Label>
            <Input
              id="linking-code"
              type="text"
              value={linkingCode}
              onChange={(e) => setLinkingCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Ejemplo: AB12CD"
              maxLength={6}
              className="uppercase font-mono text-center text-lg"
              disabled={isLinking}
            />
          </div>
          
          <Button 
            onClick={handleLinkStudent}
            disabled={isLinking || !linkingCode.trim()}
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {isLinking ? 'Vinculando...' : 'Vincular Estudiante'}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Los códigos son únicos y de un solo uso</p>
          <p>• Los códigos expiran automáticamente después de 7 días</p>
          <p>• Una vez usado, el código no puede ser utilizado nuevamente</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParentStudentLinker;
