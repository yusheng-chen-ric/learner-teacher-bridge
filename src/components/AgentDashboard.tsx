
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProgressCard } from "./StudentProgressCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Brain, Target, TrendingUp } from "lucide-react";

const mockStudents = [
  {
    id: "1",
    name: "Student A",
    grade: "Intermediate",
    overallProgress: 87,
    subjects: [
      { name: "Reading Comprehension", progress: 92, status: 'excellent' as const },
      { name: "Vocabulary", progress: 85, status: 'good' as const },
      { name: "Grammar", progress: 83, status: 'good' as const },
      { name: "Speaking", progress: 78, status: 'needs-improvement' as const }
    ],
    lastActivity: "2 hours ago"
  },
  {
    id: "2", 
    name: "Student B",
    grade: "Beginner",
    overallProgress: 72,
    subjects: [
      { name: "Reading Comprehension", progress: 68, status: 'needs-improvement' as const },
      { name: "Vocabulary", progress: 79, status: 'good' as const },
      { name: "Grammar", progress: 74, status: 'good' as const },
      { name: "Speaking", progress: 67, status: 'needs-improvement' as const }
    ],
    lastActivity: "1 day ago"
  }
];

const agentInsights = [
  {
    student: "Student A",
    insight: "Strong in reading comprehension and vocabulary. Recommend more speaking practice sessions.",
    confidence: 94,
    action: "Focus on pronunciation"
  },
  {
    student: "Student B", 
    insight: "Struggling with reading comprehension. Suggest phonics-based learning approach.",
    confidence: 87,
    action: "Reading intervention"
  },
  {
    student: "Student C",
    insight: "Exceptional English progress. Ready for advanced literature and writing exercises.",
    confidence: 96,
    action: "Advanced curriculum"
  }
];

export const AgentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-full">
          <Bot className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-purple-600">AI Agent View</h2>
          <p className="text-muted-foreground">AI-powered English learning insights and recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-2 text-purple-600" />
              AI Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">English learning prediction accuracy</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 text-purple-600" />
              Learning Interventions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Active English recommendations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
              English Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">Average progress this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI English Learning Insights</h3>
          <div className="space-y-4">
            {agentInsights.map((insight, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium">{insight.student}</CardTitle>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{insight.insight}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      {insight.action}
                    </Badge>
                    <Progress value={insight.confidence} className="w-20 h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Monitored English Learners</h3>
          <div className="space-y-4">
            {mockStudents.map((student) => (
              <StudentProgressCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
