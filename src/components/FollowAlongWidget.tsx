
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Mic, Square } from "lucide-react";

interface FollowAlongWidgetProps {
  text: string;
  position: { x: number; y: number };
  onClose: () => void;
  onRecordingComplete: (audioBlob: Blob) => void;
}

export const FollowAlongWidget = ({ text, position, onClose, onRecordingComplete }: FollowAlongWidgetProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Slower for learning
      speechSynthesis.speak(utterance);
      setHasPlayed(true);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // In real implementation, start audio recording
    console.log("Starting recording...");
    
    // Simulate recording completion after 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      // Create a mock audio blob
      const mockBlob = new Blob(['mock audio data'], { type: 'audio/wav' });
      onRecordingComplete(mockBlob);
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    console.log("Stopping recording...");
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div 
        className="absolute bg-white rounded-lg shadow-lg border-2 border-yellow-200 p-3"
        style={{
          left: Math.min(position.x, window.innerWidth - 200),
          top: Math.min(position.y - 60, window.innerHeight - 100),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={playAudio}
            className="text-blue-600 hover:text-blue-800"
          >
            <Volume2 className="h-4 w-4 mr-1" />
            播放
          </Button>
          
          {hasPlayed && (
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? "" : "text-red-600 hover:text-red-800"}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4 mr-1" />
                  停止
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-1" />
                  錄音
                </>
              )}
            </Button>
          )}
        </div>
        
        {isRecording && (
          <div className="mt-2 text-xs text-center text-red-600 animate-pulse">
            錄音中...請清楚朗讀
          </div>
        )}
      </div>
    </div>
  );
};
