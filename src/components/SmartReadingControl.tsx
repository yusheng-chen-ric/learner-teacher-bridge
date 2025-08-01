import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Save, Volume2, Square, Settings } from 'lucide-react';

interface SmartReadingControlProps {
  isGazeActive: boolean;
  ttsEnabled: boolean;
  onToggleTTS: () => void;
  onStartGaze: () => void;
  onStopGaze: () => void;
  onShowTTSSettings: () => void;
  onStopTTS: () => void;
  onFinishReading?: () => void;
  showReportButton?: boolean;
}

export const SmartReadingControl = ({
  isGazeActive,
  ttsEnabled,
  onToggleTTS,
  onStartGaze,
  onStopGaze,
  onShowTTSSettings,
  onStopTTS,
  onFinishReading,
  showReportButton = true,
}: SmartReadingControlProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">智慧閱讀控制</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!isGazeActive ? (
            <Button
              onClick={onStartGaze}
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>開始智慧閱讀</span>
            </Button>
          ) : (
            <Button
              onClick={onStopGaze}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <EyeOff className="h-4 w-4" />
              <span>暫停追蹤</span>
            </Button>
          )}

          {isGazeActive && (
            <Badge className="bg-green-100 text-green-800">👁️ AI 助理啟動</Badge>
          )}

          <Button
            variant={ttsEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleTTS}
            className="flex items-center space-x-1"
          >
            {ttsEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            <span>{ttsEnabled ? 'TTS開啟' : 'TTS關閉'}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onShowTTSSettings}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onStopTTS}
            disabled={!ttsEnabled}
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {showReportButton && onFinishReading && (
          <Button
            onClick={onFinishReading}
            className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>完成並查看報告</span>
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default SmartReadingControl;
