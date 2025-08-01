

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReviewWords } from '@/hooks/useReviewWords';
import { splitIntoSyllables } from '@/lib/syllables';


export const VocabularyReviewPage = () => {
  const { words, removeWord } = useReviewWords();
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>沒有需要複習的單字。</p>
          <Button onClick={() => navigate("/")}>返回儀表板</Button>
        </div>
      </div>
    );
  }

  const word = words[index];
  const syllables = splitIntoSyllables(word);

  const handleKnown = () => {
    removeWord(word);
    if (index >= words.length - 1) {
      navigate("/");
    } else {
      setIndex((prev) => Math.min(prev, words.length - 2));
    }
  };

  const handleAgain = () => {
    setIndex((index + 1) % words.length);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle>單字複習</CardTitle>
          <div className="mt-2 text-sm text-muted-foreground">
            {index + 1} / {words.length}
          </div>
          <Progress
            value={((index + 1) / words.length) * 100}
            className="mt-2"
          />
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="text-4xl font-bold py-10">{word}</div>
          <div className="flex justify-around space-x-4">
            <Button
              onClick={handleKnown}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              記得
            </Button>
            <Button variant="outline" onClick={handleAgain} className="flex-1">
              再一次
            </Button>

        <CardContent className="space-y-4 text-center">
          <div className="text-3xl font-bold flex justify-center space-x-1">
            {syllables.map((syl, i) => (
              <span key={i}>
                {syl}
                {i < syllables.length - 1 && (
                  <span className="text-blue-600">•</span>
                )}
              </span>
            ))}
          </div>
          <div className="flex justify-around">
            <Button onClick={handleKnown} className="bg-green-600 hover:bg-green-700">記得</Button>
            <Button variant="outline" onClick={handleAgain}>再一次</Button>

          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            完成
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VocabularyReviewPage;
