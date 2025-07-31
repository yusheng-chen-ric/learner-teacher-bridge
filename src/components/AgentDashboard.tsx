
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProgressCard } from "./StudentProgressCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Brain, Target, TrendingUp } from "lucide-react";

const mockStudents = [
  {
    id: "1",
    name: "學生甲",
    grade: "中級",
    overallProgress: 87,
    subjects: [
      { name: "Reading Comprehension", progress: 92, status: 'excellent' as const },
      { name: "Vocabulary", progress: 85, status: 'good' as const },
      { name: "Grammar", progress: 83, status: 'good' as const },
      { name: "Speaking", progress: 78, status: 'needs-improvement' as const }
    ],
    lastActivity: "2 小時前"
  },
  {
    id: "2",
    name: "學生乙",
    grade: "初級",
    overallProgress: 72,
    subjects: [
      { name: "Reading Comprehension", progress: 68, status: 'needs-improvement' as const },
      { name: "Vocabulary", progress: 79, status: 'good' as const },
      { name: "Grammar", progress: 74, status: 'good' as const },
      { name: "Speaking", progress: 67, status: 'needs-improvement' as const }
    ],
    lastActivity: "1 天前"
  }
];

const agentInsights = [
  {
    student: "學生甲",
    insight: "閱讀理解與字彙能力佳，建議加強口說練習。",
    confidence: 94,
    action: "著重發音"
  },
  {
    student: "學生乙",
    insight: "閱讀理解較弱，建議採用自然發音法。",
    confidence: 87,
    action: "閱讀輔導"
  },
  {
    student: "學生丙",
    insight: "英文表現優異，可進入進階文學與寫作練習。",
    confidence: 96,
    action: "進階課程"
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
          <h2 className="text-2xl font-bold text-purple-600">AI 助理介面</h2>
          <p className="text-muted-foreground">AI 提供的英文學習洞察與建議</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-2 text-purple-600" />
              AI 信心指數
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">英文學習預測準確度</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 text-purple-600" />
              介入建議
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">目前啟用的建議數</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
              英文進步
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">本月平均進展</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI 英文學習洞察</h3>
          <div className="space-y-4">
            {agentInsights.map((insight, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium">{insight.student}</CardTitle>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      信心水準 {insight.confidence}%
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
          <h3 className="text-lg font-semibold">監控中的學生</h3>
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
