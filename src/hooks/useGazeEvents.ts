
import { useRef, useCallback } from 'react';

interface GazeEventHandlers {
  onFixation: (payload: { wordId: string; element: HTMLElement; word: string }) => void;
  onRegression: (payload: { sentenceId: string; element: HTMLElement; sentence: string }) => void;
  onDistraction: () => void;
}

export const useGazeEvents = (handlers: GazeEventHandlers) => {
  const fixationRef = useRef<{ wordId: string | null; startTime: number }>({ 
    wordId: null, 
    startTime: 0 
  });
  const maxReadSentenceIndexRef = useRef<number>(0);
  const lastValidGazeTime = useRef<number>(Date.now());

  const processEvent = useCallback((hoveredElement: Element | null, timestamp: number, gazeValid: boolean) => {
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
      } else if (wordId === fixationRef.current.wordId) {
        // Continuing fixation on same word
        const fixationDuration = timestamp - fixationRef.current.startTime;
        if (fixationDuration > 800) {
          // Trigger word lookup
          handlers.onFixation({ 
            wordId, 
            element: hoveredElement as HTMLElement,
            word: wordText
          });
          // Reset to prevent repeated triggers
          fixationRef.current = { wordId: null, startTime: 0 };
        }
      }
    } else {
      // Not on a word, reset fixation
      fixationRef.current = { wordId: null, startTime: 0 };
    }

    // 2. Regression Detection (Grammar Help)
    const sentenceElement = hoveredElement?.closest('[id^="sentence-"]') as HTMLElement;
    if (sentenceElement?.id.startsWith('sentence-')) {
      const sentenceId = sentenceElement.id;
      const currentIndex = parseInt(sentenceId.split('-')[1]);
      
      if (currentIndex < maxReadSentenceIndexRef.current) {
        // Regression detected
        const sentenceText = sentenceElement.textContent || '';
        handlers.onRegression({ 
          sentenceId, 
          element: sentenceElement,
          sentence: sentenceText
        });
      } else {
        maxReadSentenceIndexRef.current = Math.max(maxReadSentenceIndexRef.current, currentIndex);
      }
    }

    // 3. Distraction Detection
    const timeSinceLastValidGaze = timestamp - lastValidGazeTime.current;
    if (!gazeValid || !hoveredElement || timeSinceLastValidGaze > 2000) {
      handlers.onDistraction();
    }
  }, [handlers]);

  const resetSession = useCallback(() => {
    fixationRef.current = { wordId: null, startTime: 0 };
    maxReadSentenceIndexRef.current = 0;
    lastValidGazeTime.current = Date.now();
  }, []);

  return { processEvent, resetSession };
};
