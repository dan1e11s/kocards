import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useStudySession,
  useMultipleChoice,
  useTypingAnswer,
  type QuestionType,
  type StudyMode,
} from '../hooks';
import {
  QuestionCard,
  MultipleChoiceOptions,
  TypingQuestion,
  StudyHeader,
} from '../components/features';
import { Card } from '../components/ui';

export default function Learn() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode: StudyMode = (searchParams.get('mode') as StudyMode) || 'practice';

  const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice');

  const {
    currentCard,
    sessionCards,
    currentIndex,
    stats,
    progress,
    isLoading,
    submitAnswer,
    nextCard,
  } = useStudySession(id!, mode);

  const multipleChoice = useMultipleChoice(currentCard, sessionCards);
  const typingAnswer = useTypingAnswer(currentCard);

  // Generate question type when card changes
  useEffect(() => {
    if (!currentCard) return;

    // 70% quiz, 30% typing
    const type: QuestionType = Math.random() > 0.3 ? 'multiple-choice' : 'typing';
    setQuestionType(type);

    multipleChoice.reset();
    typingAnswer.reset();
  }, [currentCard]);

  const handleMultipleChoiceAnswer = (answer: string) => {
    const correct = multipleChoice.selectAnswer(answer);
    if (correct !== undefined) {
      submitAnswer(currentCard!.id, correct);
      // Auto-advance after 1.5s
      setTimeout(() => handleNext(), 1500);
    }
  };

  const handleTypingSubmit = () => {
    const correct = typingAnswer.submitAnswer();
    if (correct !== undefined) {
      submitAnswer(currentCard!.id, correct);
    }
  };

  const handleNext = () => {
    const hasNext = nextCard();
    if (!hasNext) {
      navigate(`/decks/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cards...</p>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No cards to study</p>
          <Link to={`/decks/${id}`} className="text-indigo-600 hover:underline">
            Back to deck
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <StudyHeader
        deckId={id!}
        progress={progress}
        correctCount={stats.correct}
        currentCount={currentIndex + 1}
        streak={stats.streak}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <QuestionCard
              question={currentCard.back}
              pronunciation={currentCard.pronunciation}
              questionType={questionType}
              cardNumber={currentIndex + 1}
              totalCards={sessionCards.length}
            />

            {questionType === 'multiple-choice' ? (
              <MultipleChoiceOptions
                options={multipleChoice.options}
                selectedAnswer={multipleChoice.selectedAnswer}
                correctAnswer={currentCard.front}
                onSelectAnswer={handleMultipleChoiceAnswer}
                disabled={multipleChoice.selectedAnswer !== null}
              />
            ) : (
              <TypingQuestion
                typedAnswer={typingAnswer.typedAnswer}
                onTypedAnswerChange={typingAnswer.setTypedAnswer}
                onSubmit={handleTypingSubmit}
                onNext={handleNext}
                showResult={typingAnswer.showResult}
                isCorrect={typingAnswer.isCorrect}
                correctAnswer={currentCard.front}
                disabled={typingAnswer.showResult}
              />
            )}

            {currentCard.notes && multipleChoice.selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Card variant="info">
                  <p className="text-sm font-semibold text-blue-800 mb-1">Note:</p>
                  <p className="text-blue-900">{currentCard.notes}</p>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
