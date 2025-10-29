import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '../services/api';
import { Difficulty, type Card } from '../types/index.js';

export default function Study() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCards, setSessionCards] = useState<Card[]>([]);

  const { data: dueCards, isLoading } = useQuery({
    queryKey: ['due-cards', id],
    queryFn: () => cardsApi.getDueCards(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (dueCards) {
      setSessionCards(dueCards);
    }
  }, [dueCards]);

  const reviewMutation = useMutation({
    mutationFn: ({ cardId, difficulty }: { cardId: string; difficulty: Difficulty }) =>
      cardsApi.review(cardId, { difficulty }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['due-cards', id] });
      queryClient.invalidateQueries({ queryKey: ['deck-stats', id] });
    },
  });

  const handleReview = (difficulty: Difficulty) => {
    const currentCard = sessionCards[currentIndex];
    if (!currentCard) return;

    reviewMutation.mutate({ cardId: currentCard.id, difficulty });

    // Move to next card
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Session complete
      navigate(`/decks/${id}`);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!sessionCards || sessionCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">No cards to study!</h2>
          <p className="text-gray-600 mb-6">
            All cards have been reviewed. Come back later!
          </p>
          <Link to={`/decks/${id}`} className="btn btn-primary">
            Back to Deck
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = sessionCards[currentIndex];
  const progress = ((currentIndex + 1) / sessionCards.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to={`/decks/${id}`} className="text-blue-600 hover:underline">
            ← Exit Study
          </Link>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {sessionCards.length}
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div
            onClick={handleFlip}
            className="card cursor-pointer min-h-[320px] sm:min-h-[400px] flex flex-col items-center justify-center text-center active:shadow-2xl transition-shadow p-6 sm:p-8"
            style={{ touchAction: 'manipulation' }}
          >
            <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-3 sm:mb-4">
              {isFlipped ? 'Translation' : 'Korean'}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 break-words px-2">
              {isFlipped ? currentCard.back : currentCard.front}
            </h2>
            {isFlipped && currentCard.pronunciation && (
              <p className="text-base sm:text-lg text-gray-600 mb-2">
                [{currentCard.pronunciation}]
              </p>
            )}
            {isFlipped && currentCard.notes && (
              <p className="text-sm sm:text-base text-gray-600 mt-4 px-2">{currentCard.notes}</p>
            )}
            {!isFlipped && (
              <p className="text-sm text-gray-400 mt-6 sm:mt-8">
                Tap to reveal translation
              </p>
            )}
          </div>
        </div>

        {/* Review Buttons - Mobile Optimized */}
        {isFlipped && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <button
              onClick={() => handleReview(Difficulty.HARD)}
              className="btn bg-red-500 text-white hover:bg-red-600 py-5 sm:py-6 flex flex-col items-center justify-center gap-1"
            >
              <div className="text-base sm:text-lg font-semibold">Hard</div>
              <div className="text-xs opacity-90">+1 day</div>
            </button>
            <button
              onClick={() => handleReview(Difficulty.NORMAL)}
              className="btn bg-yellow-500 text-white hover:bg-yellow-600 py-5 sm:py-6 flex flex-col items-center justify-center gap-1"
            >
              <div className="text-base sm:text-lg font-semibold">Normal</div>
              <div className="text-xs opacity-90">+3 days</div>
            </button>
            <button
              onClick={() => handleReview(Difficulty.EASY)}
              className="btn bg-green-500 text-white hover:bg-green-600 py-5 sm:py-6 flex flex-col items-center justify-center gap-1"
            >
              <div className="text-base sm:text-lg font-semibold">Easy</div>
              <div className="text-xs opacity-90">+7 days</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
