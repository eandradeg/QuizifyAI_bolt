
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Check, 
  AlertCircle, 
  Loader2,
  Key,
  Calendar
} from 'lucide-react';
import { studentLinkingService } from '@/services/studentLinkingService';
import { useToast } from '@/hooks/use-toast';

interface ParentStudentLinkerProps {
  onSuccess?: () => void | Promise<void>;
}

const ParentStudentLinker: React.FC<ParentStudentLinkerProps> = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Por favor ingresa un código válido');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await studentLinkingService.useCodeToLink(code.trim());
      
      setSuccess(true);
      setCode('');
      
      toast({
        title: "¡Vinculación exitosa!",
        description: "Te has vinculado correctamente con tu hijo.",
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error en la vinculación",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCode('');
    setError(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-900 dark:text-green-100">
                ¡Vinculación Exitosa!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Te has vinculado correctamente con tu hijo. Ahora puedes ver sus datos académicos.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={resetForm}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Vincular Otro Hijo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-muted-foreground" />
          <label htmlFor="linking-code" className="text-sm font-medium">
            Código de Vinculación
          </label>
        </div>
        <Input
          id="linking-code"
          type="text"
          placeholder="Ej: ABC123XYZ"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="font-mono text-center tracking-wider"
          maxLength={9}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Ingresa el código de 9 caracteres que tu hijo generó en su cuenta
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !code.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Vinculando...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Vincular con Hijo
          </>
        )}
      </Button>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Instrucciones:
        </h4>
        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Tu hijo debe iniciar sesión en la plataforma</li>
          <li>Debe ir a su perfil y generar un código de vinculación</li>
          <li>El código tiene una validez de 7 días</li>
          <li>Ingresa el código exactamente como aparece</li>
        </ol>
      </div>
    </form>
  );
};

export default ParentStudentLinker;
