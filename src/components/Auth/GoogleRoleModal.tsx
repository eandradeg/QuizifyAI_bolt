
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types/auth';
import { useLanguage } from '@/contexts/LanguageContext';

interface GoogleRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (role: UserRole) => void;
  userName?: string;
}

const GoogleRoleModal: React.FC<GoogleRoleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const { t } = useLanguage();

  const handleConfirm = () => {
    if (selectedRole) {
      onConfirm(selectedRole);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Completa tu registro</DialogTitle>
          <DialogDescription>
            ¡Hola {userName}! Para completar tu registro con Google, por favor selecciona tu rol:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Estudiante</SelectItem>
              <SelectItem value="teacher">Profesor</SelectItem>
              <SelectItem value="parent">Padre/Madre</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedRole}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Completar registro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleRoleModal;
