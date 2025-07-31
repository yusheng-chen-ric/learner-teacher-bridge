
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, BookOpen, Settings, BarChart3 } from "lucide-react";
import { GazeOverlay } from "./GazeOverlay";
import { VocabularyPopup } from "./VocabularyPopup";
import { SentenceAssistanceTooltip } from "./SentenceAssistanceTooltip";
import { FollowAlongWidget } from "./FollowAlongWidget";
import { PronunciationFeedback } from "./PronunciationFeedback";
import { PersonalizedReviewPanel } from "./PersonalizedReviewPanel";
import { AttentionTimeline } from "./AttentionTimeline";
import { SettingsPanel } from "./SettingsPanel";

export const InteractiveReadingText = () => {
  const [gazeTrackingActive, setGazeTrackingActive] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{ word: string; position: { x: number; y: number } } | null>(null);
  const [selectedSentence, setSelectedSentence] = useState<{ sentence: string; position: { x: number; y: number } } | null>(null);
  const [followAlongTarget, setFollowAlongTarget] = useState<{ text: string; position: { x: number; y: number } } | null>(null);
  const [feedbackData, setFeedbackData] = useState<{ audioBlob: Blob; text: string } | null>(null);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  
  const textRef = useRef<HTMLDivElement>(null);

  const sampleText = `Emma 學習英文已兩年。她覺得閱讀理解相對容易，但開口說仍讓她緊張。某些發音，特別是像 think 與 through 中的 th 音，仍然困擾著她。老師相信只要持續練習並建立自信，Emma 的口說會更加流利。閱讀文章能幫助她擴充字彙並理解不同句型。`;

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
        <h3 className="text-lg font-semibold">互動英文閱讀</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            點擊單字看解釋・點擊句子看文法
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReviewPanel(true)}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            複習清單
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettingsPanel(true)}
          >
            <Settings className="h-4 w-4 mr-1" />
            設定
          </Button>
          <Button
            variant={gazeTrackingActive ? "default" : "outline"}
            size="sm"
            onClick={() => setGazeTrackingActive(!gazeTrackingActive)}
          >
            {gazeTrackingActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {gazeTrackingActive ? "停止" : "開始"} 追蹤視線
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

      <AttentionTimeline />

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

      {showReviewPanel && (
        <PersonalizedReviewPanel onClose={() => setShowReviewPanel(false)} />
      )}

      {showSettingsPanel && (
        <SettingsPanel onClose={() => setShowSettingsPanel(false)} />
      )}
    </div>
  );
};
