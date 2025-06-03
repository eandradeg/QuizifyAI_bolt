
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizService } from '@/services/quizService';
import { toast } from '@/hooks/use-toast';

export const useQuizzes = () => {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: quizService.getQuizzes,
  });
};

export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizService.getQuizById(id),
    enabled: !!id,
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quizService.createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({
        title: 'Success',
        description: 'Quiz created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useQuizResults = (quizId?: string) => {
  return useQuery({
    queryKey: ['quiz-results', quizId],
    queryFn: () => quizService.getQuizResults(quizId),
  });
};

export const useSubmitQuizResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quizService.submitQuizResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-results'] });
      toast({
        title: 'Success',
        description: 'Quiz result submitted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
