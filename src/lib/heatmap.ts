import type { GazePacket, HeatmapPoint } from '@/types';

/**
 * Generate heatmap data by calculating gaze point density.
 * @param gazeData Array of gaze packets from a reading session
 * @param width Canvas width in pixels
 * @param height Canvas height in pixels
 * @param cellSize Size of a grid cell in pixels
 */
export function generateHeatmapData(
  gazeData: GazePacket[],
  width = 600,
  height = 400,
  cellSize = 30
): HeatmapPoint[] {
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const grid = new Array(cols * rows).fill(0);

  gazeData.forEach(p => {
    if (p.gaze_valid !== 1) return;
    const col = Math.floor(p.gaze_pos_x / cellSize);
    const row = Math.floor(p.gaze_pos_y / cellSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[row * cols + col] += 1;
    }
  });

  const max = Math.max(...grid, 1);
  const points: HeatmapPoint[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = grid[r * cols + c];
      if (val > 0) {
        points.push({
          x: c * cellSize + cellSize / 2,
          y: r * cellSize + cellSize / 2,
          value: val / max,
        });
      }
    }
  }
  return points;
}
