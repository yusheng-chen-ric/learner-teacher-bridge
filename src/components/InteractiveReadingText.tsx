
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { GazeOverlay } from "./GazeOverlay";
import { VocabularyPopup } from "./VocabularyPopup";
import { SentenceAssistanceTooltip } from "./SentenceAssistanceTooltip";
import { FollowAlongWidget } from "./FollowAlongWidget";
import { PronunciationFeedback } from "./PronunciationFeedback";

export const InteractiveReadingText = () => {
  const [gazeTrackingActive, setGazeTrackingActive] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{ word: string; position: { x: number; y: number } } | null>(null);
  const [selectedSentence, setSelectedSentence] = useState<{ sentence: string; position: { x: number; y: number } } | null>(null);
  const [followAlongTarget, setFollowAlongTarget] = useState<{ text: string; position: { x: number; y: number } } | null>(null);
  const [feedbackData, setFeedbackData] = useState<{ audioBlob: Blob; text: string } | null>(null);
  
  const textRef = useRef<HTMLDivElement>(null);

  const sampleText = `Emma has been learning English for two years. She finds reading comprehension relatively easy, but speaking still makes her nervous. The pronunciation of certain sounds, particularly the "th" sound in words like "think" and "through," continues to challenge her. Her teacher believes that with consistent practice and confidence-building exercises, Emma will become much more fluent in spoken English.`;

  const handleWordClick = (event: React.MouseEvent, word: string) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setSelectedWord({
      word,
      position: { x: rect.left, y: rect.top }
    });
    setSelectedSentence(null);
    setFollowAlongTarget(null);
  };

  const handleSentenceClick = (event: React.MouseEvent, sentence: string) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setSelectedSentence({
      sentence,
      position: { x: rect.left, y: rect.top }
    });
    setSelectedWord(null);
    setFollowAlongTarget(null);
  };

  const handleFollowAlong = (event: React.MouseEvent, text: string) => {
    event.stopPropagation();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setFollowAlongTarget({
      text,
      position: { x: rect.left, y: rect.top }
    });
    setSelectedWord(null);
    setSelectedSentence(null);
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    if (followAlongTarget) {
      setFeedbackData({
        audioBlob,
        text: followAlongTarget.text
      });
      setFollowAlongTarget(null);
    }
  };

  const renderInteractiveText = () => {
    const sentences = sampleText.split(/([.!?]+)/).filter(s => s.trim());
    
    return sentences.map((sentence, sentenceIndex) => {
      if (/[.!?]+/.test(sentence)) {
        return <span key={sentenceIndex}>{sentence} </span>;
      }
      
      const words = sentence.split(' ');
      return (
        <span key={sentenceIndex}>
          <span
            className="cursor-pointer hover:bg-green-100 rounded px-1 py-0.5 transition-colors duration-200 relative group"
            onClick={(e) => handleSentenceClick(e, sentence.trim())}
          >
            {words.map((word, wordIndex) => (
              <span key={wordIndex}>
                <span
                  className="cursor-pointer hover:bg-blue-100 rounded px-0.5 transition-colors duration-200 relative inline-block group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWordClick(e, word.replace(/[^\w]/g, ''));
                  }}
                >
                  {word}
                  <button
                    className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-yellow-400 text-yellow-900 px-1 py-0.5 rounded text-[10px] transition-opacity duration-200"
                    onClick={(e) => handleFollowAlong(e, word.replace(/[^\w]/g, ''))}
                  >
                    🔊
                  </button>
                </span>
                {wordIndex < words.length - 1 && ' '}
              </span>
            ))}
            <button
              className="opacity-0 group-hover:opacity-100 absolute -top-8 right-0 text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded text-[10px] transition-opacity duration-200"
              onClick={(e) => handleFollowAlong(e, sentence.trim())}
            >
              📖 Read Sentence
            </button>
          </span>
        </span>
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Interactive English Reading</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            Tap words for definitions • Tap sentences for grammar help
          </Badge>
          <Button
            variant={gazeTrackingActive ? "default" : "outline"}
            size="sm"
            onClick={() => setGazeTrackingActive(!gazeTrackingActive)}
          >
            {gazeTrackingActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {gazeTrackingActive ? "Stop" : "Start"} Gaze Tracking
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div
            ref={textRef}
            className="text-base leading-8 select-none relative"
            style={{ fontSize: '18px', lineHeight: '2.2' }}
          >
            {renderInteractiveText()}
          </div>
        </CardContent>
      </Card>

      <GazeOverlay 
        isActive={gazeTrackingActive} 
        textElement={textRef.current}
      />

      {selectedWord && (
        <VocabularyPopup
          word={selectedWord.word}
          position={selectedWord.position}
          onClose={() => setSelectedWord(null)}
        />
      )}

      {selectedSentence && (
        <SentenceAssistanceTooltip
          sentence={selectedSentence.sentence}
          position={selectedSentence.position}
          onClose={() => setSelectedSentence(null)}
        />
      )}

      {followAlongTarget && (
        <FollowAlongWidget
          text={followAlongTarget.text}
          position={followAlongTarget.position}
          onClose={() => setFollowAlongTarget(null)}
          onRecordingComplete={handleRecordingComplete}
        />
      )}

      {feedbackData && (
        <PronunciationFeedback
          audioBlob={feedbackData.audioBlob}
          originalText={feedbackData.text}
          onClose={() => setFeedbackData(null)}
        />
      )}
    </div>
  );
};
