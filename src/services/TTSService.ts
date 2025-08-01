export interface TTSSettings {
  enabled: boolean;
  autoSpeak: boolean;
  rate: number;
  pitch: number;
  volume: number;
  voice: string;
  language: string;
}

export class TTSService {
  private synthesis: SpeechSynthesis;
  private settings: TTSSettings;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.settings = this.loadSettings();
    this.initializeVoices();
  }

  private loadSettings(): TTSSettings {
    const saved = localStorage.getItem('tts-settings');
    return saved
      ? JSON.parse(saved)
      : {
          enabled: true,
          autoSpeak: false,
          rate: 1,
          pitch: 1,
          volume: 0.8,
          voice: '',
          language: 'en-US',
        };
  }

  private saveSettings(): void {
    localStorage.setItem('tts-settings', JSON.stringify(this.settings));
  }

  private initializeVoices(): void {
    const loadVoices = () => {
      this.availableVoices = this.synthesis.getVoices();
      if (!this.settings.voice && this.availableVoices.length > 0) {
        const defaultVoice =
          this.availableVoices.find((v) => v.lang.startsWith(this.settings.language)) ||
          this.availableVoices[0];
        this.settings.voice = defaultVoice.name;
        this.saveSettings();
      }
    };

    loadVoices();
    this.synthesis.onvoiceschanged = loadVoices;
  }

  public async speak(text: string, options?: Partial<TTSSettings>): Promise<void> {
    if (!this.settings.enabled) return;
    this.stop();
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const finalSettings = { ...this.settings, ...options };
      utterance.rate = finalSettings.rate;
      utterance.pitch = finalSettings.pitch;
      utterance.volume = finalSettings.volume;
      utterance.lang = finalSettings.language;
      const voice = this.availableVoices.find((v) => v.name === finalSettings.voice);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.onstart = () => {
        this.isPlaying = true;
        this.currentUtterance = utterance;
      };
      utterance.onend = () => {
        this.isPlaying = false;
        this.currentUtterance = null;
        resolve();
      };
      utterance.onerror = (e) => {
        this.isPlaying = false;
        this.currentUtterance = null;
        reject(new Error(`TTS Error: ${e.error}`));
      };
      this.synthesis.speak(utterance);
    });
  }

  public stop(): void {
    if (this.isPlaying) {
      this.synthesis.cancel();
      this.isPlaying = false;
      this.currentUtterance = null;
    }
  }

  public pause(): void {
    if (this.isPlaying) {
      this.synthesis.pause();
    }
  }

  public resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  public updateSettings(newSettings: Partial<TTSSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  public getSettings(): TTSSettings {
    return { ...this.settings };
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return [...this.availableVoices];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ttsService = new TTSService();
