import { useState, useEffect } from "react";

interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
}

interface GazeOverlayProps {
  isActive: boolean;
  textElement?: HTMLElement | null;
}

export const GazeOverlay = ({ isActive, textElement }: GazeOverlayProps) => {
  const [gazePoint, setGazePoint] = useState<GazePoint>({ x: 0, y: 0, timestamp: Date.now() });
  const [gazeTrail, setGazeTrail] = useState<GazePoint[]>([]);

  useEffect(() => {
    if (!isActive || !textElement) return;

    // Simulate eye tracking data - in real implementation this would come from eye tracker
    const simulateGazeTracking = () => {
      const rect = textElement.getBoundingClientRect();
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;
      const timestamp = Date.now();
      
      const newGazePoint = { x, y, timestamp };
      setGazePoint(newGazePoint);
      
      setGazeTrail(prev => {
        const updated = [...prev, newGazePoint];
        // Keep only last 10 points for trail
        return updated.slice(-10);
      });
    };

    const interval = setInterval(simulateGazeTracking, 100);
    return () => clearInterval(interval);
  }, [isActive, textElement]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Gaze trail */}
      {gazeTrail.map((point, index) => (
        <div
          key={`${point.timestamp}-${index}`}
          className="absolute w-3 h-3 bg-blue-400 rounded-full"
          style={{
            left: point.x - 6,
            top: point.y - 6,
            opacity: (index + 1) / gazeTrail.length * 0.3,
          }}
        />
      ))}
      
      {/* Current fixation point */}
      <div
        className="absolute w-4 h-4 border-2 border-red-500 rounded-full bg-red-200"
        style={{
          left: gazePoint.x - 8,
          top: gazePoint.y - 8,
        }}
      />
    </div>
  );
};
