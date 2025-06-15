import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, User, Bot } from "lucide-react";

interface Message {
  id: string;
  sender: 'teacher' | 'agent';
  content: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "agent",
      content: "Hello! I'm your AI English teaching assistant. How can I help you improve your students' English learning today?",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: "2", 
      sender: "teacher",
      content: "I'm concerned about Emma's pronunciation and speaking confidence in English. She seems hesitant to participate in oral activities.",
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: "3",
      sender: "agent", 
      content: "Based on my analysis, Emma shows strong reading comprehension but struggles with speaking confidence. I recommend implementing pair work activities, pronunciation drills with audio feedback, and creating a supportive environment for oral practice. Her engagement increases significantly with interactive speaking games and peer collaboration.",
      timestamp: new Date(Date.now() - 180000)
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");

  const englishLearningResponses = [
    "That's a great question about English learning. Let me analyze the student's language acquisition patterns and suggest targeted vocabulary building exercises.",
    "I recommend incorporating more interactive listening activities and pronunciation practice to improve their English fluency.",
    "Based on language learning data, this student would benefit from focused grammar exercises and speaking practice sessions.",
    "I suggest implementing a reading comprehension program with gradually increasing difficulty levels to enhance their English skills.",
    "Let me provide you with specific strategies for improving their English writing skills and sentence structure understanding."
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: "teacher",
        content: newMessage,
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage("");
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const randomResponse = englishLearningResponses[Math.floor(Math.random() * englishLearningResponses.length)];
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          content: randomResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Teacher-AI Chat</CardTitle>
            <p className="text-sm text-muted-foreground">Collaborate with your AI teaching assistant</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'teacher' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === 'agent' && (
                    <>
                      <Bot className="h-4 w-4 text-purple-600" />
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                        AI Agent
                      </Badge>
                    </>
                  )}
                  {message.sender === 'teacher' && (
                    <>
                      <User className="h-4 w-4 text-blue-600" />
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        Teacher
                      </Badge>
                    </>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === 'teacher'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
