
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Target, BookOpen, Zap, TrendingUp } from 'lucide-react';

interface StatsData {
  readingTime: number;
  avgFixationDuration: number;
  regressionRate: number;
  focusScore: number;
  wordsRead: number;
  comprehensionLevel: 'high' | 'medium' | 'low';
  interactionCount: number;
  readingSpeed: number;
}

interface EnhancedStatsCardsProps {
  stats: StatsData;
}

export const EnhancedStatsCards = ({ stats }: EnhancedStatsCardsProps) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const getComprehensionColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Reading Time */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {formatTime(stats.readingTime)}
              </p>
              <p className="text-sm text-blue-600 font-medium">Reading Time</p>
              <p className="text-xs text-gray-500">Total session duration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Score */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${getScoreColor(stats.focusScore)}`}>
                {stats.focusScore}%
              </p>
              <p className="text-sm text-purple-600 font-medium">Focus Score</p>
              <p className="text-xs text-gray-500">Attention quality</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reading Speed */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.readingSpeed}
              </p>
              <p className="text-sm text-emerald-600 font-medium">Words/Min</p>
              <p className="text-xs text-gray-500">Reading speed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehension Level */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <Badge className={`${getComprehensionColor(stats.comprehensionLevel)} border`}>
                {stats.comprehensionLevel.toUpperCase()}
              </Badge>
              <p className="text-sm text-orange-600 font-medium mt-1">Comprehension</p>
              <p className="text-xs text-gray-500">Understanding level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Interactions */}
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-pink-100 rounded-full">
              <Zap className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.interactionCount}
              </p>
              <p className="text-sm text-pink-600 font-medium">AI Assists</p>
              <p className="text-xs text-gray-500">Smart interactions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixation Quality */}
      <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-100 rounded-full">
              <Eye className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.avgFixationDuration}ms
              </p>
              <p className="text-sm text-cyan-600 font-medium">Avg. Fixation</p>
              <p className="text-xs text-gray-500">Eye focus duration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
