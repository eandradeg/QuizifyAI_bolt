
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar, MoreVertical } from 'lucide-react';

interface ClassroomListProps {
  onSelectClass: (classId: string) => void;
  selectedClassId: string | null;
}

const ClassroomList: React.FC<ClassroomListProps> = ({ onSelectClass, selectedClassId }) => {
  // Mock data - esto se reemplazará con datos reales de la API
  const classes = [
    {
      id: '1',
      name: 'Matemáticas 8º A',
      subject: 'Matemáticas',
      grade: '8º Grado',
      students: 24,
      section: 'A',
      color: 'bg-blue-500',
      nextClass: '2024-01-15 09:00',
      description: 'Álgebra y geometría básica'
    },
    {
      id: '2',
      name: 'Historia Universal',
      subject: 'Historia',
      grade: '9º Grado',
      students: 18,
      section: 'B',
      color: 'bg-green-500',
      nextClass: '2024-01-15 11:00',
      description: 'Historia medieval y moderna'
    },
    {
      id: '3',
      name: 'Ciencias Naturales',
      subject: 'Ciencias',
      grade: '7º Grado',
      students: 22,
      section: 'A',
      color: 'bg-purple-500',
      nextClass: '2024-01-15 14:00',
      description: 'Biología y química básica'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mis Clases ({classes.length})
        </h2>
      </div>

      {classes.map((classItem) => (
        <Card 
          key={classItem.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedClassId === classItem.id 
              ? 'ring-2 ring-blue-500 shadow-md' 
              : 'hover:shadow-sm'
          }`}
          onClick={() => onSelectClass(classItem.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${classItem.color} rounded-lg flex items-center justify-center`}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium">
                    {classItem.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {classItem.subject} • {classItem.grade}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {classItem.description}
            </p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {classItem.students} estudiantes
                </div>
                <Badge variant="secondary">
                  Sección {classItem.section}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              Próxima clase: {new Date(classItem.nextClass).toLocaleDateString('es-ES', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClassroomList;
