
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, Eye, Target, BookOpen } from 'lucide-react';
import { Heatmap } from '@/components/report/Heatmap';
import type { ReportData } from '@/types';
import { useReviewWords } from '@/hooks/useReviewWords';

export const ReportPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addWord } = useReviewWords();

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock report data
      const mockReport: ReportData = {
        summary: {
          readingTime: 185000, // 3 minutes 5 seconds
          avgFixationDuration: 250,
          regressionRate: 12,
          focusScore: 85,
          wordsRead: 87,
          comprehensionLevel: 'high'
        },
        heatmapData: [
          { x: 100, y: 200, value: 0.8 },
          { x: 150, y: 220, value: 0.6 },
          { x: 200, y: 240, value: 0.9 }
        ],
        highlightSentences: ['sentence-2', 'sentence-5'],
        difficultWords: [
          { word: 'pronunciation', fixationTime: 1200, lookupCount: 1 },
          { word: 'comprehension', fixationTime: 800, lookupCount: 1 },
          { word: 'particularly', fixationTime: 600, lookupCount: 0 }
        ]
      };
      
      setReportData(mockReport);
      setIsLoading(false);
    };

    fetchReport();
  }, [sessionId]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const getComprehensionColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your reading report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load report data.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Reading Analysis Report</h1>
            <Button size="sm" className="ml-2" onClick={() => navigate('/')}>Finish</Button>
          </div>
          
          <Badge variant="secondary">Session ID: {sessionId}</Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatTime(reportData.summary.readingTime)}
                  </p>
                  <p className="text-sm text-gray-600">Reading Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Eye className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {reportData.summary.avgFixationDuration}ms
                  </p>
                  <p className="text-sm text-gray-600">Avg. Fixation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {reportData.summary.focusScore}%
                  </p>
                  <p className="text-sm text-gray-600">Focus Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-orange-600" />
                <div>
                  <Badge className={getComprehensionColor(reportData.summary.comprehensionLevel)}>
                    {reportData.summary.comprehensionLevel.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">Comprehension</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="difficulties">Difficulties</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Reading Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Words Read:</span>
                        <span className="font-medium">{reportData.summary.wordsRead}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Regression Rate:</span>
                        <span className="font-medium">{reportData.summary.regressionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reading Speed:</span>
                        <span className="font-medium">
                          {Math.round((reportData.summary.wordsRead / reportData.summary.readingTime) * 60000)} WPM
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Focus Analysis</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Overall Focus:</span>
                        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Distraction Events:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Longest Focus Streak:</span>
                        <span className="font-medium">45 seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="difficulties" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Words That Required Extra Attention</h3>
                  <div className="space-y-3">
                    {reportData.difficultWords.map((word, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{word.word}</span>
                          {word.lookupCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              Looked up {word.lookupCount}x
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{word.fixationTime}ms fixation</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addWord(word.word)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Sentences That Caused Regression</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    These sentences required re-reading, indicating potential comprehension difficulties:
                  </p>
                  <div className="space-y-2">
                    {reportData.highlightSentences.map((sentenceId, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {sentenceId.replace('sentence-', 'Sentence ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Vocabulary Development</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Focus on pronunciation patterns, especially 'th' sounds</li>
                      <li>• Practice words ending in '-tion' and '-ness'</li>
                      <li>• Use flashcards for difficult vocabulary</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Reading Strategies</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Continue with current reading pace - it's optimal</li>
                      <li>• Try to reduce regression by previewing sentence structure</li>
                      <li>• Practice reading similar texts to build fluency</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Next Steps</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Try reading texts with similar complexity level</li>
                      <li>• Focus on grammar patterns in complex sentences</li>
                      <li>• Consider speaking practice to improve overall fluency</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="heatmap" className="pt-4">
                <Heatmap points={reportData.heatmapData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
