
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

interface VocabularyData {
  word: string;
  partOfSpeech: string;
  definition: string;
  audioUrl?: string;
}

interface VocabularyPopupProps {
  word: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export const VocabularyPopup = ({ word, position, onClose }: VocabularyPopupProps) => {
  const [vocabularyData] = useState<VocabularyData>({
    word: word,
    partOfSpeech: "noun",
    definition: `Definition of "${word}" - A detailed explanation of this English word with context and usage examples.`,
  });

  const playPronunciation = () => {
    // In real implementation, this would play actual audio
    console.log(`Playing pronunciation for: ${word}`);
    // Simulate text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <Card 
        className="absolute w-80 shadow-lg border-2 border-blue-200"
        style={{
          left: Math.min(position.x, window.innerWidth - 320),
          top: Math.min(position.y + 20, window.innerHeight - 200),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-700">{vocabularyData.word}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={playPronunciation}
                className="text-blue-600 hover:text-blue-800"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 italic">
              {vocabularyData.partOfSpeech}
            </div>
            
            <div className="text-sm text-gray-800 leading-relaxed">
              {vocabularyData.definition}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
