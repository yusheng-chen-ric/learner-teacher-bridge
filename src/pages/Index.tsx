
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginPage } from "@/components/LoginPage";
import VocabularyReviewPage from "@/pages/VocabularyReviewPage";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { AgentDashboard } from "@/components/AgentDashboard";
import { ChatInterface } from "@/components/ChatInterface";
import { ParentCompanionView } from "@/components/ParentCompanionView";
import { EnhancedStudentDashboard } from "@/components/EnhancedStudentDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Bot, MessageCircle, Heart, BookOpen, Settings, LogOut } from "lucide-react";
import { useReviewWords } from "@/hooks/useReviewWords";

const Index = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { words } = useReviewWords();
  const [activeView, setActiveView] = useState<'dashboard' | 'agent' | 'chat' | 'review'>('dashboard');

  // If not authenticated, show login page
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  const handleLogout = () => {
    logout();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'text-green-600';
      case 'teacher': return 'text-blue-600';
      case 'parent': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <User className={`h-4 w-4 ${getRoleColor(role)}`} />;
      case 'teacher': return <User className={`h-4 w-4 ${getRoleColor(role)}`} />;
      case 'parent': return <Heart className={`h-4 w-4 ${getRoleColor(role)}`} />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const renderMainContent = () => {
    if (activeView === 'agent') return <AgentDashboard />;
    if (activeView === 'chat') return <ChatInterface />;
    if (activeView === 'review') return <VocabularyReviewPage />;

    // Dashboard view based on role
    switch (user.role) {
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <EnhancedStudentDashboard />;
      case 'parent':
        return <ParentCompanionView />;
      default:
        return <div>Unknown role</div>;
    }
  };

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
                English Learning Platform
              </h1>
            </div>

            {/* User Info & Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                {getRoleIcon(user.role)}
                <span className="font-medium">{user.username}</span>
                <span className={`text-sm ${getRoleColor(user.role)} capitalize`}>
                  ({user.role})
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center space-x-2"
                >
                  {getRoleIcon(user.role)}
                  <span>Dashboard</span>
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
                {user.role === 'student' && (
                  <Button
                    variant={activeView === 'review' ? 'default' : 'ghost'}
                    onClick={() => setActiveView('review')}
                    className="flex items-center space-x-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Review</span>
                    {words.length > 0 && (
                      <Badge className="ml-1" variant="secondary">
                        {words.length}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>

              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile view */}
            <div className="md:hidden flex items-center space-x-2">
              <span className="text-sm font-medium">{user.username}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveView('dashboard')}
                size="sm"
              >
                Dashboard
              </Button>
              <Button
                variant={activeView === 'agent' ? 'default' : 'ghost'}
                onClick={() => setActiveView('agent')}
                size="sm"
              >
                AI Agent
              </Button>
              <Button
                variant={activeView === 'chat' ? 'default' : 'ghost'}
                onClick={() => setActiveView('chat')}
                size="sm"
              >
                Chat
              </Button>
              {user.role === 'student' && (
                <Button
                  variant={activeView === 'review' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('review')}
                  size="sm"
                >
                  Review
                  {words.length > 0 && (
                    <Badge className="ml-1" variant="secondary">
                      {words.length}
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
