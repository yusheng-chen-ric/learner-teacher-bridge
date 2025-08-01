
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, X } from 'lucide-react';
import { ttsService } from '@/services/TTSService';

interface WordPopupProps {
  word: string;
  position: { top: number; left: number };
  onClose: () => void;
  onFollowAlong?: (text: string, position: { top: number; left: number }) => void;
}

interface WordDefinition {
  word: string;
  partOfSpeech: string;
  definition: string;
  pronunciation: string;
  examples: string[];
}

export const WordPopup = ({ word, position, onClose, onFollowAlong }: WordPopupProps) => {
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
        partOfSpeech: '名詞',
        definition: `關於 "${word}" 的詳細解釋與用法範例。`,
        pronunciation: '/wɜːrd/',
        examples: [
          `這個單字在英文中相當常見。`,
          `學生閱讀時常查詢 ${word}。`
        ]
      };
      
      setDefinition(mockDefinition);
      setIsLoading(false);
    };

    fetchDefinition();
  }, [word]);

  const playPronunciation = () => {
    if (definition) {
      const settings = ttsService.getSettings();
      if (settings.enabled) {
        ttsService
          .speak(definition.word, { rate: settings.rate * 0.8 })
          .catch((e) => console.error('TTS Error:', e));
      }
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
                  {onFollowAlong && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFollowAlong(definition.word, position)}
                      className="text-green-600 hover:text-green-800 p-1 h-auto"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  )}
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
                    <div className="text-xs font-medium text-gray-700">例句：</div>
                    {definition.examples.map((example, index) => (
                      <div key={index} className="text-xs text-gray-600 italic">
                        • {example}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 text-right">點擊切換</div>
                </div>
              ) : (
                <div className="text-sm text-gray-800" onClick={() => setIsFlipped(false)}>
                  <p className="mb-2">將此單字加入複習清單！</p>
                  <p className="text-xs text-gray-500">點擊返回</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
