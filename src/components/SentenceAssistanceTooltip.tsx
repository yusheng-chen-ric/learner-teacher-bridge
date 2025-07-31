
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SentenceAssistanceProps {
  sentence: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export const SentenceAssistanceTooltip = ({ sentence, position, onClose }: SentenceAssistanceProps) => {
  const grammarNotes = "此句使用現在完成式，描述從過去開始並持續到現在的動作。";
  const translation = "這個句子的中文翻譯示例如下。";
  const examples = [
    "She has been studying English for three years.",
    "They have lived in Beijing since 2020."
  ];

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <Card 
        className="absolute w-96 shadow-lg border-2 border-green-200"
        style={{
          left: Math.min(position.x, window.innerWidth - 384),
          top: Math.min(position.y + 20, window.innerHeight - 300),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
                文法分析
              </Badge>
              <p className="text-sm text-gray-800">{grammarNotes}</p>
            </div>
            
            <div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-2">
                翻譯
              </Badge>
              <p className="text-sm text-gray-800">{translation}</p>
            </div>
            
            <div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 mb-2">
                例句
              </Badge>
              <div className="space-y-1">
                {examples.map((example, index) => (
                  <p key={index} className="text-sm text-gray-700 italic">
                    • {example}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
