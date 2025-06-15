
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SentenceAssistanceProps {
  sentence: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export const SentenceAssistanceTooltip = ({ sentence, position, onClose }: SentenceAssistanceProps) => {
  const grammarNotes = "This sentence uses present perfect tense to describe an action that started in the past and continues to the present.";
  const translation = "这个句子使用现在完成时来描述从过去开始并持续到现在的动作。";
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
                Grammar Analysis
              </Badge>
              <p className="text-sm text-gray-800">{grammarNotes}</p>
            </div>
            
            <div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-2">
                Translation
              </Badge>
              <p className="text-sm text-gray-800">{translation}</p>
            </div>
            
            <div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 mb-2">
                Examples
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
