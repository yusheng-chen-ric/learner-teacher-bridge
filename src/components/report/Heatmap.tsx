import React from 'react';
import { HeatmapPoint } from '@/types';

interface HeatmapProps {
  points: HeatmapPoint[];
}

export const Heatmap = ({ points }: HeatmapProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(p => {
      const intensity = Math.max(0, Math.min(1, p.value));
      const radius = 20;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      grd.addColorStop(0, `rgba(255,0,0,${intensity})`);
      grd.addColorStop(1, 'rgba(255,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [points]);

  return <canvas ref={canvasRef} width={600} height={400} className="w-full h-96 bg-white border" />;
};

