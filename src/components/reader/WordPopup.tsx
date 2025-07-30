
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, X } from 'lucide-react';

interface WordPopupProps {
  word: string;
  position: { top: number; left: number };
  onClose: () => void;
}

interface WordDefinition {
  word: string;
  partOfSpeech: string;
  definition: string;
  pronunciation: string;
  examples: string[];
}

export const WordPopup = ({ word, position, onClose }: WordPopupProps) => {
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Simulate API call for word definition
    const fetchDefinition = async () => {
      setIsLoading(true);
      
      // Mock data - in real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockDefinition: WordDefinition = {
        word: word,
        partOfSpeech: 'noun',
        definition: `A detailed explanation of the word "${word}" with context and usage examples.`,
        pronunciation: '/wɜːrd/',
        examples: [
          `This ${word} is commonly used in English.`,
          `Students often look up this ${word} when reading.`
        ]
      };
      
      setDefinition(mockDefinition);
      setIsLoading(false);
    };

    fetchDefinition();
  }, [word]);

  const playPronunciation = () => {
    if ('speechSynthesis' in window && definition) {
      const utterance = new SpeechSynthesisUtterance(definition.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50" data-word-popup onClick={onClose}>
      <Card
        className="absolute w-80 shadow-lg border-2 border-blue-200 bg-white"
        style={{
          left: Math.min(position.left, window.innerWidth - 320),
          top: Math.min(position.top + 10, window.innerHeight - 250),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : definition && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-blue-700">{definition.word}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={playPronunciation}
                    className="text-blue-600 hover:text-blue-800 p-1 h-auto"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
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

              {!isFlipped ? (
                <div className="space-y-2" onClick={() => setIsFlipped(true)}>
                  <div className="text-sm text-gray-600 italic">
                    {definition.pronunciation} • {definition.partOfSpeech}
                  </div>

                  <div className="text-sm text-gray-800 leading-relaxed">
                    {definition.definition}
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-700">Examples:</div>
                    {definition.examples.map((example, index) => (
                      <div key={index} className="text-xs text-gray-600 italic">
                        • {example}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 text-right">Click to flip</div>
                </div>
              ) : (
                <div className="text-sm text-gray-800" onClick={() => setIsFlipped(false)}>
                  <p className="mb-2">Add this word to your review list!</p>
                  <p className="text-xs text-gray-500">Click to return</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
