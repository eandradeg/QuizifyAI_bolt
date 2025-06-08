
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { GoogleClassroomSubmissionWithDetails } from '@/services/googleClassroom';

interface SubmissionsListProps {
  submissions: GoogleClassroomSubmissionWithDetails[];
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({ submissions }) => {
  const getSubmissionStatusBadge = (submission: GoogleClassroomSubmissionWithDetails) => {
    const state = submission.state?.toLowerCase();
    
    switch (state) {
      case 'turned_in':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Entregado</Badge>;
      case 'returned':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Devuelto</Badge>;
      case 'new':
      case 'created':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Pendiente</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Desconocido</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (submissions.length === 0) {
    return <p className="text-muted-foreground">No hay entregas registradas.</p>;
  }

  return (
    <div className="space-y-4">
      {submissions.slice(0, 10).map((submission) => (
        <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium">{submission.coursework?.title}</h4>
            <p className="text-sm text-muted-foreground">
              {submission.course?.course?.name}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {getSubmissionStatusBadge(submission)}
              {submission.assigned_grade && (
                <span className="text-sm font-medium">
                  {submission.assigned_grade}/{submission.coursework?.max_points || '?'} puntos
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(submission.update_time)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionsList;
