
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, BookOpen, Eye, Zap } from 'lucide-react';

interface ReadingModeSelectorProps {
  onStartReading: (mode: 'assignment' | 'selfpaced', assignmentId?: string) => void;
}

export const ReadingModeSelector = ({ onStartReading }: ReadingModeSelectorProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_TEXT_LENGTH = 10000;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('檔案過大，請選擇 2MB 以下的檔案');
      return;
    }

    const text = await file.text();
    if (text.length > MAX_TEXT_LENGTH) {
      alert('文章太長，請選擇較短的文章');
      return;
    }

    setSelectedFile(file);
  };

  const startSelfPacedReading = () => {
    if (selectedFile) {
      onStartReading('selfpaced');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Smart Reading Mode */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <Eye className="h-5 w-5 mr-2" />
            智慧閱讀模式
          </CardTitle>
          <Badge className="bg-green-100 text-green-800 w-fit">
            <Zap className="h-3 w-3 mr-1" />
            AI 驅動
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-green-600 space-y-2">
            <p>✨ <strong>智慧單字查詢</strong> - 注視困難單字即可顯示定義</p>
            <p>🎯 <strong>文法協助</strong> - 重新閱讀句子即可取得提示</p>
            <p>🔊 <strong>即時發音</strong> - 點頭即可播放語音</p>
            <p>📊 <strong>專注追蹤</strong> - 溫和提醒保持注意力</p>
          </div>
          
          <div className="pt-4">
            <input
              type="file"
              accept=".txt,.pdf,.epub"
              onChange={handleFileUpload}
              className="hidden"
              id="smart-file-upload"
            />
            <label htmlFor="smart-file-upload">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
                asChild
              >
                <div className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  上傳文章進行智慧閱讀
                </div>
              </Button>
            </label>
            
            {selectedFile && (
              <div className="mt-2 p-2 bg-white rounded border">
                <p className="text-xs text-gray-600">已選擇：{selectedFile.name}</p>
                <Button 
                  onClick={startSelfPacedReading}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  開始智慧閱讀
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Traditional Reading Mode */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <BookOpen className="h-5 w-5 mr-2" />
            傳統閱讀
          </CardTitle>
          <Badge variant="secondary" className="w-fit">
            傳統模式
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-blue-600 space-y-2">
            <p>📖 <strong>專注閱讀流程</strong> - 幾乎不被打擾</p>
            <p>⏱️ <strong>閱讀計時</strong> - 追蹤閱讀速度</p>
            <p>📈 <strong>進度分析</strong> - 事後檢視閱讀模式</p>
            <p>🎨 <strong>簡潔介面</strong> - 無干擾的閱讀環境</p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={() => onStartReading('selfpaced')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            開始傳統閱讀
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
