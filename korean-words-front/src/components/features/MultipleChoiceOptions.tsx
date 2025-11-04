import { HiCheckCircle, HiXCircle } from 'react-icons/hi';

interface MultipleChoiceOptionsProps {
  options: string[];
  selectedAnswer: string | null;
  correctAnswer: string;
  onSelectAnswer: (answer: string) => void;
  disabled: boolean;
}

export function MultipleChoiceOptions({
  options,
  selectedAnswer,
  correctAnswer,
  onSelectAnswer,
  disabled,
}: MultipleChoiceOptionsProps) {
  const showResult = selectedAnswer !== null;

  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === option;
        const isCorrectAnswer = option === correctAnswer;

        let buttonClass =
          'btn bg-white border-2 border-gray-200 text-gray-800 hover:border-indigo-300 hover:bg-indigo-50 text-xl sm:text-2xl py-6';

        if (showResult) {
          if (isCorrectAnswer) {
            buttonClass =
              'btn bg-green-500 border-green-600 text-white text-xl sm:text-2xl py-6';
          } else if (isSelected && !isCorrectAnswer) {
            buttonClass =
              'btn bg-red-500 border-red-600 text-white text-xl sm:text-2xl py-6';
          }
        }

        return (
          <button
            key={index}
            onClick={() => onSelectAnswer(option)}
            disabled={disabled}
            className={buttonClass}
          >
            <span className="flex items-center justify-between w-full">
              <span>{option}</span>
              {showResult && isCorrectAnswer && <HiCheckCircle className="text-3xl" />}
              {showResult && isSelected && !isCorrectAnswer && <HiXCircle className="text-3xl" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
