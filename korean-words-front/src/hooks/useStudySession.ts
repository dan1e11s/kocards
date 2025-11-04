import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '../services/api';
import { Difficulty, type Card } from '../types';

export type QuestionType = 'multiple-choice' | 'typing';
export type StudyMode = 'review' | 'practice';

interface SessionStats {
  correct: number;
  incorrect: number;
  total: number;
  streak: number;
}

export function useStudySession(deckId: string, mode: StudyMode) {
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<Card[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    correct: 0,
    incorrect: 0,
    total: 0,
    streak: 0,
  });

  // Fetch cards based on mode
  const { data: cards, isLoading, error } = useQuery({
    queryKey: mode === 'review' ? ['due-cards', deckId] : ['all-cards', deckId],
    queryFn: () =>
      mode === 'review'
        ? cardsApi.getDueCards(deckId)
        : cardsApi.getAll(deckId),
    enabled: !!deckId,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ cardId, difficulty }: { cardId: string; difficulty: Difficulty }) =>
      cardsApi.review(cardId, { difficulty }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['due-cards', deckId] });
      queryClient.invalidateQueries({ queryKey: ['deck-stats', deckId] });
    },
  });

  // Initialize session when cards are loaded
  useEffect(() => {
    if (cards && cards.length > 0) {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
      setStats({ correct: 0, incorrect: 0, total: cards.length, streak: 0 });
    }
  }, [cards]);

  const submitAnswer = (cardId: string, correct: boolean) => {
    setStats((prev) => ({
      ...prev,
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
      streak: correct ? prev.streak + 1 : 0,
    }));

    const difficulty = correct ? Difficulty.EASY : Difficulty.HARD;
    reviewMutation.mutate({ cardId, difficulty });
  };

  const nextCard = () => {
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return true;
    }
    return false; // Session complete
  };

  const resetSession = () => {
    setCurrentIndex(0);
    if (cards && cards.length > 0) {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
      setStats({ correct: 0, incorrect: 0, total: cards.length, streak: 0 });
    }
  };

  const currentCard = sessionCards[currentIndex];
  const progress = sessionCards.length > 0 ? ((currentIndex + 1) / sessionCards.length) * 100 : 0;
  const isComplete = currentIndex >= sessionCards.length - 1;

  return {
    // Data
    currentCard,
    sessionCards,
    currentIndex,
    stats,
    progress,
    isComplete,

    // State
    isLoading,
    error,

    // Actions
    submitAnswer,
    nextCard,
    resetSession,
  };
}
