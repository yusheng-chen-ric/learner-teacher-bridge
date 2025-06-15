
import { useState } from "react";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { AgentDashboard } from "@/components/AgentDashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { ParentCompanionView } from "@/components/ParentCompanionView";
import { Button } from "@/components/ui/button";
import { User, Bot, MessageCircle, Heart } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<'teacher' | 'agent' | 'chat' | 'parent'>('teacher');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Student Learning Status Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive monitoring of student progress from multiple perspectives
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
              <span>Parent View</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {activeView === 'teacher' && <TeacherDashboard />}
          {activeView === 'agent' && <AgentDashboard />}
          {activeView === 'chat' && <ChatInterface />}
          {activeView === 'parent' && <ParentCompanionView />}
        </div>
      </div>
    </div>
  );
};

export default Index;
