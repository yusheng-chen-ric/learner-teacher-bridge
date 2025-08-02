import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageDisplay from '@/components/reader/ImageDisplay';
import SmartReadingControl from '@/components/SmartReadingControl';
import { TTSSettingsPanel } from '@/components/TTSSettingsPanel';
import { ttsService } from '@/services/TTSService';
import { TextContentTTSService } from '@/services/TextContentTTSService';

// Pages for the short story. Images are served from the public folder
const pages = [
  {
    id: 'img1',
    src: '/image/image1.png',
    text: 'In the light of the moon a little egg lay on a leaf.',
  },
  {
    id: 'img2',
    src: '/image/image2.png',
    text: 'One Sunday morning the warm sun came up and -pop! -out of the egg came a tiny and very hungry caterpillar.'
  },
  {
    id: 'img3',
    src: '/image/image3.png',
    text: 'On Wednesday he ate through three plums, but he was still hungry.'
  }
];

export const ImageReaderPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [focusId, setFocusId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isGazeActive, setIsGazeActive] = useState(false);
  const [ttsEnabled, setTTSEnabled] = useState(ttsService.getSettings().enabled);
  const [showTTSSettings, setShowTTSSettings] = useState(false);
  const textTTSService = useRef<TextContentTTSService>(new TextContentTTSService());

  useEffect(() => {
    const interval = setInterval(() => {
      const settings = textTTSService.current.getSettings();
      setTTSEnabled(settings.enabled);
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setUploadedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const speak = useCallback((text: string) => {
    textTTSService.current
      .speakText(text)
      .catch((e) => console.error('TTS Error:', e));
  }, []);

  const triggerDistraction = useCallback((id: string) => {
    setFocusId(id);
    speak(pages.find(i => i.id === id)?.text || '');
    setTimeout(() => setFocusId(null), 3000);
  }, [speak]);

  const toggleTTS = useCallback(() => {
    const newVal = !ttsEnabled;
    textTTSService.current.updateSettings({ enabled: newVal });
    setTTSEnabled(newVal);
  }, [ttsEnabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case '1':
          triggerDistraction(pages[pageIndex].id);
          break;
        case '2':
          setPageIndex(p => Math.min(pages.length - 1, p + 1));
          break;
        case '3':
          setPageIndex(p => Math.max(0, p - 1));
          break;
        case '4':
          toggleTTS();
          break;
        case '5':
          setShowTTSSettings(true);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageIndex, toggleTTS, triggerDistraction]);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">圖片閱讀</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate('/')}>返回</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const page = pages[pageIndex];
              return (
                <div key={page.id} className="space-y-2 text-center">
                  <ImageDisplay id={page.id} src={page.src} text={page.text} isHighlighted={focusId === page.id} />
                <p className="text-sm">{page.text}</p>
                <Button size="sm" onClick={() => speak(page.text)}>
                  朗讀
                </Button>
              </div>
            );
          })()}
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setPageIndex(p => Math.max(0, p - 1))} disabled={pageIndex === 0}>
              上一頁
            </Button>
            <Button variant="outline" onClick={() => setPageIndex(p => Math.min(pages.length - 1, p + 1))} disabled={pageIndex === pages.length - 1}>
              下一頁
            </Button>
          </div>
          
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
        <SmartReadingControl
          isGazeActive={isGazeActive}
          ttsEnabled={ttsEnabled}
          onToggleTTS={toggleTTS}
          onStartGaze={() => setIsGazeActive(true)}
          onStopGaze={() => setIsGazeActive(false)}
          onShowTTSSettings={() => setShowTTSSettings(true)}
          onPlayTTS={() => speak(pages[pageIndex].text)}
          onStopTTS={() => textTTSService.current.stop()}
          showReportButton={false}
        />
      </div>
      {showTTSSettings && (
        <TTSSettingsPanel service={textTTSService.current} onClose={() => setShowTTSSettings(false)} />
      )}
    </div>
  );
};

export default ImageReaderPage;
