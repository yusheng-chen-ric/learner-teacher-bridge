
// Core gaze tracking types
export interface GazePacket {
  timestamp: number;
  gaze_valid: 0 | 1;
  gaze_pos_x: number;
  gaze_pos_y: number;
  pupil_diameter?: number;
  blink_detected?: boolean;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

export interface ReportData {
  summary: {
    readingTime: number;
    avgFixationDuration: number;
    regressionRate: number;
    focusScore: number;
    wordsRead: number;
    comprehensionLevel: 'high' | 'medium' | 'low';
  };
  heatmapData: HeatmapPoint[];
  highlightSentences: string[]; // e.g., ["sentence-2", "sentence-18"]
  difficultWords: Array<{
    word: string;
    fixationTime: number;
    lookupCount: number;
  }>;
  readingLevel?: ReadingLevel;
}

export interface RecommendedBook {
  title: string;
  lexile: number;
  type: string;
  theme: string;
  reason: string;
}

export interface ReadingLevel {
  student_summary: {
    wpm: number;
    regression_rate: number;
    attention_score: number;
    comprehension_level: string;
    inferred_lexile_band: string;
  };
  recommended_books: RecommendedBook[];
}

export interface WordPopupData {
  visible: boolean;
  wordId: string;
  word: string;
  position: { top: number; left: number };
}

export interface GrammarCardData {
  visible: boolean;
  sentenceId: string;
  sentence: string;
  position: { top: number; left: number };
}

// Reading session types
export interface ReadingSession {
  id: string;
  textContent: string;
  startTime: number;
  endTime?: number;
  isActive: boolean;
}

// Reading material extracted from PDFs
export interface Paragraph {
  id: string;
  text: string;
  images?: string[];
}

export interface VocabularyItem {
  word: string;
  explanation: string;
}

export interface ReadingMaterial {
  paragraphs: Paragraph[];
  vocabulary: VocabularyItem[];
}
