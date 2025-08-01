import { TTSService, TTSSettings } from './TTSService';

interface TextRegion {
  id: string;
  text: string;
  type: 'word' | 'sentence';
  bounds: { x: number; y: number; width: number; height: number };
}

export class TextContentTTSService {
  private regions = new Map<string, TextRegion>();
  private container: HTMLElement | null = null;
  private tts = new TTSService();

  public async load(container: HTMLElement): Promise<void> {
    this.container = container;
    await new Promise((r) => setTimeout(r, 100));
    this.updateRegions();
  }

  public updateRegions(): void {
    if (!this.container) return;
    this.regions.clear();
    const containerRect = this.container.getBoundingClientRect();
    const wordEls = this.container.querySelectorAll('[id^="word-"]');
    wordEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      this.regions.set(el.id, {
        id: el.id,
        text: el.textContent || '',
        type: 'word',
        bounds: {
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
        },
      });
    });
    const sentenceEls = this.container.querySelectorAll('[id^="sentence-"]');
    sentenceEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      this.regions.set(el.id, {
        id: el.id,
        text: el.textContent || '',
        type: 'sentence',
        bounds: {
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
        },
      });
    });
  }

  private regionAt(x: number, y: number): TextRegion | null {
    if (!this.container) return null;
    const containerRect = this.container.getBoundingClientRect();
    const relX = x - containerRect.left;
    const relY = y - containerRect.top;
    for (const region of this.regions.values()) {
      const b = region.bounds;
      if (relX >= b.x && relX <= b.x + b.width && relY >= b.y && relY <= b.y + b.height) {
        return region;
      }
    }
    return null;
  }

  public async handleGazeFixation(x: number, y: number, duration: number): Promise<TextRegion | null> {
    const region = this.regionAt(x, y);
    if (!region) return null;
    const s = this.tts.getSettings();
    if (!s.enabled || !s.autoSpeak) return region;
    if (region.type === 'word' && duration > 800 && duration < 2000) {
      await this.tts.speak(region.text, { rate: s.rate * 1.2, pitch: s.pitch });
    } else if (region.type === 'sentence' && duration >= 2000) {
      await this.tts.speak(region.text, { rate: s.rate, pitch: s.pitch });
    }
    return region;
  }

  public async handleNodGesture(x: number, y: number, type: 'single' | 'double' = 'single'): Promise<TextRegion | null> {
    const region = this.regionAt(x, y);
    if (!region || !this.tts.getSettings().enabled) return null;
    const settings = this.tts.getSettings();
    const rate = type === 'double' ? settings.rate * 0.7 : settings.rate;
    await this.tts.speak(region.text, { rate, pitch: settings.pitch });
    return region;
  }

  public speakText(text: string, opts?: Partial<TTSSettings>): Promise<void> {
    return this.tts.speak(text, opts);
  }

  public stop(): void {
    this.tts.stop();
  }

  public getSettings(): TTSSettings {
    return this.tts.getSettings();
  }

  public updateSettings(s: Partial<TTSSettings>): void {
    this.tts.updateSettings(s);
  }
}
