import { useState } from 'react';
import type { Card } from '../types';

export function useTypingAnswer(currentCard: Card | undefined) {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const submitAnswer = () => {
    if (showResult || !currentCard) return;

    const correct = typedAnswer.trim().toLowerCase() === currentCard.front.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);

    return correct;
  };

  const reset = () => {
    setTypedAnswer('');
    setShowResult(false);
    setIsCorrect(null);
  };

  return {
    typedAnswer,
    setTypedAnswer,
    showResult,
    isCorrect,
    submitAnswer,
    reset,
  };
}
