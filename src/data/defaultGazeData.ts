import type { GazePacket } from '@/types';

export const defaultGazeData: GazePacket[] = [
  { timestamp: 0, gaze_valid: 1, gaze_pos_x: 120, gaze_pos_y: 220 },
  { timestamp: 100, gaze_valid: 1, gaze_pos_x: 125, gaze_pos_y: 225 },
  { timestamp: 200, gaze_valid: 1, gaze_pos_x: 130, gaze_pos_y: 230 },
  { timestamp: 300, gaze_valid: 1, gaze_pos_x: 200, gaze_pos_y: 260 },
  { timestamp: 400, gaze_valid: 1, gaze_pos_x: 205, gaze_pos_y: 265 },
  { timestamp: 500, gaze_valid: 1, gaze_pos_x: 210, gaze_pos_y: 270 },
  { timestamp: 600, gaze_valid: 1, gaze_pos_x: 400, gaze_pos_y: 120 },
  { timestamp: 700, gaze_valid: 1, gaze_pos_x: 405, gaze_pos_y: 125 },
  { timestamp: 800, gaze_valid: 1, gaze_pos_x: 410, gaze_pos_y: 130 },
];
