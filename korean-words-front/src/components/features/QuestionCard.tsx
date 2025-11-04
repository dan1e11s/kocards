import { Card } from '../ui';

interface QuestionCardProps {
  question: string;
  pronunciation?: string;
  questionType: string;
  cardNumber: number;
  totalCards: number;
}

export function QuestionCard({
  question,
  pronunciation,
  questionType,
  cardNumber,
  totalCards,
}: QuestionCardProps) {
  return (
    <Card className="shadow-xl">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
          {questionType === 'multiple-choice' ? 'Choose the translation' : 'Type in Korean'}
        </div>

        <div className="py-8">
          <p className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">{question}</p>
          {pronunciation && <p className="text-lg text-gray-500">[{pronunciation}]</p>}
        </div>

        <p className="text-sm text-gray-500">
          Card {cardNumber} of {totalCards}
        </p>
      </div>
    </Card>
  );
}
