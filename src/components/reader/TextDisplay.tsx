
import { useEffect, useMemo, RefObject } from 'react';

interface TextDisplayProps {
  textContent: string;
  elementPositionsRef: RefObject<Map<string, DOMRect>>;
  distractionElementId: string | null;
  annotations?: Record<string, string>;
}

export const TextDisplay = ({ textContent, elementPositionsRef, distractionElementId, annotations = {} }: TextDisplayProps) => {
  
  const atomizedText = useMemo(() => {
    // Split text into sentences
    const sentences = textContent.split(/([.!?]+\s*)/).filter(s => s.trim());
    let sentenceIndex = 0;
    let wordIndex = 0;
    
    return sentences.map((sentence, index) => {
      // Handle punctuation
      if (/^[.!?]+\s*$/.test(sentence)) {
        return <span key={`punct-${index}`}>{sentence}</span>;
      }

      const currentSentenceIndex = sentenceIndex++;
      const words = sentence.trim().split(/(\s+)/);

      const sentenceSpan = (
        <span
          key={`sentence-${currentSentenceIndex}`}
          id={`sentence-${currentSentenceIndex}`}
          className={`inline ${distractionElementId === `sentence-${currentSentenceIndex}` ? 'text-xl font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded transition-all duration-300' : ''}`}
        >
          {words.map((word, wIndex) => {
            if (/^\s+$/.test(word)) {
              return <span key={`space-${currentSentenceIndex}-${wIndex}`}>{word}</span>;
            }

            const currentWordIndex = wordIndex++;
            const cleanWord = word.replace(/[^\w]/g, '');

            if (!cleanWord) {
              return <span key={`punct-word-${currentSentenceIndex}-${wIndex}`}>{word}</span>;
            }

            return (
              <span
                key={`word-${currentWordIndex}`}
                id={`word-${currentWordIndex}`}
                className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                data-word={cleanWord}
              >
                {word}
              </span>
            );
          })}
        </span>
      );

      const annotation = annotations[`sentence-${currentSentenceIndex}`];
      if (annotation) {
        return (
          <div key={`wrapper-${currentSentenceIndex}`} className="mb-4">
            {sentenceSpan}
            <div className="mt-1 text-xs text-gray-600">{annotation}</div>
          </div>
        );
      }

      return <span key={`wrapper-${currentSentenceIndex}`}>{sentenceSpan}</span>;
    });
  }, [textContent, distractionElementId, annotations]);

  // Calculate element positions after render
  useEffect(() => {
    const updatePositions = () => {
      if (!elementPositionsRef.current) return;
      
      const positions = new Map<string, DOMRect>();
      
      // Get all word and sentence elements
      const elements = document.querySelectorAll('[id^="word-"], [id^="sentence-"]');
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        positions.set(element.id, rect);
      });
      
      // Create new Map and assign it to the ref
      const newPositions = new Map(positions);
      if (elementPositionsRef.current) {
        elementPositionsRef.current.clear();
        positions.forEach((value, key) => {
          elementPositionsRef.current!.set(key, value);
        });
      }
    };

    // Update positions after DOM is ready
    const timer = setTimeout(updatePositions, 100);
    
    // Update positions on window resize
    const handleResize = () => {
      updatePositions();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [atomizedText, elementPositionsRef, annotations]);

  return (
    <div className="text-lg leading-relaxed select-none" style={{ lineHeight: '2.2' }}>
      {atomizedText}
    </div>
  );
};
