
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Save, ArrowLeft, Volume2 } from 'lucide-react';
import { TextDisplay } from '@/components/reader/TextDisplay';
import { WordPopup } from '@/components/reader/WordPopup';
import { GrammarCard } from '@/components/reader/GrammarCard';
import { useGazeEvents } from '@/hooks/useGazeEvents';
import type { GazePacket, WordPopupData, GrammarCardData } from '@/types';

export const ReaderPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  // Sample text content - in real app, this would come from API
  const textContent = `Emma has been learning English for two years. She finds reading comprehension relatively easy, but speaking still makes her nervous. The pronunciation of certain sounds, particularly the "th" sound in words like "think" and "through," continues to challenge her. Her teacher believes that with consistent practice and confidence-building exercises, Emma will become much more fluent in spoken English. Reading books and articles helps Emma expand her vocabulary and understand different sentence structures.`;

  // Core state management
  const [isGazeActive, setIsGazeActive] = useState(false);
  const [wordPopup, setWordPopup] = useState<WordPopupData | null>(null);
  const [grammarCard, setGrammarCard] = useState<GrammarCardData | null>(null);
  const [distractionElementId, setDistractionElementId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState({
    startTime: Date.now(),
    readingTime: 0,
    gazeEvents: 0,
    nodEvents: 0
  });

  // Enhanced interaction states
  const [showNodPrompt, setShowNodPrompt] = useState<{
    visible: boolean;
    wordId: string;
    word: string;
    position: { top: number; left: number };
  } | null>(null);

  // Refs for performance optimization
  const elementPositionsRef = useRef<Map<string, DOMRect>>(new Map());
  const gazeDataQueue = useRef<GazePacket[]>([]);
  const fullSessionData = useRef<GazePacket[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize gaze event handlers
  const { processEvent, resetSession } = useGazeEvents({
    onFixation: ({ wordId, element, word }) => {
      const rect = element.getBoundingClientRect();
      setWordPopup({
        visible: true,
        wordId,
        word,
        position: { top: rect.bottom, left: rect.left }
      });
      setGrammarCard(null);
      setShowNodPrompt(null);
    },
    onRegression: ({ sentenceId, element, sentence }) => {
      const rect = element.getBoundingClientRect();
      setGrammarCard({
        visible: true,
        sentenceId,
        sentence,
        position: { top: rect.bottom, left: rect.left }
      });
      setWordPopup(null);
      setShowNodPrompt(null);
    },
    onDistraction: () => {
      // Highlight a random sentence to regain attention
      const sentences = document.querySelectorAll('[id^="sentence-"]');
      if (sentences.length > 0) {
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
        setDistractionElementId(randomSentence.id);
        
        setTimeout(() => {
          setDistractionElementId(null);
        }, 3000);
      }
    },
    onNodOnce: ({ wordId, element, word }) => {
      const rect = element.getBoundingClientRect();
      setShowNodPrompt({
        visible: true,
        wordId,
        word,
        position: { top: rect.bottom, left: rect.left }
      });
      setWordPopup(null);
      setGrammarCard(null);
      
      // Auto-show word popup after nod detection
      setTimeout(() => {
        setWordPopup({
          visible: true,
          wordId,
          word,
          position: { top: rect.bottom, left: rect.left }
        });
        setShowNodPrompt(null);
      }, 1000);
    },
    onNodTwice: ({ wordId, element, word }) => {
      // Immediately play pronunciation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
      
      setSessionData(prev => ({ ...prev, nodEvents: prev.nodEvents + 1 }));
      setShowNodPrompt(null);
      setWordPopup(null);
    }
  });

  // Simulate gaze tracking data with enhanced patterns
  useEffect(() => {
    if (!isGazeActive) return;

    const simulateGazeData = () => {
      const textElement = document.querySelector('[id^="sentence-"]');
      if (textElement) {
        const rect = textElement.getBoundingClientRect();
        const baseX = rect.left + Math.random() * rect.width;
        const baseY = rect.top + Math.random() * rect.height;
        
        // Simulate slight vertical movements for nod detection
        const verticalVariation = Math.sin(Date.now() / 1000) * 5 + Math.random() * 10 - 5;
        
        const gazePacket: GazePacket = {
          timestamp: Date.now(),
          gaze_valid: Math.random() > 0.1 ? 1 : 0,
          gaze_pos_x: baseX,
          gaze_pos_y: baseY + verticalVariation,
          pupil_diameter: 3 + Math.random() * 2,
          blink_detected: Math.random() < 0.05
        };
        
        gazeDataQueue.current.push(gazePacket);
      }
    };

    const interval = setInterval(simulateGazeData, 50);
    return () => clearInterval(interval);
  }, [isGazeActive]);

  // Main processing loop with enhanced data handling
  useEffect(() => {
    if (!isGazeActive) return;

    const processGazeData = () => {
      if (gazeDataQueue.current.length > 0) {
        const packet = gazeDataQueue.current.shift()!;
        fullSessionData.current.push(packet);
        
        const hoveredElement = packet.gaze_valid === 1 
          ? document.elementFromPoint(packet.gaze_pos_x, packet.gaze_pos_y)
          : null;
        
        // Pass gaze Y coordinate for nod detection
        processEvent(hoveredElement, packet.timestamp, packet.gaze_valid === 1, packet.gaze_pos_y);
        
        setSessionData(prev => ({
          ...prev,
          readingTime: Date.now() - prev.startTime,
          gazeEvents: prev.gazeEvents + 1
        }));
      }
      
      animationFrameRef.current = requestAnimationFrame(processGazeData);
    };

    animationFrameRef.current = requestAnimationFrame(processGazeData);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGazeActive, processEvent]);

  const handleStartGazeTracking = () => {
    setIsGazeActive(true);
    resetSession();
    setSessionData(prev => ({ ...prev, startTime: Date.now() }));
  };

  const handleStopGazeTracking = () => {
    setIsGazeActive(false);
  };

  const handleFinishReading = async () => {
    setIsGazeActive(false);
    
    console.log('Uploading session data:', {
      sessionId,
      gazeData: fullSessionData.current,
      sessionStats: sessionData
    });
    
    navigate(`/report/${sessionId}`);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Immersive Reading</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              Time: {formatTime(sessionData.readingTime)}
            </Badge>
            <Badge variant="secondary">
              Gaze: {sessionData.gazeEvents}
            </Badge>
            <Badge variant="secondary">
              Interactions: {sessionData.nodEvents}
            </Badge>
          </div>
        </div>

        {/* Enhanced Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Smart Reading Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!isGazeActive ? (
                  <Button
                    onClick={handleStartGazeTracking}
                    className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Start Smart Reading</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleStopGazeTracking}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <EyeOff className="h-4 w-4" />
                    <span>Pause Tracking</span>
                  </Button>
                )}
                
                {isGazeActive && (
                  <Badge className="bg-green-100 text-green-800">
                    👁️ AI Assistant Active
                  </Badge>
                )}
              </div>
              
              <Button
                onClick={handleFinishReading}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Finish & View Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reading Text */}
        <Card>
          <CardContent className="p-8">
            <TextDisplay
              textContent={textContent}
              elementPositionsRef={elementPositionsRef}
              distractionElementId={distractionElementId}
            />
          </CardContent>
        </Card>

        {/* Enhanced Instructions */}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Smart Reading Features:</strong></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>• <strong>Word Help:</strong> Look at difficult words for definitions</p>
                  <p>• <strong>Quick Lookup:</strong> Slight nod once for instant word info</p>
                  <p>• <strong>Pronunciation:</strong> Nod twice to hear word pronunciation</p>
                </div>
                <div>
                  <p>• <strong>Grammar Help:</strong> Re-reading sentences shows grammar tips</p>
                  <p>• <strong>Focus Assistant:</strong> Stay focused to avoid gentle reminders</p>
                  <p>• <strong>Progress Tracking:</strong> All interactions are automatically recorded</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Popups */}
      {showNodPrompt && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div 
            className="absolute bg-yellow-100 border-2 border-yellow-400 rounded-lg p-2 shadow-lg"
            style={{
              left: Math.min(showNodPrompt.position.left, window.innerWidth - 200),
              top: Math.min(showNodPrompt.position.top + 10, window.innerHeight - 100),
            }}
          >
            <div className="flex items-center space-x-2 text-sm">
              <div className="animate-pulse">👁️</div>
              <span className="text-yellow-800 font-medium">Looking up "{showNodPrompt.word}"...</span>
            </div>
          </div>
        </div>
      )}

      {wordPopup && (
        <WordPopup
          word={wordPopup.word}
          position={wordPopup.position}
          onClose={() => setWordPopup(null)}
        />
      )}

      {grammarCard && (
        <GrammarCard
          sentence={grammarCard.sentence}
          position={grammarCard.position}
          onClose={() => setGrammarCard(null)}
        />
      )}
    </div>
  );
};
