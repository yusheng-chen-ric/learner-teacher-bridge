
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface PronunciationFeedbackProps {
  audioBlob: Blob;
  originalText: string;
  onClose: () => void;
}

export const PronunciationFeedback = ({ audioBlob, originalText, onClose }: PronunciationFeedbackProps) => {
  // Simulate pronunciation analysis results
  const accuracyScore = Math.floor(Math.random() * 30) + 70; // 70-100%
  const phonemeIssues = [
    { phoneme: "/θ/", word: "think", issue: "Pronounced as /s/" },
    { phoneme: "/ɹ/", word: "really", issue: "Too soft" }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: "Excellent", color: "bg-green-100 text-green-800" };
    if (score >= 75) return { text: "Good", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Needs Practice", color: "bg-red-100 text-red-800" };
  };

  const badge = getScoreBadge(accuracyScore);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <Card 
        className="w-96 max-w-[90vw] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              發音分析
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">準確度</span>
              <Badge variant="secondary" className={badge.color}>
                {badge.text}
              </Badge>
            </div>
            <Progress value={accuracyScore} className="h-3" />
            <div className={`text-right mt-1 text-lg font-bold ${getScoreColor(accuracyScore)}`}>
              {accuracyScore}%
            </div>
          </div>
          
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <strong>你的朗讀：</strong>"{originalText}"
          </div>
          
          {phonemeIssues.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-600 mr-1" />
                需要改進的部分
              </h4>
              <div className="space-y-2">
                {phonemeIssues.map((issue, index) => (
                  <div key={index} className="text-xs bg-yellow-50 p-2 rounded border-l-2 border-yellow-400">
                    <div className="font-medium">"{issue.word}" - {issue.phoneme}</div>
                    <div className="text-gray-600">{issue.issue}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <Button 
              onClick={onClose}
              className="w-full"
              variant="outline"
            >
              繼續閱讀
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
