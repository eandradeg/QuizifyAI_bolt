
import React from 'react';
import { useCalendarEvents, useCreateEvent, useUpdateEvent } from '@/hooks/useCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, CheckCircle2, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const CalendarView = () => {
  const { data: events, isLoading } = useCalendarEvents();
  const updateEvent = useUpdateEvent();

  const handleToggleComplete = (eventId: string, currentStatus: boolean) => {
    updateEvent.mutate({
      id: eventId,
      updates: { is_completed: !currentStatus }
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      quiz: 'bg-blue-100 text-blue-800',
      homework: 'bg-green-100 text-green-800',
      exam: 'bg-red-100 text-red-800',
      reminder: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
        </div>
      </div>

      <div className="grid gap-4">
        {events?.map((event) => (
          <Card key={event.id} className={event.is_completed ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>{event.title}</span>
                  <Badge className={getEventTypeColor(event.event_type)}>
                    {event.event_type}
                  </Badge>
                </CardTitle>
                <Button
                  size="sm"
                  variant={event.is_completed ? "secondary" : "outline"}
                  onClick={() => handleToggleComplete(event.id, event.is_completed)}
                  className="flex items-center space-x-1"
                >
                  {event.is_completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  <span>{event.is_completed ? 'Completed' : 'Mark Complete'}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {event.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {event.description}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  Start: {format(parseISO(event.start_date), 'MMM dd, yyyy HH:mm')}
                </span>
                {event.end_date && (
                  <span>
                    End: {format(parseISO(event.end_date), 'MMM dd, yyyy HH:mm')}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {!events?.length && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No events scheduled
              </h3>
              <p className="text-gray-500 text-center">
                You don't have any calendar events yet. Create your first event to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
