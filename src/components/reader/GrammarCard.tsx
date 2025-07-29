
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, BookOpen } from 'lucide-react';

interface GrammarCardProps {
  sentence: string;
  position: { top: number; left: number };
  onClose: () => void;
}

export const GrammarCard = ({ sentence, position, onClose }: GrammarCardProps) => {
  // Mock grammar analysis - in real implementation, this would come from AI/NLP service
  const grammarAnalysis = {
    tense: 'Present Perfect',
    structure: 'Subject + has/have + past participle',
    explanation: 'This sentence uses the present perfect tense to describe an action that started in the past and continues to the present.',
    translation: '這句話使用現在完成時來描述從過去開始並持續到現在的動作。',
    tips: [
      'Focus on the auxiliary verb "has/have"',
      'Notice the past participle form',
      'This tense connects past and present'
    ]
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <Card 
        className="absolute w-96 shadow-lg border-2 border-green-200 bg-white"
        style={{
          left: Math.min(position.left, window.innerWidth - 384),
          top: Math.min(position.top + 10, window.innerHeight - 300),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700">Grammar Help</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-800 italic">"{sentence}"</div>
            </div>

            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
                  {grammarAnalysis.tense}
                </Badge>
                <p className="text-sm text-gray-700">{grammarAnalysis.structure}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">Explanation:</h4>
                <p className="text-sm text-gray-700">{grammarAnalysis.explanation}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">中文解釋:</h4>
                <p className="text-sm text-gray-700">{grammarAnalysis.translation}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">Key Points:</h4>
                <ul className="space-y-1">
                  {grammarAnalysis.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-600">• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
