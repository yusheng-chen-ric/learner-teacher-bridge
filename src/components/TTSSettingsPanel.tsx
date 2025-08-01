
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { TextContentTTSService } from '@/services/TextContentTTSService';

interface Props {
  service: TextContentTTSService;
  onClose: () => void;
}

export const TTSSettingsPanel = ({ service, onClose }: Props) => {
  const settings = service.getSettings();
  const [rate, setRate] = useState([settings.rate]);
  const [pitch, setPitch] = useState([settings.pitch]);
  const [enabled, setEnabled] = useState(settings.enabled);
  const [autoSpeak, setAutoSpeak] = useState(settings.autoSpeak);

  const handleSave = () => {
    service.updateSettings({
      rate: rate[0],
      pitch: pitch[0],
      enabled,
      autoSpeak,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-80" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="text-lg">TTS 設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">啟用 TTS</span>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">自動朗讀</span>
            <Switch checked={autoSpeak} onCheckedChange={setAutoSpeak} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">語速：{rate[0].toFixed(1)}</label>
            <Slider value={rate} onValueChange={setRate} min={0.5} max={2} step={0.1} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">音調：{pitch[0].toFixed(1)}</label>
            <Slider value={pitch} onValueChange={setPitch} min={0} max={2} step={0.1} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} size="sm">取消</Button>
            <Button onClick={handleSave} size="sm">儲存</Button>
          </div>
        </CardContent>
      </Card>
    </div>

  );
};
