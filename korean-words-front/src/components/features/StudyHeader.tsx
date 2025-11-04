import { Link } from 'react-router-dom';
import { HiArrowLeft, HiLightningBolt } from 'react-icons/hi';
import { ProgressBar } from '../ui';

interface StudyHeaderProps {
  deckId: string;
  progress: number;
  correctCount: number;
  currentCount: number;
  streak: number;
}

export function StudyHeader({
  deckId,
  progress,
  correctCount,
  currentCount,
  streak,
}: StudyHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <Link to={`/decks/${deckId}`} className="text-gray-600 hover:text-gray-900">
            <HiArrowLeft className="text-2xl" />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold text-indigo-600">
              {correctCount}/{currentCount}
            </span>
            {streak > 0 && (
              <span className="flex items-center gap-1 text-orange-600 font-semibold">
                <HiLightningBolt /> {streak}
              </span>
            )}
          </div>
        </div>
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
}
