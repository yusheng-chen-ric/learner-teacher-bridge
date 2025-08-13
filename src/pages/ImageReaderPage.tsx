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
  const [readingIndicator, setReadingIndicator] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  useEffect(() => {
    // 設置初始語速為 0.1
    textTTSService.current.updateSettings({ rate: 0.1 });
    
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

  // 添加一個簡化的測試朗讀函數
  const testSpeak = useCallback((text: string) => {
    console.log('測試朗讀:', text);
    
    // 檢查瀏覽器是否支持 speechSynthesis
    if (!('speechSynthesis' in window)) {
      console.error('瀏覽器不支持 speechSynthesis');
      alert('您的瀏覽器不支持語音合成功能');
      return;
    }

    // 直接使用瀏覽器 API 進行測試
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.1;
    utterance.volume = 0.8;
    utterance.lang = 'en-US';
    
    utterance.onstart = () => {
      console.log('測試朗讀開始');
    };
    
    utterance.onend = () => {
      console.log('測試朗讀結束');
    };
    
    utterance.onerror = (error) => {
      console.error('測試朗讀錯誤:', error);
    };
    
    speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback((text: string) => {
    console.log('開始朗讀，文字內容:', text);
    console.log('TTS 設置:', textTTSService.current.getSettings());
    
    // 檢查 TTS 是否啟用
    const settings = textTTSService.current.getSettings();
    if (!settings.enabled) {
      console.warn('TTS 未啟用，正在啟用...');
      textTTSService.current.updateSettings({ enabled: true });
    }

    // 找到當前頁面的文字元素
    const textElement = document.querySelector(`p.text-large`);
    console.log('找到的文字元素:', textElement);
    
    if (!textElement) {
      console.warn('找不到文字元素，嘗試替代方案');
      // 直接使用簡化版本進行朗讀
      textTTSService.current
        .speakText(text)
        .then(() => {
          console.log('簡化朗讀完成');
        })
        .catch((e) => {
          console.error('簡化朗讀錯誤:', e);
        });
      return;
    }

    const calculateWordPositions = (text: string, element: HTMLElement) => {
      const positions: { x: number; y: number; word: string }[] = [];
      const words = text.split(/(\s+)/); // 保留空格
      let charIndex = 0;
      
      // 創建 range 來測量每個字詞的位置
      const range = document.createRange();
      const textNode = element.firstChild as Text;
      
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
        console.warn('文字節點不存在，使用元素本身');
        // 嘗試使用元素的位置
        const rect = element.getBoundingClientRect();
        words.forEach((word, index) => {
          if (word.trim()) {
            positions.push({
              x: rect.left + (index * 20) + rect.width / 2,
              y: rect.bottom + 5,
              word: word.trim()
            });
          }
        });
        return positions;
      }

      words.forEach((word, wordIndex) => {
        if (word.trim()) { // 只處理非空白的字詞
          try {
            range.setStart(textNode, charIndex);
            range.setEnd(textNode, charIndex + word.length);
            const rect = range.getBoundingClientRect();
            
            positions.push({
              x: rect.left + rect.width / 2,
              y: rect.bottom + 5, // 文字下方 5px
              word: word.trim()
            });
          } catch (error) {
            console.warn(`無法測量字詞 "${word}" 的位置:`, error);
            // 使用備用位置
            const elementRect = element.getBoundingClientRect();
            positions.push({
              x: elementRect.left + (wordIndex * 20),
              y: elementRect.bottom + 5,
              word: word.trim()
            });
          }
        }
        charIndex += word.length;
      });
      
      return positions;
    };

    // 計算所有字詞的位置
    const wordPositions = calculateWordPositions(text, textElement as HTMLElement);
    console.log('字詞位置:', wordPositions);

    textTTSService.current
      .speakText(text, undefined, {
        onBoundary: (charIndex: number, charLength: number) => {
          console.log(`邊界事件: charIndex=${charIndex}, charLength=${charLength}`);
          
          // 根據字符索引找到對應的字詞
          const currentText = text.substring(0, charIndex + charLength);
          const currentWords = currentText.split(/\s+/).filter(w => w.trim());
          const currentWordIndex = Math.max(0, currentWords.length - 1);
          
          console.log(`當前字詞索引: ${currentWordIndex}, 總字詞數: ${wordPositions.length}`);
          
          if (wordPositions[currentWordIndex]) {
            const position = wordPositions[currentWordIndex];
            setReadingIndicator({
              x: position.x,
              y: position.y,
              visible: true
            });
            
            console.log(`朗讀字詞: "${position.word}" 位置: (${position.x}, ${position.y})`);
          }
        }
      })
      .then(() => {
        setReadingIndicator(prev => ({ ...prev, visible: false }));
        console.log('朗讀完成');
      })
      .catch((e) => {
        console.error('TTS Error:', e);
        setReadingIndicator(prev => ({ ...prev, visible: false }));
      });
  }, []);

  const triggerDistraction = useCallback((id: string) => {
    setFocusId(id);
    // 移除朗讀功能，只保留圖片高亮效果
    // speak(pages.find(i => i.id === id)?.text || '');
    setTimeout(() => setFocusId(null), 3000);
  }, []);

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
        case '9':
          speak(pages[pageIndex].text);
          break;
        case '0':
          // 測試鍵：直接使用瀏覽器 API 朗讀
          testSpeak(pages[pageIndex].text);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageIndex, toggleTTS, triggerDistraction, speak, testSpeak]);

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
                <p className="text-large">{page.text}</p>
                <Button size="sm" onClick={() => speak(page.text)}>
                  朗讀
                </Button>
                <Button size="sm" variant="outline" onClick={() => testSpeak(page.text)}>
                  測試朗讀
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
        
        {/* 調試信息面板 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">調試信息</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>TTS 啟用: {ttsEnabled ? '是' : '否'}</div>
            <div>語速: {textTTSService.current.getSettings().rate}</div>
            <div>音量: {textTTSService.current.getSettings().volume}</div>
            <div>語言: {textTTSService.current.getSettings().language}</div>
            <div>瀏覽器支持: {'speechSynthesis' in window ? '是' : '否'}</div>
            <div>快捷鍵說明:</div>
            <div className="text-xs text-gray-600">
              • 鍵盤 1: 圖片高亮效果 (不朗讀)
              <br />
              • 鍵盤 9: 正常朗讀 (帶紅點)
              <br />
              • 鍵盤 0: 測試朗讀 (直接使用瀏覽器 API)
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

      {/* 朗讀進度紅點指示器 */}
      {readingIndicator.visible && (
        <div
          className="fixed w-4 h-4 bg-red-500 rounded-full pointer-events-none z-50 animate-bounce shadow-lg border-2 border-white"
          style={{
            left: `${readingIndicator.x}px`,
            top: `${readingIndicator.y}px`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.6)'
          }}
        >
          {/* 內圈光暈效果 */}
          <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
        </div>
      )}
    </div>
  );
};

export default ImageReaderPage;
