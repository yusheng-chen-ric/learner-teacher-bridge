import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageDisplay from '@/components/reader/ImageDisplay';

// Pages for the short story. Images are served from the public folder
const pages = [
  {
    id: 'img1',
    src: '/image/sample.png',
    text: 'Emma has been learning English for two years.'
  },
  {
    id: 'img2',
    src: '/placeholder.svg',
    text: 'She practices with her friends every day.'
  },
  {
    id: 'img3',
    src: '/image/sample.png',
    text: 'Reading short stories helps her improve quickly.'
  }
];

export const ImageReaderPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [focusId, setFocusId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setUploadedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

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
    speak(pages.find(i => i.id === id)?.text || '');
    setTimeout(() => setFocusId(null), 3000);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Image Reading Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(() => {
            const page = pages[pageIndex];
            return (
              <div key={page.id} className="space-y-2 text-center">
                <ImageDisplay id={page.id} src={page.src} text={page.text} isHighlighted={focusId === page.id} />
                <p className="text-sm">{page.text}</p>
                <Button size="sm" onClick={() => speak(page.text)}>
                  Speak
                </Button>
              </div>
            );
          })()}
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setPageIndex(p => Math.max(0, p - 1))} disabled={pageIndex === 0}>
              Previous
            </Button>
            <Button variant="outline" onClick={() => setPageIndex(p => Math.min(pages.length - 1, p + 1))} disabled={pageIndex === pages.length - 1}>
              Next
            </Button>
          </div>
          <Button variant="outline" onClick={() => triggerDistraction(pages[pageIndex].id)}>
            Simulate Distraction
          </Button>
          <div className="pt-4 space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="reader-image-upload"
              className="hidden"
            />
            <label htmlFor="reader-image-upload">
              <Button variant="outline" size="sm" asChild>
                <div>上傳圖片</div>
              </Button>
            </label>
            {uploadedImage && (
              <ImageDisplay id="uploaded" src={uploadedImage} text="Uploaded image" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageReaderPage;
