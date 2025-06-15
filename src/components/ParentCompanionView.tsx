
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bell, Clock, Star, TrendingUp, BookOpen } from "lucide-react";

interface SessionSummary {
  date: string;
  studyTime: number; // in minutes
  focusScore: number; // 0-100
  reviewItems: string[];
  completedExercises: number;
}

export const ParentCompanionView = () => {
  const recentSession: SessionSummary = {
    date: "2024-01-15",
    studyTime: 45,
    focusScore: 87,
    reviewItems: ["pronunciation", "confidence-building", "particularly", "grammar structures", "speaking fluency"],
    completedExercises: 8
  };

  const weeklyProgress = [
    { day: "Mon", score: 82 },
    { day: "Tue", score: 78 },
    { day: "Wed", score: 85 },
    { day: "Thu", score: 90 },
    { day: "Fri", score: 87 },
  ];

  const getFocusScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getFocusScoreBadge = (score: number) => {
    if (score >= 85) return { text: "Excellent", color: "bg-green-100 text-green-800" };
    if (score >= 70) return { text: "Good", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Needs Support", color: "bg-red-100 text-red-800" };
  };

  const badge = getFocusScoreBadge(recentSession.focusScore);

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Parent Dashboard</h1>
        <p className="text-muted-foreground">Emma's English Learning Progress</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              Today's Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSession.studyTime} min</div>
            <p className="text-xs text-muted-foreground">+5 min from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-600" />
              Focus Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getFocusScoreColor(recentSession.focusScore)}`}>
              {recentSession.focusScore}%
            </div>
            <Badge variant="secondary" className={badge.color}>
              {badge.text}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-green-600" />
              Exercises Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSession.completedExercises}</div>
            <p className="text-xs text-muted-foreground">Reading & pronunciation</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Weekly Focus Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="w-8 text-sm font-medium">{day.day}</span>
                <Progress value={day.score} className="flex-1" />
                <span className="w-12 text-sm text-right">{day.score}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Review Items</CardTitle>
          <p className="text-sm text-muted-foreground">
            Words and concepts Emma spent the most time on today
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentSession.reviewItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{item}</span>
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-orange-600" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                🎉 Emma achieved her highest focus score this week!
              </p>
              <p className="text-xs text-green-600 mt-1">2 hours ago</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                📚 New review list available with 5 items to practice
              </p>
              <p className="text-xs text-blue-600 mt-1">1 day ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline">
          View Detailed Report
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Schedule Parent-Teacher Meeting
        </Button>
      </div>
    </div>
  );
};
