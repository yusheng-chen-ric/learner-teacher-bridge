export interface TTSSettings {
  enabled: boolean;
  autoSpeak: boolean;
  rate: number;
  pitch: number;
  volume: number;
}

export class TTSService {
  private settings: TTSSettings;

  constructor() {
    const stored = localStorage.getItem('ttsSettings');
    if (stored) {
      try {
        this.settings = { ...JSON.parse(stored) } as TTSSettings;
      } catch {
        this.settings = { enabled: true, autoSpeak: true, rate: 1, pitch: 1, volume: 1 };
      }
    } else {
      this.settings = { enabled: true, autoSpeak: true, rate: 1, pitch: 1, volume: 1 };
    }
  }

  public getSettings(): TTSSettings {
    return this.settings;
  }

  public updateSettings(updates: Partial<TTSSettings>): void {
    this.settings = { ...this.settings, ...updates };
    localStorage.setItem('ttsSettings', JSON.stringify(this.settings));
  }

  public speak(text: string, opts?: Partial<TTSSettings>): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) return resolve();
      if (!this.settings.enabled) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      const final = { ...this.settings, ...opts };
      u.rate = final.rate;
      u.pitch = final.pitch;
      u.volume = final.volume;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
      u.onend = () => resolve();
    });
  }

  public stop(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }
}
