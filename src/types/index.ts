
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
