
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, BookOpen, Eye, Zap } from 'lucide-react';

interface ReadingModeSelectorProps {
  onStartReading: (mode: 'assignment' | 'selfpaced', assignmentId?: string) => void;
}

export const ReadingModeSelector = ({ onStartReading }: ReadingModeSelectorProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
      setSelectedFile(file);
    }
  };

  const startSelfPacedReading = () => {
    if (selectedFile) {
      onStartReading('selfpaced');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Smart Reading Mode */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <Eye className="h-5 w-5 mr-2" />
            Smart Reading Mode
          </CardTitle>
          <Badge className="bg-green-100 text-green-800 w-fit">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-green-600 space-y-2">
            <p>✨ <strong>Intelligent word lookup</strong> - Just look at difficult words</p>
            <p>🎯 <strong>Grammar assistance</strong> - Get help when you re-read sentences</p>
            <p>🔊 <strong>Instant pronunciation</strong> - Nod gestures for audio help</p>
            <p>📊 <strong>Focus tracking</strong> - Gentle reminders to stay concentrated</p>
          </div>
          
          <div className="pt-4">
            <input
              type="file"
              accept=".txt,.pdf,.epub"
              onChange={handleFileUpload}
              className="hidden"
              id="smart-file-upload"
            />
            <label htmlFor="smart-file-upload">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
                asChild
              >
                <div className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Article for Smart Reading
                </div>
              </Button>
            </label>
            
            {selectedFile && (
              <div className="mt-2 p-2 bg-white rounded border">
                <p className="text-xs text-gray-600">Selected: {selectedFile.name}</p>
                <Button 
                  onClick={startSelfPacedReading}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  Start Smart Reading Session
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Traditional Reading Mode */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <BookOpen className="h-5 w-5 mr-2" />
            Traditional Reading
          </CardTitle>
          <Badge variant="secondary" className="w-fit">
            Classic Mode
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-blue-600 space-y-2">
            <p>📖 <strong>Focus on reading flow</strong> - Minimal interruptions</p>
            <p>⏱️ <strong>Time tracking</strong> - Monitor your reading speed</p>
            <p>📈 <strong>Progress analysis</strong> - View reading patterns afterward</p>
            <p>🎨 <strong>Clean interface</strong> - Distraction-free environment</p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={() => onStartReading('selfpaced')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Start Traditional Reading
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
