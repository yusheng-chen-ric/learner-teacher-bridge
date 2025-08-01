import type { GazePacket } from '@/types'

export interface RealtimeData {
  type: 'realtime_data'
  timestamp: string
  gaze: { x: number; y: number; valid: 0 | 1 }
  distance?: number
  behaviors?: unknown
  eyetrack_states?: unknown
  text_detection?: unknown[]
  pupil_diameter?: number
  blink_detected?: boolean
}

export function toGazePacket(data: RealtimeData): GazePacket {
  return {
    timestamp: Date.parse(data.timestamp),
    gaze_valid: data.gaze.valid,
    gaze_pos_x: data.gaze.x,
    gaze_pos_y: data.gaze.y,
    ...(data.pupil_diameter !== undefined && { pupil_diameter: data.pupil_diameter }),
    ...(data.blink_detected !== undefined && { blink_detected: data.blink_detected })
  }
}

export function toGazePackets(arr: RealtimeData[]): GazePacket[] {
  return arr.map(toGazePacket)
}
