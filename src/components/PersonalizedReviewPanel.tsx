
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, RotateCcw, Star, TrendingUp } from "lucide-react";

interface ReviewItem {
  id: string;
  text: string;
  type: 'word' | 'sentence' | 'phrase';
  dwellTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  regressionCount?: number;
}

export const PersonalizedReviewPanel = ({ onClose }: { onClose: () => void }) => {
  const [reviewItems] = useState<ReviewItem[]>([
    {
      id: '1',
      text: 'pronunciation',
      type: 'word',
      dwellTime: 1200,
      difficulty: 'hard'
    },
    {
      id: '2',
      text: 'Emma has been learning English for two years',
      type: 'sentence',
      dwellTime: 2800,
      difficulty: 'medium'
    },
    {
      id: '3',
      text: 'confidence-building exercises',
      type: 'phrase',
      dwellTime: 1800,
      difficulty: 'hard',
      regressionCount: 3
    },
    {
      id: '4',
      text: 'particularly',
      type: 'word',
      dwellTime: 900,
      difficulty: 'medium'
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startPractice = (item: ReviewItem) => {
    console.log(`Starting practice for: ${item.text}`);
    // Launch mini-quiz or flashcard
  };

  const words = reviewItems.filter(item => item.type === 'word');
  const sentences = reviewItems.filter(item => item.type === 'sentence');
  const phrases = reviewItems.filter(item => item.type === 'phrase');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <Card 
        className="w-[90vw] max-w-4xl h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
              個人化複習清單
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
        </CardHeader>
        
        <CardContent className="h-full overflow-y-auto">
          <Tabs defaultValue="words" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="words">單字 ({words.length})</TabsTrigger>
              <TabsTrigger value="sentences">句子 ({sentences.length})</TabsTrigger>
              <TabsTrigger value="phrases">片語 ({phrases.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="words" className="space-y-3">
              {words.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-medium">{item.text}</span>
                      <Badge variant="secondary" className={getDifficultyColor(item.difficulty)}>
                        {item.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        停留 {item.dwellTime} 毫秒
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => startPractice(item)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      練習
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="sentences" className="space-y-3">
              {sentences.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={getDifficultyColor(item.difficulty)}>
                        {item.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        停留 {item.dwellTime} 毫秒
                      </span>
                    </div>
                    <p className="text-base">{item.text}</p>
                    <Button 
                      size="sm" 
                      onClick={() => startPractice(item)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      文法練習
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="phrases" className="space-y-3">
              {phrases.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                        {item.regressionCount && (
                          <Badge variant="outline" className="text-orange-600">
                            <RotateCcw className="h-3 w-3 mr-1" />
                            回視 {item.regressionCount} 次
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        停留 {item.dwellTime} 毫秒
                      </span>
                    </div>
                    <p className="text-base font-medium">{item.text}</p>
                    <Button 
                      size="sm" 
                      onClick={() => startPractice(item)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      片語練習
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
