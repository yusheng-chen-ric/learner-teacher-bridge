import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProgressCard } from "./StudentProgressCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Book, TrendingUp, Clock, Target, Award, Users, BarChart3, BookOpen, Volume2, FileText, MessageSquare } from "lucide-react";

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
  },
  {
    id: "3",
    name: "Student C",
    grade: "Advanced",
    overallProgress: 94,
    subjects: [
      { name: "Reading Comprehension", progress: 96, status: 'excellent' as const },
      { name: "Vocabulary", progress: 94, status: 'excellent' as const },
      { name: "Grammar", progress: 92, status: 'excellent' as const },
      { name: "Speaking", progress: 93, status: 'excellent' as const }
    ],
    lastActivity: "30 minutes ago"
  }
];

const englishLearningStats = {
  readingComprehension: {
    averageScore: 78,
    improvement: "+12%",
    studentsAbove80: 15,
    totalAssessments: 156
  },
  vocabulary: {
    wordsLearned: 2847,
    newWordsThisWeek: 234,
    retentionRate: 85,
    difficultWords: 12
  },
  grammar: {
    averageAccuracy: 82,
    commonMistakes: ["Articles", "Present Perfect", "Prepositions"],
    improvementRate: "+8%",
    exercisesCompleted: 1203
  },
  speaking: {
    pronunciationScore: 74,
    fluencyImprovement: "+15%",
    speakingHours: 127,
    confidenceLevel: 68
  },
  listening: {
    comprehensionRate: 81,
    audioHoursCompleted: 89,
    nativeSpeedTolerance: 72,
    improvement: "+9%"
  },
  engagement: {
    dailyActiveStudents: 22,
    averageSessionTime: 34,
    weeklyGoalCompletion: 87,
    motivationScore: 79
  }
};

export const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-full">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-600">Teacher Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive English learning analytics and student progress overview</p>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              Active English Learners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Daily active students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-green-600">+7% this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-purple-600" />
              Study Time Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2h</div>
            <p className="text-xs text-muted-foreground">Avg 20.5 min/student</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 text-orange-600" />
              Need Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-orange-600">Below 70% progress</p>
          </CardContent>
        </Card>
      </div>

      {/* English Skills Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Reading & Vocabulary Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Reading Comprehension Average</span>
                <span className="text-sm text-blue-600 font-semibold">{englishLearningStats.readingComprehension.averageScore}%</span>
              </div>
              <Progress value={englishLearningStats.readingComprehension.averageScore} className="h-2" />
              <p className="text-xs text-green-600">{englishLearningStats.readingComprehension.improvement} improvement this month</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-xl font-bold text-blue-600">{englishLearningStats.vocabulary.wordsLearned}</div>
                <p className="text-xs text-muted-foreground">Total words learned</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-xl font-bold text-green-600">{englishLearningStats.vocabulary.retentionRate}%</div>
                <p className="text-xs text-muted-foreground">Retention rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="h-5 w-5 mr-2 text-purple-600" />
              Speaking & Listening Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pronunciation Accuracy</span>
                <span className="text-sm text-purple-600 font-semibold">{englishLearningStats.speaking.pronunciationScore}%</span>
              </div>
              <Progress value={englishLearningStats.speaking.pronunciationScore} className="h-2" />
              <p className="text-xs text-green-600">{englishLearningStats.speaking.fluencyImprovement} fluency improvement</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-xl font-bold text-purple-600">{englishLearningStats.listening.comprehensionRate}%</div>
                <p className="text-xs text-muted-foreground">Listening comprehension</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-xl font-bold text-orange-600">{englishLearningStats.speaking.speakingHours}h</div>
                <p className="text-xs text-muted-foreground">Speaking practice time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grammar and Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-indigo-600" />
              Grammar Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Accuracy Rate</span>
                <span className="text-lg font-bold text-indigo-600">{englishLearningStats.grammar.averageAccuracy}%</span>
              </div>
              <Progress value={englishLearningStats.grammar.averageAccuracy} className="h-2" />
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Common Challenge Areas:</p>
                <div className="space-y-1">
                  {englishLearningStats.grammar.commonMistakes.map((mistake, index) => (
                    <div key={index} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                      {mistake}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-600" />
              Student Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{englishLearningStats.engagement.motivationScore}%</div>
                <p className="text-xs text-muted-foreground">Motivation Score</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Session Duration</span>
                  <span className="font-semibold">{englishLearningStats.engagement.averageSessionTime} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Weekly Goals Met</span>
                  <span className="font-semibold text-green-600">{englishLearningStats.engagement.weeklyGoalCompletion}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-teal-600" />
              Weekly Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>New vocabulary</span>
                <span className="font-semibold text-teal-600">+{englishLearningStats.vocabulary.newWordsThisWeek}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Grammar exercises</span>
                <span className="font-semibold">{englishLearningStats.grammar.exercisesCompleted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Audio hours</span>
                <span className="font-semibold">{englishLearningStats.listening.audioHoursCompleted}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Assessments completed</span>
                <span className="font-semibold">{englishLearningStats.readingComprehension.totalAssessments}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Anonymous Student English Progress</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Detailed Analytics
          </Button>
          <Button variant="outline" size="sm">
            <Book className="h-4 w-4 mr-2" />
            Curriculum Insights
          </Button>
          <Button variant="outline" size="sm">Export Learning Data</Button>
        </div>
      </div>

      {/* Student Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockStudents.map((student) => (
          <StudentProgressCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
};
