import { useState } from "react";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { AgentDashboard } from "@/components/AgentDashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { ParentCompanionView } from "@/components/ParentCompanionView";
import { StudentDashboard } from "@/components/StudentDashboard";
import { Button } from "@/components/ui/button";
import { User, Bot, MessageCircle, Heart, BookOpen, Settings } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<'teacher' | 'student' | 'agent' | 'chat' | 'parent'>('teacher');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Learning Platform
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant={activeView === 'teacher' ? 'default' : 'ghost'}
                onClick={() => setActiveView('teacher')}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Teacher</span>
              </Button>
              <Button
                variant={activeView === 'student' ? 'default' : 'ghost'}
                onClick={() => setActiveView('student')}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4 text-green-600" />
                <span>Student</span>
              </Button>
              <Button
                variant={activeView === 'agent' ? 'default' : 'ghost'}
                onClick={() => setActiveView('agent')}
                className="flex items-center space-x-2"
              >
                <Bot className="h-4 w-4" />
                <span>AI Agent</span>
              </Button>
              <Button
                variant={activeView === 'chat' ? 'default' : 'ghost'}
                onClick={() => setActiveView('chat')}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </Button>
              <Button
                variant={activeView === 'parent' ? 'default' : 'ghost'}
                onClick={() => setActiveView('parent')}
                className="flex items-center space-x-2"
              >
                <Heart className="h-4 w-4" />
                <span>Parent</span>
              </Button>
            </div>

            {/* Settings */}
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeView === 'teacher' ? 'default' : 'ghost'}
                onClick={() => setActiveView('teacher')}
                size="sm"
                className="flex items-center space-x-1"
              >
                <User className="h-3 w-3" />
                <span>Teacher</span>
              </Button>
              <Button
                variant={activeView === 'student' ? 'default' : 'ghost'}
                onClick={() => setActiveView('student')}
                size="sm"
                className="flex items-center space-x-1"
              >
                <User className="h-3 w-3 text-green-600" />
                <span>Student</span>
              </Button>
              <Button
                variant={activeView === 'agent' ? 'default' : 'ghost'}
                onClick={() => setActiveView('agent')}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Bot className="h-3 w-3" />
                <span>AI Agent</span>
              </Button>
              <Button
                variant={activeView === 'chat' ? 'default' : 'ghost'}
                onClick={() => setActiveView('chat')}
                size="sm"
                className="flex items-center space-x-1"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Chat</span>
              </Button>
              <Button
                variant={activeView === 'parent' ? 'default' : 'ghost'}
                onClick={() => setActiveView('parent')}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Heart className="h-3 w-3" />
                <span>Parent</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            English Learning Progress Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive monitoring of student English learning progress from multiple perspectives
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {activeView === 'teacher' && <TeacherDashboard />}
          {activeView === 'student' && <StudentDashboard />}
          {activeView === 'agent' && <AgentDashboard />}
          {activeView === 'chat' && <ChatInterface />}
          {activeView === 'parent' && <ParentCompanionView />}
        </div>
      </div>
    </div>
  );
};

export default Index;
