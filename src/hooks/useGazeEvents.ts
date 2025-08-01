import { useRef, useCallback } from 'react';
import { ttsService } from '@/services/TTSService';

interface GazeEventHandlers {
  onFixation: (payload: { wordId: string; element: HTMLElement; word: string }) => void;
  onRegression: (payload: { sentenceId: string; element: HTMLElement; sentence: string }) => void;
  onDistraction: (payload: { sentenceId: string | null }) => void;
  onNodOnce: (payload: { wordId: string; element: HTMLElement; word: string }) => void;
  onNodTwice: (payload: { wordId: string; element: HTMLElement; word: string }) => void;
  onShake: () => void;
}

export const useGazeEvents = (handlers: GazeEventHandlers) => {
  const fixationRef = useRef<{ wordId: string | null; startTime: number }>({ 
    wordId: null, 
    startTime: 0 
  });
  const maxReadSentenceIndexRef = useRef<number>(0);
  const lastValidGazeTime = useRef<number>(Date.now());
  const nodDetectionRef = useRef<{
    wordId: string | null;
    verticalMovements: number[];
    lastMovementTime: number;
  }>({
    wordId: null,
    verticalMovements: [],
    lastMovementTime: 0
  });
  const shakeDetectionRef = useRef<{ xMovements: number[]; lastTime: number }>({ xMovements: [], lastTime: 0 });
  const lastSentenceIdRef = useRef<string | null>(null);
  const wordPopupVisibleRef = useRef<boolean>(false);
  const setWordPopupVisible = useCallback((visible: boolean) => {
    wordPopupVisibleRef.current = visible;
  }, []);

  const processEvent = useCallback(
    (
      hoveredElement: Element | null,
      timestamp: number,
      gazeValid: boolean,
      gazeX?: number,
      gazeY?: number
    ) => {
    // Update last valid gaze time for distraction detection
    if (gazeValid && hoveredElement) {
      lastValidGazeTime.current = timestamp;
    }

    // 1. Long Fixation Detection (Word Lookup)
    if (hoveredElement?.id.startsWith('word-')) {
      const wordId = hoveredElement.id;
      const wordText = hoveredElement.textContent || '';

      if (wordId !== fixationRef.current.wordId) {
        // New word fixation started
        fixationRef.current = { wordId, startTime: timestamp };
        // Reset nod detection for new word
        nodDetectionRef.current = { wordId, verticalMovements: [], lastMovementTime: timestamp };
      } else if (wordId === fixationRef.current.wordId) {
        // Continuing fixation on same word
        const fixationDuration = timestamp - fixationRef.current.startTime;
        
        // Detect nodding patterns (simulated through vertical gaze movements)
        if (gazeY !== undefined) {
          const timeSinceLastMovement = timestamp - nodDetectionRef.current.lastMovementTime;
          
          // Record vertical movement if it's significant and recent
          if (timeSinceLastMovement > 100 && timeSinceLastMovement < 2000) {
            nodDetectionRef.current.verticalMovements.push(gazeY);
            nodDetectionRef.current.lastMovementTime = timestamp;
            
            // Keep only recent movements (last 2 seconds)
            nodDetectionRef.current.verticalMovements = nodDetectionRef.current.verticalMovements
              .filter((_, index) => index >= nodDetectionRef.current.verticalMovements.length - 10);
            
            // Detect single nod pattern (one significant vertical movement)
            if (nodDetectionRef.current.verticalMovements.length === 2) {
              const movement = Math.abs(
                nodDetectionRef.current.verticalMovements[1] -
                  nodDetectionRef.current.verticalMovements[0]
              );
              if (movement > 20) {
                handlers.onNodOnce({ wordId, element: hoveredElement as HTMLElement, word: wordText });
                const settings = ttsService.getSettings();
                if (settings.enabled) {
                  ttsService
                    .speak(wordText, { rate: settings.rate * 0.8 })
                    .catch((e) => console.error('TTS Error on nod:', e));
                }
                nodDetectionRef.current.verticalMovements = [];
              }
            }
            
            // Detect double nod pattern (two significant vertical movements)
            if (nodDetectionRef.current.verticalMovements.length >= 4) {
              const movements = nodDetectionRef.current.verticalMovements;
              const firstNod = Math.abs(movements[1] - movements[0]);
              const secondNod = Math.abs(movements[3] - movements[2]);
              
              if (firstNod > 20 && secondNod > 20) {
                handlers.onNodTwice({ wordId, element: hoveredElement as HTMLElement, word: wordText });
                const settings = ttsService.getSettings();
                if (settings.enabled) {
                  ttsService
                    .speak(wordText, { rate: settings.rate * 0.8 })
                    .catch((e) => console.error('TTS Error on nod:', e));
                }
                nodDetectionRef.current.verticalMovements = [];
              }
            }
          }
        }
        
        // Traditional fixation detection for word lookup
        if (fixationDuration > 800) {
          handlers.onFixation({ wordId, element: hoveredElement as HTMLElement, word: wordText });
          const settings = ttsService.getSettings();
          if (settings.enabled && settings.autoSpeak) {
            ttsService.speak(wordText).catch((e) => console.error('TTS Error on fixation:', e));
          }
          fixationRef.current = { wordId: null, startTime: 0 };
        }
      }
    } else {
      // Not on a word, reset fixation and nod detection
      fixationRef.current = { wordId: null, startTime: 0 };
      nodDetectionRef.current = { wordId: null, verticalMovements: [], lastMovementTime: 0 };
    }

    // 2. Regression Detection (Grammar Help)
    const sentenceElement = hoveredElement?.closest('[id^="sentence-"]') as HTMLElement;
    if (sentenceElement?.id.startsWith('sentence-')) {
      const sentenceId = sentenceElement.id;
      const currentIndex = parseInt(sentenceId.split('-')[1]);

      lastSentenceIdRef.current = sentenceId;
      
      if (currentIndex < maxReadSentenceIndexRef.current) {
        // Regression detected
        const sentenceText = sentenceElement.textContent || '';
        handlers.onRegression({ sentenceId, element: sentenceElement, sentence: sentenceText });
        const settings = ttsService.getSettings();
        if (settings.enabled && settings.autoSpeak) {
          ttsService
            .speak(sentenceText, { rate: settings.rate * 0.9 })
            .catch((e) => console.error('TTS Error on regression:', e));
        }
      } else {
        maxReadSentenceIndexRef.current = Math.max(maxReadSentenceIndexRef.current, currentIndex);
      }
    }

    // 3. Distraction Detection
    const timeSinceLastValidGaze = timestamp - lastValidGazeTime.current;
    if (!gazeValid || !hoveredElement || timeSinceLastValidGaze > 3000) {
      handlers.onDistraction({ sentenceId: lastSentenceIdRef.current });
    }

    // 4. Shake Detection for closing popups
    if (wordPopupVisibleRef.current && !hoveredElement?.closest('[data-word-popup]')) {
      if (gazeX !== undefined) {
        const dt = timestamp - shakeDetectionRef.current.lastTime;
        if (dt < 400) {
          shakeDetectionRef.current.xMovements.push(gazeX);
        } else {
          shakeDetectionRef.current.xMovements = [gazeX];
        }
        shakeDetectionRef.current.lastTime = timestamp;
        const len = shakeDetectionRef.current.xMovements.length;
        if (len >= 3) {
          const a = shakeDetectionRef.current.xMovements[len - 3];
          const b = shakeDetectionRef.current.xMovements[len - 2];
          const c = shakeDetectionRef.current.xMovements[len - 1];
          if (Math.abs(b - a) > 20 && Math.abs(c - b) > 20 && Math.sign(b - a) !== Math.sign(c - b)) {
            handlers.onShake();
            shakeDetectionRef.current.xMovements = [];
          }
        }
      }
    } else {
      shakeDetectionRef.current.xMovements = [];
    }
  }, [handlers]);

  const resetSession = useCallback(() => {
    fixationRef.current = { wordId: null, startTime: 0 };
    maxReadSentenceIndexRef.current = 0;
    lastValidGazeTime.current = Date.now();
    nodDetectionRef.current = { wordId: null, verticalMovements: [], lastMovementTime: 0 };
  }, []);

  return { processEvent, resetSession, setWordPopupVisible };
};
