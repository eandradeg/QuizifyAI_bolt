
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { GoogleClassroomCourse } from '@/services/googleClassroom';

interface CoursesListProps {
  courses: GoogleClassroomCourse[];
}

const CoursesList: React.FC<CoursesListProps> = ({ courses }) => {
  if (courses.length === 0) {
    return <p className="text-muted-foreground">No se encontraron clases.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <h4 className="font-semibold">{course.name}</h4>
            {course.section && (
              <p className="text-sm text-muted-foreground">{course.section}</p>
            )}
            {course.room && (
              <p className="text-xs text-muted-foreground">Aula: {course.room}</p>
            )}
            {course.alternate_link && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 p-0 h-auto"
                onClick={() => window.open(course.alternate_link, '_blank')}
              >
                Ver en Classroom <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CoursesList;
