
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProgressCard } from "./StudentProgressCard";
import { Button } from "@/components/ui/button";
import { User, Book } from "lucide-react";

const mockStudents = [
  {
    id: "1",
    name: "Emma Johnson",
    grade: "10A",
    overallProgress: 87,
    subjects: [
      { name: "Mathematics", progress: 92, status: 'excellent' as const },
      { name: "Science", progress: 85, status: 'good' as const },
      { name: "Literature", progress: 83, status: 'good' as const },
      { name: "History", progress: 78, status: 'needs-improvement' as const }
    ],
    lastActivity: "2 hours ago"
  },
  {
    id: "2",
    name: "Alex Chen",
    grade: "10A",
    overallProgress: 72,
    subjects: [
      { name: "Mathematics", progress: 68, status: 'needs-improvement' as const },
      { name: "Science", progress: 79, status: 'good' as const },
      { name: "Literature", progress: 74, status: 'good' as const },
      { name: "History", progress: 67, status: 'needs-improvement' as const }
    ],
    lastActivity: "1 day ago"
  },
  {
    id: "3",
    name: "Sofia Rodriguez",
    grade: "10B",
    overallProgress: 94,
    subjects: [
      { name: "Mathematics", progress: 96, status: 'excellent' as const },
      { name: "Science", progress: 94, status: 'excellent' as const },
      { name: "Literature", progress: 92, status: 'excellent' as const },
      { name: "History", progress: 93, status: 'excellent' as const }
    ],
    lastActivity: "30 minutes ago"
  }
];

export const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-full">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-600">Teacher View</h2>
          <p className="text-muted-foreground">Monitor student performance and progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">Class performance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Students requiring support</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Student Progress Overview</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Book className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button variant="outline" size="sm">Export Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockStudents.map((student) => (
          <StudentProgressCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
};
