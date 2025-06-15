
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUser, User, Bot, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
              <BookUser className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Learning Analytics Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Revolutionizing education through intelligent monitoring and personalized learning experiences. 
            Get dual perspectives from both teachers and AI agents to maximize student success.
          </p>
          <Button 
            onClick={() => navigate('/learning-status')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            View Student Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-blue-600">Teacher Perspective</CardTitle>
              <CardDescription className="text-base">
                Comprehensive classroom insights and student performance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Real-time student progress monitoring
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Class performance analytics and reports
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Identify students needing additional support
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Subject-wise performance breakdown
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-500 rounded-full">
                  <Bot className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-purple-600">AI Agent Intelligence</CardTitle>
              <CardDescription className="text-base">
                Advanced AI-powered insights and personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Intelligent learning pattern analysis
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Personalized intervention recommendations
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Predictive performance modeling
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Adaptive learning path optimization
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground">
            Empowering educators and students through data-driven insights and intelligent automation
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
