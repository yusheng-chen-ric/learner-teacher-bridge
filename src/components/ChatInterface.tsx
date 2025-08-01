
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, User, Bot, BookOpen } from "lucide-react";
import { InteractiveReadingText } from "./InteractiveReadingText";

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
      content: "您好！我是您的 AI 英語教學助理。今天我可以如何協助提升學生的英語學習？",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: "2", 
      sender: "teacher",
      content: "我擔心 Emma 的英文發音與口說自信，她似乎對口語活動有所猶豫。",
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: "3",
      sender: "agent", 
      content: "根據分析，Emma 的閱讀理解良好，但口說信心不足。我建議進行配對練習、搭配錄音的發音訓練，並營造支持性的口說環境。使用互動說話遊戲與同儕合作能大幅提升她的參與度。",
      timestamp: new Date(Date.now() - 180000)
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [showInteractiveReading, setShowInteractiveReading] = useState(false);

  const englishLearningResponses = [
    "這是關於英文學習的好問題。讓我分析學生的語言習得模式並提供目標字彙練習建議。",
    "建議加入更多互動式聽力活動及發音練習，以提升英文流利度。",
    "根據學習資料，學生適合進行加強文法與口說練習。",
    "可以實施循序漸進的閱讀理解課程來增進英文能力。",
    "以下是提升寫作技巧與句構理解的具體策略。"
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

  if (showInteractiveReading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">互動式閱讀</h2>
          <Button
            variant="outline"
            onClick={() => setShowInteractiveReading(false)}
          >
            返回聊天
          </Button>
        </div>
        <InteractiveReadingText />
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">教師與 AI 聊天</CardTitle>
                <p className="text-sm text-muted-foreground">與 AI 教學助理協作</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInteractiveReading(true)}
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>互動式閱讀</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
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
                            AI 助理
                          </Badge>
                        </>
                      )}
                      {message.sender === 'teacher' && (
                        <>
                          <User className="h-4 w-4 text-blue-600" />
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            老師
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
          </ScrollArea>
          
          <div className="border-t p-4 flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="輸入訊息..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
