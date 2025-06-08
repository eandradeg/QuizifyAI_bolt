
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink } from 'lucide-react';
import type { GoogleClassroomCourseworkWithCourse } from '@/services/googleClassroom';

interface UpcomingWorkProps {
  upcomingWork: GoogleClassroomCourseworkWithCourse[];
}

const UpcomingWork: React.FC<UpcomingWorkProps> = ({ upcomingWork }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (upcomingWork.length === 0) {
    return <p className="text-muted-foreground">No hay tareas próximas.</p>;
  }

  return (
    <div className="space-y-4">
      {upcomingWork.map((work) => (
        <div key={work.id} className="flex items-start justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium">{work.title}</h4>
            <p className="text-sm text-muted-foreground">
              {work.course?.name} {work.course?.section && `(${work.course.section})`}
            </p>
            {work.description && (
              <p className="text-sm mt-1 line-clamp-2">{work.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              {work.due_date && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(work.due_date)}
                </div>
              )}
              {work.max_points && (
                <span>{work.max_points} puntos</span>
              )}
            </div>
          </div>
          {work.alternate_link && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(work.alternate_link, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UpcomingWork;
