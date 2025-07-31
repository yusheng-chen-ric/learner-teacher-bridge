
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookUser } from "lucide-react";

interface StudentProgressCardProps {
  student: {
    id: string;
    name: string;
    grade: string;
    overallProgress: number;
    subjects: {
      name: string;
      progress: number;
      status: 'excellent' | 'good' | 'needs-improvement';
    }[];
    lastActivity: string;
  };
}

export const StudentProgressCard = ({ student }: StudentProgressCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return '優秀';
      case 'good': return '良好';
      case 'needs-improvement': return '需加強';
      default: return status;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <BookUser className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{student.name}</CardTitle>
            <p className="text-sm text-muted-foreground">程度 {student.grade}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">整體進度</span>
              <span className="text-sm text-muted-foreground">{student.overallProgress}%</span>
            </div>
            <Progress value={student.overallProgress} className="h-2" />
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">科目進度</h4>
            <div className="space-y-2">
              {student.subjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{subject.name}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={subject.progress} className="w-16 h-1" />
                    <Badge variant="secondary" className={getStatusColor(subject.status)}>
                      {getStatusLabel(subject.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              最近活動：{student.lastActivity}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
