
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
=======
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, Play, Square } from 'lucide-react';
import { ttsService, TTSSettings } from '@/services/TTSService';

export const TTSSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<TTSSettings>(ttsService.getSettings());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(ttsService.getAvailableVoices());
  const [isPlaying, setIsPlaying] = useState(false);
  const [testText, setTestText] = useState('Hello, this is a test of the text-to-speech system.');

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(ttsService.getIsPlaying());
      const availableVoices = ttsService.getAvailableVoices();
      if (availableVoices.length !== voices.length) {
        setVoices(availableVoices);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [voices.length]);

  const handleSettingChange = (key: keyof TTSSettings, value: number | boolean | string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    ttsService.updateSettings({ [key]: value });
  };

  const handleTestSpeak = async () => {
    try {
      await ttsService.speak(testText);
    } catch (err) {
      console.error('TTS Test Error:', err);
    }
  };

  const handleStop = () => {
    ttsService.stop();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Text-to-Speech Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Enable TTS</label>
          <Switch checked={settings.enabled} onCheckedChange={(c) => handleSettingChange('enabled', c)} />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Auto Speak on Fixation</label>
          <Switch
            checked={settings.autoSpeak}
            onCheckedChange={(c) => handleSettingChange('autoSpeak', c)}
            disabled={!settings.enabled}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Voice</label>
          <Select
            value={settings.voice}
            onValueChange={(v) => handleSettingChange('voice', v)}
            disabled={!settings.enabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Speech Rate: {settings.rate.toFixed(1)}x</label>
          <Slider
            value={[settings.rate]}
            onValueChange={([v]) => handleSettingChange('rate', v)}
            min={0.1}
            max={3}
            step={0.1}
            disabled={!settings.enabled}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Pitch: {settings.pitch.toFixed(1)}</label>
          <Slider
            value={[settings.pitch]}
            onValueChange={([v]) => handleSettingChange('pitch', v)}
            min={0.5}
            max={2}
            step={0.1}
            disabled={!settings.enabled}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Volume: {Math.round(settings.volume * 100)}%</label>
          <Slider
            value={[settings.volume]}
            onValueChange={([v]) => handleSettingChange('volume', v)}
            min={0}
            max={1}
            step={0.1}
            disabled={!settings.enabled}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Speech</label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full p-2 border rounded-md resize-none"
            rows={3}
            disabled={!settings.enabled}
          />
          <div className="flex gap-2">
            <Button onClick={handleTestSpeak} disabled={!settings.enabled || isPlaying} size="sm">
              <Play className="h-4 w-4 mr-1" />
              Test
            </Button>
            <Button onClick={handleStop} disabled={!settings.enabled || !isPlaying} size="sm" variant="outline">
              <Square className="h-4 w-4 mr-1" />
              Stop
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

  );
};
