import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { cn } from '../../lib/utils';

interface ValidationScoreProps {
  clientId: string;
  score?: number;
}

export function ValidationScore({ clientId, score = 0 }: ValidationScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedScore(prev => {
        const next = prev + 1;
        if (next >= score) {
          clearInterval(timer);
          return score;
        }
        return next;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (value: number) => {
    if (value >= 80) return '#22c55e';
    if (value >= 60) return '#eab308';
    return '#ef4444';
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Validation Score
      </h3>
      <div className="flex items-center justify-center">
        <div className="w-32 h-32 sm:w-40 sm:h-40">
          <CircularProgressbar
            value={animatedScore}
            text={`${animatedScore}%`}
            styles={buildStyles({
              textSize: '16px',
              pathColor: getScoreColor(animatedScore),
              textColor: '#6b7280',
              trailColor: '#e5e7eb',
              pathTransition: 'stroke-dashoffset 0.5s ease 0s',
            })}
            aria-label={`Validation score: ${animatedScore}%`}
            role="progressbar"
            aria-valuenow={animatedScore}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className={cn(
          "text-sm font-medium",
          animatedScore >= 80 ? "text-green-500" :
          animatedScore >= 60 ? "text-yellow-500" :
          "text-red-500"
        )}>
          {getScoreLabel(animatedScore)}
        </p>
      </div>
    </div>
  );
}