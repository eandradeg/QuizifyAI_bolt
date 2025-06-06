import React, { useState } from 'react';
import { useCalendarEvents, useCreateEvent, useUpdateEvent } from '@/hooks/useCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, CheckCircle2, Clock, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useTranslatedToast } from '@/hooks/useTranslatedToast';

interface EventFormData {
  title: string;
  description?: string;
  event_type: 'quiz' | 'homework' | 'exam' | 'reminder' | 'other';
  start_date: Date;
  end_date?: Date;
}

const CalendarView = () => {
  const { data: events, isLoading } = useCalendarEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const toast = useTranslatedToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EventFormData>({
    defaultValues: {
      start_date: new Date(),
      event_type: 'other'
    }
  });

  const handleToggleComplete = (eventId: string, currentStatus: boolean) => {
    updateEvent.mutate({
      id: eventId,
      updates: { is_completed: !currentStatus }
    });
  };

  const onSubmit = (data: EventFormData) => {
    createEvent.mutate({
      title: data.title,
      description: data.description,
      event_type: data.event_type,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date?.toISOString(),
      is_completed: false,
    }, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        reset();
        toast.saveSuccess();
      }
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      quiz: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      homework: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      exam: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      reminder: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const upcomingEvents = events?.filter(event => 
    new Date(event.start_date) >= new Date() && !event.is_completed
  ).slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Calendario
          </h1>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Evento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  {...register('title', { required: 'El título es requerido' })}
                  placeholder="Título del evento"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  {...register('description')}
                  placeholder="Descripción del evento (opcional)"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tipo de Evento</label>
                <Select onValueChange={(value) => setValue('event_type', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homework">Tarea</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="exam">Examen</SelectItem>
                    <SelectItem value="reminder">Recordatorio</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Fecha de Inicio</label>
                <Input
                  type="datetime-local"
                  {...register('start_date', { 
                    required: 'La fecha de inicio es requerida',
                    valueAsDate: true 
                  })}
                />
                {errors.start_date && (
                  <p className="text-sm text-red-600">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Fecha de Fin (Opcional)</label>
                <Input
                  type="datetime-local"
                  {...register('end_date', { valueAsDate: true })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createEvent.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createEvent.isPending ? 'Creando...' : 'Crear Evento'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            {selectedDate && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">
                  Eventos para {format(selectedDate, 'dd/MM/yyyy')}
                </h4>
                {events?.filter(event => 
                  format(parseISO(event.start_date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                ).map(event => (
                  <div key={event.id} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded mb-1">
                    <span className="font-medium">{event.title}</span>
                    <Badge className={`ml-2 text-xs ${getEventTypeColor(event.event_type)}`}>
                      {event.event_type}
                    </Badge>
                  </div>
                )) || <p className="text-sm text-gray-500">No hay eventos</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents?.length ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{event.title}</span>
                          <Badge className={getEventTypeColor(event.event_type)}>
                            {event.event_type}
                          </Badge>
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {event.description}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {format(parseISO(event.start_date), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleComplete(event.id, event.is_completed)}
                        className="flex items-center space-x-1"
                      >
                        <Clock className="h-4 w-4" />
                        <span>Marcar</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay eventos próximos</p>
              )}
            </CardContent>
          </Card>

          {/* All Events */}
          <Card>
            <CardHeader>
              <CardTitle>Todos los Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              {events?.length ? (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className={`p-3 border rounded-lg ${event.is_completed ? 'opacity-60 bg-gray-50 dark:bg-gray-800' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{event.title}</span>
                            <Badge className={getEventTypeColor(event.event_type)}>
                              {event.event_type}
                            </Badge>
                            {event.is_completed && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              Inicio: {format(parseISO(event.start_date), 'dd/MM/yyyy HH:mm')}
                            </span>
                            {event.end_date && (
                              <span>
                                Fin: {format(parseISO(event.end_date), 'dd/MM/yyyy HH:mm')}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={event.is_completed ? "secondary" : "outline"}
                          onClick={() => handleToggleComplete(event.id, event.is_completed)}
                          className="flex items-center space-x-1"
                        >
                          {event.is_completed ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>Completado</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4" />
                              <span>Completar</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No hay eventos programados
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Comienza creando tu primer evento en el calendario.
                  </p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Evento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
