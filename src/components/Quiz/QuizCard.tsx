
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'true-false';
}

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, onAnswer, disabled }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { t } = useLanguage();

  const handleAnswerSelect = (answerIndex: number) => {
    if (disabled || showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === question.correctAnswer;
    
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <Card className={cn(
      "w-full max-w-2xl mx-auto transition-all duration-500 transform",
      showResult && isCorrect && "ring-4 ring-green-400 bg-green-50 dark:bg-green-900/20",
      showResult && !isCorrect && "ring-4 ring-red-400 bg-red-50 dark:bg-red-900/20",
      "hover:shadow-lg"
    )}>
      <CardContent className="p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {question.question}
          </h3>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "w-full p-4 h-auto text-left justify-start transition-all duration-300",
                "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                selectedAnswer === index && showResult && index === question.correctAnswer && 
                "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300",
                selectedAnswer === index && showResult && index !== question.correctAnswer && 
                "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300",
                showResult && index === question.correctAnswer && selectedAnswer !== index &&
                "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleAnswerSelect(index)}
              disabled={disabled || showResult}
            >
              <span className="text-base">{option}</span>
            </Button>
          ))}
        </div>

        {showResult && (
          <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-500">
            <p className={cn(
              "text-lg font-semibold text-center",
              isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {isCorrect ? t('correct') : t('incorrect')}
            </p>
            {!isCorrect && (
              <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
                Respuesta correcta: {question.options[question.correctAnswer]}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizCard;
