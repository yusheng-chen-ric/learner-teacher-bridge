import { useState, useEffect } from 'react';

const STORAGE_KEY = 'reviewWords';

export const useReviewWords = () => {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWords(JSON.parse(stored));
      } catch {
        setWords([]);
      }
    }
  }, []);

  const addWord = (word: string) => {
    setWords(prev => {
      if (prev.includes(word)) return prev;
      const updated = [...prev, word];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeWord = (word: string) => {
    setWords(prev => {
      const updated = prev.filter(w => w !== word);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearWords = () => {
    localStorage.removeItem(STORAGE_KEY);
    setWords([]);
  };

  return { words, addWord, removeWord, clearWords };
};
