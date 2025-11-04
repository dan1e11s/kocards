import { motion } from 'framer-motion';
import { HiCheckCircle, HiXCircle, HiCheck } from 'react-icons/hi';
import { Button, Card, Input } from '../ui';

interface TypingQuestionProps {
  typedAnswer: string;
  onTypedAnswerChange: (value: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  showResult: boolean;
  isCorrect: boolean | null;
  correctAnswer: string;
  disabled: boolean;
}

export function TypingQuestion({
  typedAnswer,
  onTypedAnswerChange,
  onSubmit,
  onNext,
  showResult,
  isCorrect,
  correctAnswer,
  disabled,
}: TypingQuestionProps) {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        value={typedAnswer}
        onChange={(e) => onTypedAnswerChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (showResult ? onNext() : onSubmit())}
        placeholder="Type the Korean word..."
        disabled={disabled}
        className="text-2xl sm:text-3xl text-center py-6"
        autoFocus
      />

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant={isCorrect ? 'success' : 'error'}>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <HiCheckCircle className="text-4xl text-green-600 flex-shrink-0" />
              ) : (
                <HiXCircle className="text-4xl text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {!isCorrect && (
                  <p className="text-lg text-gray-700 mt-1">
                    Correct answer: <span className="font-bold text-2xl">{correctAnswer}</span>
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {!showResult && (
        <Button
          onClick={onSubmit}
          disabled={!typedAnswer.trim() || disabled}
          variant="primary"
          size="lg"
          fullWidth
          icon={<HiCheck />}
        >
          Check
        </Button>
      )}

      {showResult && (
        <Button onClick={onNext} variant="primary" size="lg" fullWidth>
          Continue
        </Button>
      )}
    </div>
  );
}
