
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import QuizCard from '@/components/Quiz/QuizCard';
import { ArrowLeft, Trophy } from 'lucide-react';

const mockQuestions = [
  {
    id: '1',
    question: '¿Cuál es la capital de Francia?',
    options: ['Madrid', 'París', 'Roma', 'Londres'],
    correctAnswer: 1,
    type: 'multiple-choice' as const,
  },
  {
    id: '2',
    question: '¿Es cierto que la Tierra gira alrededor del Sol?',
    options: ['Verdadero', 'Falso'],
    correctAnswer: 0,
    type: 'true-false' as const,
  },
  {
    id: '3',
    question: '¿Cuántos continentes hay en el mundo?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    type: 'multiple-choice' as const,
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { t } = useLanguage();

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < mockQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsCompleted(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-2xl mx-auto pt-20">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Trophy className="h-24 w-24 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              ¡Quiz Completado!
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Tu puntuación: {score}/{mockQuestions.length}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {(score / mockQuestions.length) * 100}% de respuestas correctas
              </p>
              <div className="space-x-4">
                <Button onClick={resetQuiz} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Intentar de Nuevo
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz de Geografía
          </h1>
          <div className="flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Pregunta {currentQuestion + 1} de {mockQuestions.length}</span>
            <span>•</span>
            <span>Puntuación: {score}/{currentQuestion}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <QuizCard
          question={mockQuestions[currentQuestion]}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default Quiz;
