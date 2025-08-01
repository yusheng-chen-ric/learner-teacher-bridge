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
