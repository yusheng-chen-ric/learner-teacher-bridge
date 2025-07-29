
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Save, ArrowLeft } from 'lucide-react';
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
    gazeEvents: 0
  });

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
      setGrammarCard(null); // Close grammar card when word popup opens
    },
    onRegression: ({ sentenceId, element, sentence }) => {
      const rect = element.getBoundingClientRect();
      setGrammarCard({
        visible: true,
        sentenceId,
        sentence,
        position: { top: rect.bottom, left: rect.left }
      });
      setWordPopup(null); // Close word popup when grammar card opens
    },
    onDistraction: () => {
      // Highlight a random sentence to regain attention
      const sentences = document.querySelectorAll('[id^="sentence-"]');
      if (sentences.length > 0) {
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
        setDistractionElementId(randomSentence.id);
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          setDistractionElementId(null);
        }, 3000);
      }
    }
  });

  // Simulate gaze tracking data
  useEffect(() => {
    if (!isGazeActive) return;

    const simulateGazeData = () => {
      // Simulate realistic gaze data focused on text area
      const textElement = document.querySelector('[id^="sentence-"]');
      if (textElement) {
        const rect = textElement.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        
        const gazePacket: GazePacket = {
          timestamp: Date.now(),
          gaze_valid: Math.random() > 0.1 ? 1 : 0, // 90% valid gaze
          gaze_pos_x: x,
          gaze_pos_y: y,
          pupil_diameter: 3 + Math.random() * 2,
          blink_detected: Math.random() < 0.05
        };
        
        gazeDataQueue.current.push(gazePacket);
      }
    };

    const interval = setInterval(simulateGazeData, 50); // 20Hz simulation
    return () => clearInterval(interval);
  }, [isGazeActive]);

  // Main processing loop
  useEffect(() => {
    if (!isGazeActive) return;

    const processGazeData = () => {
      if (gazeDataQueue.current.length > 0) {
        const packet = gazeDataQueue.current.shift()!;
        fullSessionData.current.push(packet);
        
        // Find element at gaze position
        const hoveredElement = packet.gaze_valid === 1 
          ? document.elementFromPoint(packet.gaze_pos_x, packet.gaze_pos_y)
          : null;
        
        // Process gaze event
        processEvent(hoveredElement, packet.timestamp, packet.gaze_valid === 1);
        
        // Update session stats
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
    
    // In real implementation, this would upload data to backend
    console.log('Uploading session data:', {
      sessionId,
      gazeData: fullSessionData.current,
      sessionStats: sessionData
    });
    
    // Navigate to report page
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
              Reading Time: {formatTime(sessionData.readingTime)}
            </Badge>
            <Badge variant="secondary">
              Gaze Events: {sessionData.gazeEvents}
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reading Controls</CardTitle>
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
                    <span>Start Eye Tracking</span>
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
                    👁️ Tracking Active
                  </Badge>
                )}
              </div>
              
              <Button
                onClick={handleFinishReading}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Finish Reading</span>
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

        {/* Instructions */}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Instructions:</strong></p>
              <p>• Look at words for 800ms+ to see definitions</p>
              <p>• Re-reading previous sentences will show grammar help</p>
              <p>• Stay focused on the text to avoid distraction alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popups */}
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
