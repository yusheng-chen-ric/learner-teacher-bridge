
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface AttentionPoint {
  timestamp: number;
  focusLevel: number; // 0-100
  textPosition: number;
}

export const AttentionTimeline = () => {
  const [attentionData] = useState<AttentionPoint[]>([
    { timestamp: 0, focusLevel: 85, textPosition: 0 },
    { timestamp: 5, focusLevel: 92, textPosition: 15 },
    { timestamp: 10, focusLevel: 78, textPosition: 32 },
    { timestamp: 15, focusLevel: 65, textPosition: 48 },
    { timestamp: 20, focusLevel: 88, textPosition: 65 },
    { timestamp: 25, focusLevel: 94, textPosition: 82 },
    { timestamp: 30, focusLevel: 70, textPosition: 95 },
    { timestamp: 35, focusLevel: 82, textPosition: 100 }
  ]);

  const getFocusColor = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getFocusLabel = (level: number) => {
    if (level >= 80) return 'High Focus';
    if (level >= 60) return 'Medium Focus';
    return 'Low Focus';
  };

  const handleTimelineClick = (point: AttentionPoint) => {
    console.log(`Jumping to text position: ${point.textPosition}% at ${point.timestamp}s`);
    // In real implementation, this would scroll to the specific text position
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Eye className="h-5 w-5 text-blue-600 mr-2" />
          專注時間軸
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>高專注 (80-100%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>中等專注 (60-79%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>低專注 (0-59%)</span>
            </div>
          </div>
          
          <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
            <div className="flex h-full items-end">
              {attentionData.map((point, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col justify-end cursor-pointer hover:opacity-80 transition-opacity group"
                  onClick={() => handleTimelineClick(point)}
                >
                  <div
                    className={`${getFocusColor(point.focusLevel)} transition-all duration-200`}
                    style={{ height: `${point.focusLevel}%` }}
                  />
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded transition-opacity duration-200">
                    <div>{point.timestamp}s</div>
                    <div>{point.focusLevel}% 專注</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0秒</span>
            <span>35秒</span>
          </div>
          
          <div className="text-center">
            <Badge variant="secondary" className="text-sm">
              平均專注：{Math.round(attentionData.reduce((acc, point) => acc + point.focusLevel, 0) / attentionData.length)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
