
import { useState } from "react";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { AgentDashboard } from "@/components/AgentDashboard";
import { Button } from "@/components/ui/button";
import { User, Bot } from "lucide-react";

const StudentLearningStatus = () => {
  const [activeView, setActiveView] = useState<'teacher' | 'agent'>('teacher');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Student Learning Status Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive monitoring of student progress from both teacher and AI agent perspectives
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={activeView === 'teacher' ? 'default' : 'ghost'}
              onClick={() => setActiveView('teacher')}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Teacher View</span>
            </Button>
            <Button
              variant={activeView === 'agent' ? 'default' : 'ghost'}
              onClick={() => setActiveView('agent')}
              className="flex items-center space-x-2"
            >
              <Bot className="h-4 w-4" />
              <span>AI Agent View</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {activeView === 'teacher' ? <TeacherDashboard /> : <AgentDashboard />}
        </div>
      </div>
    </div>
  );
};

export default StudentLearningStatus;
