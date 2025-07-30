import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReviewWords } from '@/hooks/useReviewWords';

export const VocabularyReviewPage = () => {
  const { words, removeWord } = useReviewWords();
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>No words to review.</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const word = words[index];

  const handleKnown = () => {
    removeWord(word);
    if (index >= words.length - 1) {
      navigate('/');
    } else {
      setIndex(prev => Math.min(prev, words.length - 2));
    }
  };

  const handleAgain = () => {
    setIndex((index + 1) % words.length);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Anki Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-3xl font-bold">{word}</div>
          <div className="flex justify-around">
            <Button onClick={handleKnown} className="bg-green-600 hover:bg-green-700">Know</Button>
            <Button variant="outline" onClick={handleAgain}>Again</Button>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>Done</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VocabularyReviewPage;
