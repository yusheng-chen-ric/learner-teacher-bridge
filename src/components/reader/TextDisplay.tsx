
import { useEffect, useMemo, RefObject } from 'react';

interface TextDisplayProps {
  textContent: string;
  elementPositionsRef: RefObject<Map<string, DOMRect>>;
  distractionElementId: string | null;
}

export const TextDisplay = ({ textContent, elementPositionsRef, distractionElementId }: TextDisplayProps) => {
  
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
      
      return (
        <span 
          key={`sentence-${currentSentenceIndex}`}
          id={`sentence-${currentSentenceIndex}`}
          className={`inline ${distractionElementId === `sentence-${currentSentenceIndex}` ? 'text-xl font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded transition-all duration-300' : ''}`}
        >
          {words.map((word, wIndex) => {
            // Handle whitespace
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
    });
  }, [textContent, distractionElementId]);

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
      
      elementPositionsRef.current = positions;
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
  }, [atomizedText, elementPositionsRef]);

  return (
    <div className="text-lg leading-relaxed select-none" style={{ lineHeight: '2.2' }}>
      {atomizedText}
    </div>
  );
};
