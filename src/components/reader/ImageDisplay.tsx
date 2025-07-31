import { useEffect } from 'react';

interface ImageDisplayProps {
  id: string;
  src: string;
  text: string;
  isHighlighted?: boolean;
  autoSpeak?: boolean;
}

export const ImageDisplay = ({ id, src, text, isHighlighted = false, autoSpeak = false }: ImageDisplayProps) => {
  useEffect(() => {
    if (autoSpeak && isHighlighted && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  }, [autoSpeak, isHighlighted, text]);

  return (
    <img
      id={id}
      src={src}
      alt={text}
      className={`mx-auto rounded shadow transition-transform duration-300 ${isHighlighted ? 'scale-125 ring-2 ring-blue-300' : 'scale-100'}`}
    />
  );
};

export default ImageDisplay;
