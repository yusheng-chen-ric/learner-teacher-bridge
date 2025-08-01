import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, BookOpen, Clock, User, FileText, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Assignment {
  id: string;
  title: string;
  teacher: string;
  dueDate: string;
  status: 'pending' | 'completed';
  content?: string;
}

export const EnhancedStudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock assignments data
  useEffect(() => {
    const mockAssignments: Assignment[] = [
      {
        id: '1',
        title: 'Emma 的英文學習之旅',
        teacher: 'Johnson 老師',
        dueDate: '2024-01-20',
        status: 'pending'
      },
      {
        id: '2',
        title: '每日閱讀練習',
        teacher: 'Smith 老師',
        dueDate: '2024-01-18',
        status: 'pending',
        content: '/image/sample.png'
      },
      {
        id: '3',
        title: '字彙增強練習',
        teacher: 'Johnson 老師',
        dueDate: '2024-01-15',
        status: 'completed'
      }
    ];
    setAssignments(mockAssignments);
  }, []);

  const handleStartReading = (assignmentId: string) => {
    console.log('Starting reading for assignment:', assignmentId);
    const assignment = assignments.find((a) => a.id === assignmentId);
    const sessionId = `session-${Date.now()}-${assignmentId}`;
    if (assignment?.content) {
      navigate(`/image-reader/${sessionId}`);
    } else {
      navigate(`/reader/${sessionId}`);
    }
  };

  const handleUploadFile = () => {
    console.log('Opening file upload for self-paced reading');
    setIsLoading(true);
    const sessionId = `session-${Date.now()}-selfpaced`;
    setTimeout(() => {
      navigate(`/reader/${sessionId}`);
      setIsLoading(false);
    }, 1000);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-green-100 rounded-full">
          <User className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-600">
            歡迎回來，{user?.username}！
          </h2>
          <p className="text-muted-foreground">準備好開始學習英文了嗎？</p>
        </div>
      </div>

      {/* Assigned Readings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            老師的作業
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            完成老師指派的閱讀任務
          </p>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              目前沒有作業
            </p>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div 
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {assignment.teacher}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        到期日：{assignment.dueDate}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Badge 
                        variant="secondary" 
                        className={getStatusColor(assignment.status)}
                      >
                        {assignment.status === 'completed'
                          ? '已完成'
                          : getDaysUntilDue(assignment.dueDate) === 0
                          ? '已過期'
                          : `剩餘 ${getDaysUntilDue(assignment.dueDate)} 天`}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-4">
                    {assignment.status === 'pending' ? (
                      <Button
                        onClick={() => handleStartReading(assignment.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        開始閱讀
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        已完成
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Self-paced Reading Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-purple-600" />
            自主閱讀
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            上傳自己的文章並搭配眼動追蹤練習閱讀
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              <Upload className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-2">上傳文章</h3>
              <p className="text-muted-foreground mb-4">
                選擇任何想練習的英文文章
              </p>
            </div>
            <Button 
              onClick={handleUploadFile}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? '上傳中...' : '上傳我的文章'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reading History (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-600" />
            最近的閱讀紀錄
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            完成閱讀後，你的紀錄將顯示在此
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
