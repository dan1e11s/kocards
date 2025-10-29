import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiArrowLeft, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { cardsApi } from '../services/api';
import { Difficulty, type Card } from '../types/index.js';

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<Card[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { data: dueCards, isLoading } = useQuery({
    queryKey: ['due-cards', id],
    queryFn: () => cardsApi.getDueCards(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (dueCards && dueCards.length > 0) {
      setSessionCards(dueCards);
      generateOptions(dueCards[0], dueCards);
    }
  }, [dueCards]);

  const generateOptions = (currentCard: Card, allCards: Card[]) => {
    const correctAnswer = currentCard.back;
    const wrongAnswers = allCards
      .filter((card) => card.id !== currentCard.id)
      .map((card) => card.back)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const reviewMutation = useMutation({
    mutationFn: ({ cardId, difficulty }: { cardId: string; difficulty: Difficulty }) =>
      cardsApi.review(cardId, { difficulty }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['due-cards', id] });
      queryClient.invalidateQueries({ queryKey: ['deck-stats', id] });
    },
  });

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;

    const currentCard = sessionCards[currentIndex];
    const correct = answer === currentCard.back;

    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);

    // Auto-submit review
    const difficulty = correct ? Difficulty.EASY : Difficulty.HARD;
    reviewMutation.mutate({ cardId: currentCard.id, difficulty });
  };

  const handleNext = () => {
    if (currentIndex < sessionCards.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateOptions(sessionCards[nextIndex], sessionCards);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // Quiz complete
      navigate(`/decks/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            to={`/decks/${id}`}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <HiArrowLeft className="text-xl" />
            Exit Quiz
          </Link>
          <span className="text-sm font-medium text-gray-600">
            {currentIndex + 1} / {sessionCards.length}
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card - Mobile Optimized */}
        <div className="card mb-6 sm:mb-8 p-6 sm:p-8">
          <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase mb-3 sm:mb-4 text-center">
            What is the translation?
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-2 text-gray-800 break-words px-2">
            {currentCard.front}
          </h2>
          {currentCard.pronunciation && (
            <p className="text-base sm:text-lg text-gray-600 text-center mt-2">
              [{currentCard.pronunciation}]
            </p>
          )}
        </div>

        {/* Options - Mobile Optimized */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentCard.back;

            let buttonClass = 'card-interactive text-left';
            if (showResult) {
              if (isCorrectAnswer) {
                buttonClass = 'card bg-green-50 border-2 border-green-500 text-left';
              } else if (isSelected && !isCorrect) {
                buttonClass = 'card bg-red-50 border-2 border-red-500 text-left';
              } else {
                buttonClass = 'card opacity-50 text-left';
              }
            } else if (isSelected) {
              buttonClass = 'card border-2 border-indigo-500 text-left';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={buttonClass}
                style={{ touchAction: 'manipulation', minHeight: '60px' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg sm:text-xl font-semibold break-words text-left flex-1">{option}</span>
                  {showResult && isCorrectAnswer && (
                    <HiCheckCircle className="text-2xl sm:text-3xl text-green-600 flex-shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <HiXCircle className="text-2xl sm:text-3xl text-red-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Result & Next Button */}
        {showResult && (
          <div className="text-center">
            {isCorrect ? (
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-full font-semibold">
                  <HiCheckCircle className="text-2xl" />
                  Correct!
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 text-red-800 rounded-full font-semibold mb-4">
                  <HiXCircle className="text-2xl" />
                  Incorrect
                </div>
                {currentCard.notes && (
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    <span className="font-semibold">Note:</span> {currentCard.notes}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleNext}
              className="btn btn-primary px-8 py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              {currentIndex < sessionCards.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
