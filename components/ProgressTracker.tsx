'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { Stage } from '@/app/page';

interface ProgressTrackerProps {
  currentStage: Stage;
  completedStages: Stage[];
  onStageClick: (stage: Stage) => void;
}

const stages: { id: Stage; label: string }[] = [
  { id: 'idea', label: 'Idea Generation' },
  { id: 'script', label: 'Script Creation' },
  { id: 'broll', label: 'B-roll Prompting' },
  { id: 'video', label: 'Video Generation' },
];

export default function ProgressTracker({
  currentStage,
  completedStages,
  onStageClick,
}: ProgressTrackerProps) {
  const currentIndex = stages.findIndex((s) => s.id === currentStage);

  return (
    <div className="bg-dark-surface rounded-xl p-6 border border-dark-border">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = completedStages.includes(stage.id);
          const isCurrent = stage.id === currentStage;
          const isAccessible = isCompleted || index <= currentIndex;

          return (
            <div key={stage.id} className="flex items-center flex-1">
              <button
                onClick={() => isAccessible && onStageClick(stage.id)}
                disabled={!isAccessible}
                className={`flex items-center gap-3 transition-all ${
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    isCompleted
                      ? 'bg-accent-success text-white'
                      : isCurrent
                      ? 'bg-accent-primary text-white'
                      : 'bg-dark-elevated border-2 border-dark-border text-dark-muted'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <div className="text-left">
                  <div
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-accent-primary'
                        : isCompleted
                        ? 'text-accent-success'
                        : 'text-dark-muted'
                    }`}
                  >
                    {stage.label}
                  </div>
                  <div className="text-xs text-dark-muted">
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </div>
                </div>
              </button>

              {index < stages.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${
                    completedStages.includes(stage.id)
                      ? 'bg-accent-success'
                      : 'bg-dark-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
