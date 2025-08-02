import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Eye, EyeOff, Save, ArrowLeft, Volume2, VolumeX, Settings, Square } from 'lucide-react';

import { TextDisplay } from '@/components/reader/TextDisplay';
import { WordPopup } from '@/components/reader/WordPopup';
import { GrammarCard } from '@/components/reader/GrammarCard';
import { FollowAlongWidget } from '@/components/FollowAlongWidget';
import { PronunciationFeedback } from '@/components/PronunciationFeedback';
import { TTSSettingsPanel } from '@/components/TTSSettingsPanel';
import SmartReadingControl from '@/components/SmartReadingControl';

import { ttsService } from '@/services/TTSService';

import { useGazeEvents } from '@/hooks/useGazeEvents';
import type { GazePacket, WordPopupData, GrammarCardData } from '@/types';
import {
  toGazePackets,
  type RealtimeData
} from '@/lib/realtimeDataTransform';
import { TextContentTTSService } from '@/services/TextContentTTSService';
import { fetchGrammarDemo, type GrammarDemoData } from '@/lib/grammarEndpoint';
import type { VocabularyItem } from '@/types';

type WsStatus = 'connecting' | 'connected' | 'disconnected';

export const ReaderPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  // Load reading text from the public/text folder
  const [textContent, setTextContent] = useState('');
  
  const [vocabIndex, setVocabIndex] = useState(0);

  const vocabSetRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch('/text/sample.txt')
      .then((res) => res.text())
      .then(async (content) => {
        setTextContent(content);
        setTimeout(async () => {
          if (textDisplayRef.current) {
            await textTTSService.current.load(textDisplayRef.current);
            setTTSEnabled(textTTSService.current.getSettings().enabled);
          }
        }, 300);
      })
      .catch((err) => console.error('Failed to load text', err));
  }, []);

  // Load grammar annotations
  useEffect(() => {
    fetchGrammarDemo()
      .then((data) => setGrammarData(data))
      .catch((err) => console.error('Failed to load grammar demo', err));
  }, []);

  useEffect(() => {
    if (!grammarData) return;
    const initial: Record<string, string> = {};
    grammarData.sentences.forEach((s) => {
      initial[s.id] = s.underlines
        .map((u) => `${u.phrase}: ${u.explanation}`)
        .join(' | ');
    });
    setAnnotations(initial);
  }, [grammarData]);

  // Load vocabulary list for flashcards
  useEffect(() => {
    fetch('/vocab.json')
      .then((res) => res.json())
      .then((data: VocabularyItem[]) => {
        setVocabList(data);
        vocabSetRef.current = new Set(data.map((v) => v.word.toLowerCase()));
      })
      .catch((err) => console.error('Failed to load vocabulary list', err));
  }, []);

  // Core state management
  const [isGazeActive, setIsGazeActive] = useState(false);
  const [wordPopup, setWordPopup] = useState<WordPopupData | null>(null);
  const [grammarCard, setGrammarCard] = useState<GrammarCardData | null>(null);
  const [distractionElementId, setDistractionElementId] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Record<string, string>>({});
  const [grammarData, setGrammarData] = useState<GrammarDemoData | null>(null);
  const [sessionData, setSessionData] = useState({
    startTime: Date.now(),
    readingTime: 0,
    gazeEvents: 0,
    nodEvents: 0
  });

  // Enhanced interaction states
  const [newWords, setNewWords] = useState<string[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [demoContent, setDemoContent] = useState(false);
  const [followAlongTarget, setFollowAlongTarget] = useState<{ text: string; position: { x: number; y: number } } | null>(null);
  const [feedbackData, setFeedbackData] = useState<{ audioBlob: Blob; text: string } | null>(null);
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting');
  const [manualDistraction, setManualDistraction] = useState(false);
  const [showTTSSettings, setShowTTSSettings] = useState(false);
  const [ttsEnabled, setTTSEnabled] = useState(ttsService.getSettings().enabled);

  const toggleTTS = () => {
    const newEnabled = !ttsEnabled;
    ttsService.updateSettings({ enabled: newEnabled });
    setTTSEnabled(newEnabled);
  };

  const [usingRealData, setUsingRealData] = useState(false);
  const [lastRealDataTime, setLastRealDataTime] = useState(0);
  const [currentNodCount, setCurrentNodCount] = useState(0);
  const noDataWarnedRef = useRef(false);

  const textTTSService = useRef<TextContentTTSService>(new TextContentTTSService());
  const textDisplayRef = useRef<HTMLDivElement>(null);

  const speakAll = useCallback(() => {
    if (textContent) {
      textTTSService.current
        .speakText(textContent)
        .catch((e) => console.error('TTS Error:', e));
    }
  }, [textContent]);

  const handleRecordingComplete = (audioBlob: Blob) => {
    if (followAlongTarget) {
      setFeedbackData({ audioBlob, text: followAlongTarget.text });
      setFollowAlongTarget(null);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const settings = ttsService.getSettings();
      setTTSEnabled(settings.enabled);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (demoContent) {
      setWordPopup({
        visible: true,
        wordId: 'demo-word',
        word: 'example',
        position: { top: window.innerHeight / 2 - 40, left: window.innerWidth / 2 - 120 }
      });
      setGrammarCard({
        visible: true,
        sentenceId: 'demo-sentence',
        sentence: 'This is a sample sentence used to demonstrate the interface.',
        position: { top: window.innerHeight / 2 + 40, left: window.innerWidth / 2 - 160 }
      });
    } else {
      setWordPopup(null);
      setGrammarCard(null);
    }
  }, [demoContent]);



  // Refs for performance optimization
  const elementPositionsRef = useRef<Map<string, DOMRect>>(new Map());
  const gazeDataQueue = useRef<GazePacket[]>([]);
  const fullSessionData = useRef<GazePacket[]>([]);
  const animationFrameRef = useRef<number>();
  const prevGazeRef = useRef<{ x: number; y: number } | null>(null);
  const fixationTracker = useRef<{ startTime: number; x: number; y: number } | null>(null);
  const prevNodCountRef = useRef(0);

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
      setNewWords(prev => (prev.includes(word) ? prev : [...prev, word]));
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
      const annotation = grammarData?.sentences.find(s => s.id === sentenceId);
      if (annotation) {
        const text = annotation.underlines.map(u => `${u.phrase}: ${u.explanation}`).join(' \n ');
        setAnnotations(prev => ({ ...prev, [sentenceId]: text }));
      }
    },
    onDistraction: () => {
      // Set a default distraction behavior when no specific sentence is identified
      if (manualDistraction) return;
      const sentence = document.querySelector('[id^="sentence-"]');
      if (sentence) {
        const sentenceId = sentence.id;
        setDistractionElementId(sentenceId);
        setTimeout(() => {
          if (!manualDistraction) {
            setDistractionElementId(null);
          }
        }, 3000);
      }
    }
  });



  // WebSocket connection and real-time data processing
  useEffect(() => {
    if (!isGazeActive) return;

    const ws = new WebSocket('ws://localhost:8765');
    setWsStatus('connecting');
    
    ws.onopen = () => {
      console.log('WebSocket connected to gaze tracking backend');
      setWsStatus('connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Validate message structure
        if (!data || typeof data !== 'object') {
          console.warn('Invalid WebSocket message format:', data);
          return;
        }
        
        if (data.type === 'realtime_data') {
          // Validate required fields
          if (!data.gaze || typeof data.gaze.x !== 'number' || typeof data.gaze.y !== 'number') {
            console.warn('Invalid gaze data format:', data.gaze);
            return;
          }
          
          // Validate timestamp
          const timestamp = Date.parse(data.timestamp);
          if (isNaN(timestamp)) {
            console.warn('Invalid timestamp:', data.timestamp);
            return;
          }
          
          // Convert backend data to GazePacket format with validation
          const gazePacket: GazePacket = {
            timestamp,
            gaze_valid: data.gaze.valid === 1 ? 1 : 0,
            gaze_pos_x: Math.max(0, Math.min(window.innerWidth, data.gaze.x)),
            gaze_pos_y: Math.max(0, Math.min(window.innerHeight, data.gaze.y)),
            pupil_diameter: data.pupil_diameter > 0 ? data.pupil_diameter : undefined,
            blink_detected: Boolean(data.blink_detected)
          };
          
          // Add real backend data to processing queue
          gazeDataQueue.current.push(gazePacket);
          
          // Mark that we're receiving real data
          setUsingRealData(true);
          setLastRealDataTime(Date.now());
          
          // Update session data with real backend behaviors
          if (data.behaviors?.nod_count !== undefined) {
            const newNodCount = Number(data.behaviors.nod_count);
            if (!isNaN(newNodCount) && newNodCount >= 0) {
              setCurrentNodCount(newNodCount);
              if (newNodCount > sessionData.nodEvents) {
                setSessionData(prev => ({ ...prev, nodEvents: newNodCount }));
              }
            }
          }
        }
        
        // Handle other message types for settings/calibration
        if (data.type === 'eyetrack_states_data') {
          console.log('Received eyetrack states:', data.data);
        }
        
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error, 'Raw data:', event.data);
        // Don't crash on invalid messages, just continue with simulation
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected from backend');
      setWsStatus('disconnected');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsStatus('disconnected');
    };
    
    return () => {
      ws.close();
    };
  }, [isGazeActive, sessionData.nodEvents]);

  // Fallback simulation when real data is not available
  useEffect(() => {
    if (!isGazeActive) return;
    
    // Check if we haven't received real data in the last 2 seconds
    const needsFallback = () => {
      return !usingRealData || (Date.now() - lastRealDataTime > 2000);
    };

    const simulateGazeData = () => {
      // Only simulate if we're not receiving real data
      if (!needsFallback()) return;
      
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
  }, [isGazeActive, usingRealData, lastRealDataTime]);

  // Monitor real data availability and cleanup
  useEffect(() => {
    if (!isGazeActive) return;

    const checkDataStatus = () => {
      const timeSinceLastData = Date.now() - lastRealDataTime;
      if (usingRealData && timeSinceLastData > 5000) {
        if (!noDataWarnedRef.current) {
          console.warn('Real gaze data stopped, falling back to simulation');
          noDataWarnedRef.current = true;
        }
        setUsingRealData(false);
      }
      
      // Clean up old gaze data to prevent memory leaks
      if (gazeDataQueue.current.length > 1000) {
        gazeDataQueue.current.splice(0, gazeDataQueue.current.length - 500);
        console.log('Cleaned up old gaze data queue');
      }
      
      // Clean up session data if it gets too large
      if (fullSessionData.current.length > 10000) {
        const keep = fullSessionData.current.slice(-5000);
        fullSessionData.current.length = 0;
        fullSessionData.current.push(...keep);
        console.log('Cleaned up session data to prevent memory leak');
      }
    };

    const interval = setInterval(checkDataStatus, 1000);
    return () => clearInterval(interval);
  }, [isGazeActive, usingRealData, lastRealDataTime]);

  // Main processing loop with enhanced data handling and throttling
  useEffect(() => {
    if (!isGazeActive) return;
    
    let lastProcessTime = 0;
    const PROCESS_THROTTLE = 16; // ~60fps max

    const processGazeData = () => {
      const now = Date.now();
      
      // Throttle processing to prevent excessive CPU usage
      if (now - lastProcessTime < PROCESS_THROTTLE) {
        animationFrameRef.current = requestAnimationFrame(processGazeData);
        return;
      }
      lastProcessTime = now;

      // Process multiple packets per frame for efficiency, but limit to prevent blocking
      let processed = 0;
      const maxPerFrame = 5;
      
      while (gazeDataQueue.current.length > 0 && processed < maxPerFrame) {
        const packet = gazeDataQueue.current.shift()!;
        fullSessionData.current.push(packet);

        const hoveredElement = packet.gaze_valid === 1
          ? document.elementFromPoint(packet.gaze_pos_x, packet.gaze_pos_y)
          : null;

        if (
          hoveredElement &&
          (hoveredElement as HTMLElement).dataset.word &&
          vocabSetRef.current.has(
            ((hoveredElement as HTMLElement).dataset.word || '').toLowerCase()
          ) &&
          hoveredElement.id !== wordPopup?.wordId
        ) {
          const rect = (hoveredElement as HTMLElement).getBoundingClientRect();
          setWordPopup({
            visible: true,
            wordId: hoveredElement.id,
            word: (hoveredElement as HTMLElement).dataset.word || '',
            position: { top: rect.bottom, left: rect.left },
          });
        }

        // Skip expensive calculations if we're processing too many packets
        if (processed === 0) {
          if (prevGazeRef.current) {
            const dx = packet.gaze_pos_x - prevGazeRef.current.x;
            const dy = packet.gaze_pos_y - prevGazeRef.current.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 150) {
              // previously showed grammar hint overlay
            }
          }
          prevGazeRef.current = { x: packet.gaze_pos_x, y: packet.gaze_pos_y };
        }
        
        // Pass gaze coordinates and backend nod count for gesture detection
        try {
          processEvent(
            hoveredElement,
            packet.timestamp,
            packet.gaze_valid === 1
          );
        } catch (error) {
          console.error('Error processing gaze event:', error);
          // Continue processing other packets even if one fails
        }

        if (packet.gaze_valid === 1) {
          if (!fixationTracker.current) {
            fixationTracker.current = { startTime: packet.timestamp, x: packet.gaze_pos_x, y: packet.gaze_pos_y };
          } else {
            const dist = Math.hypot(packet.gaze_pos_x - fixationTracker.current.x, packet.gaze_pos_y - fixationTracker.current.y);
            if (dist > 50) {
              fixationTracker.current = { startTime: packet.timestamp, x: packet.gaze_pos_x, y: packet.gaze_pos_y };
            } else {
              const dur = packet.timestamp - fixationTracker.current.startTime;
              textTTSService.current.handleGazeFixation(packet.gaze_pos_x, packet.gaze_pos_y, dur);
            }
          }
        } else {
          fixationTracker.current = null;
        }

        if (currentNodCount > prevNodCountRef.current) {
          textTTSService.current.handleNodGesture(packet.gaze_pos_x, packet.gaze_pos_y);
          prevNodCountRef.current = currentNodCount;
        }

        processed++;
      }
      
      if (processed > 0) {
        setSessionData(prev => ({
          ...prev,
          readingTime: Date.now() - prev.startTime,
          gazeEvents: prev.gazeEvents + processed
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
  }, [isGazeActive, processEvent, currentNodCount, wordPopup]);

  const handleStartGazeTracking = () => {
    setIsGazeActive(true);
    resetSession();
    setSessionData(prev => ({ ...prev, startTime: Date.now() }));
  };

  const handleStopGazeTracking = () => {
    setIsGazeActive(false);
  };

  // Cycle through sentences when simulating a distraction demo
  const distractionIndexRef = useRef(0);
  const triggerDistractionDemo = useCallback(() => {
    const sentences = document.querySelectorAll('[id^="sentence-"]');
    if (sentences.length === 0) return;
    const id = `sentence-${distractionIndexRef.current}`;
    setDistractionElementId(id);
    distractionIndexRef.current = (distractionIndexRef.current + 1) % sentences.length;
    setTimeout(() => setDistractionElementId(null), 3000);

  }, []);

  const triggerNodDemo = useCallback(() => {
    setWordPopup({
      visible: true,
      wordId: 'demo',
      word: 'example',
      position: { top: window.innerHeight / 2, left: window.innerWidth / 2 - 120 }
    });
    setNewWords(prev => (prev.includes('example') ? prev : [...prev, 'example']));
  }, []);

  const triggerDoubleNodDemo = useCallback(() => {
    const word = wordPopup?.word || 'example';
    const settings = ttsService.getSettings();
    if (settings.enabled) {
      ttsService.speak(word, { rate: settings.rate * 0.8 }).catch((e) => console.error('TTS Demo Error:', e));
    }
  }, [wordPopup]);

  const triggerShakeDemo = useCallback(() => setWordPopup(null), []);

  const triggerGrammarDemo = useCallback(() => {
    // no-op: grammar hints now shown inline
  }, []);

  const showVocabCard = useCallback((index: number) => {
    if (vocabList.length === 0) return;
    const vocab = vocabList[index % vocabList.length];
    const element = document.querySelector(`[data-word="${vocab.word}"]`) as HTMLElement | null;
    const rect = element?.getBoundingClientRect();
    const position = rect
      ? { top: rect.bottom, left: rect.left }
      : { top: window.innerHeight / 2, left: window.innerWidth / 2 - 120 };
    setWordPopup({
      visible: true,
      wordId: element?.id || `vocab-${index}`,
      word: vocab.word,
      position,
    });
  }, [vocabList]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case '1':
          triggerDistractionDemo();
          break;
        case '2':
          setVocabIndex((prev) => {
            const next = (prev + 1) % (vocabList.length || 1);
            showVocabCard(next);
            return next;
          });
          break;
        case '3':
          triggerDoubleNodDemo();
          break;
        case '4':
          triggerShakeDemo();
          break;
        case '5':
          triggerGrammarDemo();
          break;
        case 'Escape':
          setWordPopup(null);
          setGrammarCard(null);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    triggerDistractionDemo,
    triggerDoubleNodDemo,
    triggerShakeDemo,
    triggerGrammarDemo,
    showVocabCard,
    vocabList
  ]);

  const handleFinishReading = async () => {
    setIsGazeActive(false);

    const stored = localStorage.getItem('reviewWords');
    const existing: string[] = stored ? JSON.parse(stored) : [];
    const updated = Array.from(new Set([...existing, ...newWords]));
    localStorage.setItem('reviewWords', JSON.stringify(updated));

    const positions: Record<string, { x: number; y: number; width: number; height: number }> = {};
    elementPositionsRef.current.forEach((rect, id) => {
      positions[id] = {
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height
      };
    });

    const sessionPayload = {
      gazeData: fullSessionData.current,
      sessionStats: sessionData,
      positions,
      newWords
    };

    localStorage.setItem(`session-${sessionId}`, JSON.stringify(sessionPayload));

    console.log('Uploading session data:', { sessionId, ...sessionPayload });
    
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
              <span>返回</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">沉浸式閱讀</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              時間：{formatTime(sessionData.readingTime)}
            </Badge>
            <Badge variant="secondary">
              注視：{sessionData.gazeEvents}
            </Badge>
            <Badge variant="secondary">
              互動：{sessionData.nodEvents}
            </Badge>
            <Badge
              variant="secondary"
              className={
                wsStatus === 'connected'
                  ? 'bg-green-100 text-green-800'
                  : wsStatus === 'connecting'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }
            >
              {wsStatus === 'connected'
                ? '已連線'
                : wsStatus === 'connecting'
                ? '連線中'
                : '未連線'}
            </Badge>
            <Badge
              variant="secondary" 
              className={
                usingRealData
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
              }
            >
              {usingRealData ? '🎯 真實數據' : '🎭 模擬模式'}
            </Badge>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleTTS}
              variant={ttsEnabled ? 'default' : 'outline'}
              size="sm"
            >
              {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {ttsEnabled ? 'TTS ON' : 'TTS OFF'}
            </Button>

            <Button onClick={() => setShowTTSSettings(!showTTSSettings)} variant="outline" size="sm">
              <Settings className="h-4 w-4" />
              TTS Settings
            </Button>
          </div>
        </div>



        {/* Enhanced Controls */}
        <SmartReadingControl
          isGazeActive={isGazeActive}
          ttsEnabled={ttsEnabled}
          onToggleTTS={() => {
            const newVal = !ttsEnabled;
            textTTSService.current.updateSettings({ enabled: newVal });
            setTTSEnabled(newVal);
          }}
          onStartGaze={handleStartGazeTracking}
          onStopGaze={handleStopGazeTracking}
          onShowTTSSettings={() => setShowTTSSettings(true)}
          onPlayTTS={speakAll}
          onStopTTS={() => textTTSService.current.stop()}
          onFinishReading={handleFinishReading}
        />

        {/* Reading Text */}
        <Card>
          <CardContent className="p-8">
            <div ref={textDisplayRef}>
              <TextDisplay
                textContent={textContent}
                elementPositionsRef={elementPositionsRef}
                distractionElementId={distractionElementId}
                annotations={annotations}
              />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Instructions */}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>智慧閱讀功能：</strong></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>• <strong>單字協助：</strong>注視困難單字即可看到定義</p>
                  <p>• <strong>快速查詢：</strong>輕點頭一次立即取得單字資訊</p>
                  <p>• <strong>發音：</strong>點頭兩次聆聽單字發音</p>
                </div>
                <div>
                  <p>• <strong>文法協助：</strong>重新閱讀句子會顯示文法提示</p>
                  <p>• <strong>專注助手：</strong>保持專注以避免提醒</p>
                  <p>• <strong>進度追蹤：</strong>所有互動都會自動記錄</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex justify-between">
              示範模式
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => setDemoMode(!demoMode)}>
                  {demoMode ? '隱藏' : '顯示'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDemoContent(!demoContent)}>
                  {demoContent ? '關閉範例' : '預設範例'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          {demoMode && (
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button onClick={triggerDistractionDemo}>觸發分心</Button>
                <Button onClick={triggerNodDemo}>點頭一次</Button>
                <Button onClick={triggerDoubleNodDemo}>點頭兩次</Button>
                <Button onClick={triggerShakeDemo} variant="outline">搖頭</Button>
                <Button onClick={triggerGrammarDemo} variant="outline">Grammar Help</Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                快捷鍵 1-5 可直接觸發以上示範效果
              </p>
            </CardContent>
          )}
        </Card>
      </div>



      {wordPopup && (
        <WordPopup
          word={wordPopup.word}
          position={wordPopup.position}
          entry={vocabList.find(
            (v) => v.word.toLowerCase() === wordPopup.word.toLowerCase()
          )}
          onClose={() => setWordPopup(null)}
          onFollowAlong={(text, pos) =>
            setFollowAlongTarget({ text, position: { x: pos.left, y: pos.top } })
          }
        />
      )}

      {grammarCard && (
        <GrammarCard
          sentence={grammarCard.sentence}
          position={grammarCard.position}
          onClose={() => setGrammarCard(null)}
          onFollowAlong={(text, pos) =>
            setFollowAlongTarget({ text, position: { x: pos.left, y: pos.top } })
          }
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

      {showTTSSettings && (
        <TTSSettingsPanel service={textTTSService.current} onClose={() => setShowTTSSettings(false)} />
      )}
      {/* Grammar hint overlay removed in favor of inline annotations */}
    </div>
  );
};
