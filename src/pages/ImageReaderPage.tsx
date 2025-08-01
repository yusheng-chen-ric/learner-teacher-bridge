import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageDisplay from '@/components/reader/ImageDisplay';

// Load png images from the public/image folder
const items = [
  {
    id: 'img1',
    src: '/image/sample.png',
    text: 'Emma has been learning English for two years.'
  }
];

export const ImageReaderPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [focusId, setFocusId] = useState<string | null>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.9;
      speechSynthesis.speak(u);
    }
  };

  const triggerDistraction = (id: string) => {
    setFocusId(id);
    speak(items.find(i => i.id === id)?.text || '');
    setTimeout(() => setFocusId(null), 3000);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Image Reading Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {items.map(item => (
            <div key={item.id} className="space-y-2">
              <ImageDisplay id={item.id} src={item.src} text={item.text} isHighlighted={focusId === item.id} />
              <Button size="sm" onClick={() => speak(item.text)}>
                Speak
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => triggerDistraction(items[0].id)}>
            Simulate Distraction
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageReaderPage;
