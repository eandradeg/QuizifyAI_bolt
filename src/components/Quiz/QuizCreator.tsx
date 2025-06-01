
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, FileText, Wand2 } from 'lucide-react';

const QuizCreator = () => {
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    
    // Mock quiz generation - replace with actual AI service
    setTimeout(() => {
      setIsGenerating(false);
      console.log('Quiz generado con el contenido:', textInput || selectedFile?.name);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-6 w-6" />
            <span>{t('createQuiz')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">{t('uploadDocument')}</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Arrastra y suelta archivos aquí o haz clic para seleccionar
              </p>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Seleccionar Archivo
                </Button>
              </Label>
              {selectedFile && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Text Input Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">{t('enterText')}</Label>
            <Textarea
              placeholder="Escribe o pega el contenido para generar preguntas..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-32"
            />
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateQuiz}
              disabled={!textInput.trim() && !selectedFile || isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Wand2 className="h-4 w-4" />
                  <span>{t('generateQuestions')}</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreator;
