import { useState, useEffect } from 'react';
import type { Card } from '../types';

export function useMultipleChoice(currentCard: Card | undefined, allCards: Card[]) {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (!currentCard || allCards.length === 0) return;

    const correctAnswer = currentCard.front;

    // Get 3 random wrong answers
    const otherCards = allCards.filter((c) => c.id !== currentCard.id);
    const wrongAnswers = otherCards
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.front);

    // Shuffle all options
    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);

    // Reset state
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [currentCard, allCards]);

  const selectAnswer = (answer: string) => {
    if (selectedAnswer !== null || !currentCard) return;

    const correct = answer === currentCard.front;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    return correct;
  };

  const reset = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return {
    options,
    selectedAnswer,
    isCorrect,
    selectAnswer,
    reset,
  };
}
