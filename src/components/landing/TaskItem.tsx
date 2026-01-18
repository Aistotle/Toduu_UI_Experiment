import { useEffect, useState, useRef } from 'react';

interface TaskItemProps {
  text: string;
  completed: boolean;
  animateCompletion?: boolean;
}

export function TaskItem({ text, completed, animateCompletion = false }: TaskItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCompleted, setShowCompleted] = useState(completed && !animateCompletion);
  const checkmarkRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (animateCompletion && completed && !showCompleted) {
      setIsAnimating(true);

      // Sequence the animation phases
      const timer = setTimeout(() => {
        setShowCompleted(true);
        setIsAnimating(false);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [completed, animateCompletion, showCompleted]);

  const checkboxClasses = `
    relative w-5 h-5 rounded-sm border-2 flex-shrink-0
    transition-all duration-normal ease-ds
    ${showCompleted || isAnimating
      ? 'bg-accent border-accent'
      : 'border-ink-muted/40 bg-transparent'
    }
  `;

  const textClasses = `
    font-sans text-base transition-all duration-normal ease-ds
    ${showCompleted
      ? 'text-ink-muted line-through'
      : 'text-ink'
    }
  `;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className={checkboxClasses}>
        {(showCompleted || isAnimating) && (
          <svg
            className="absolute inset-0 w-full h-full p-0.5"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              ref={checkmarkRef}
              d="M3 8L6.5 11.5L13 4.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`
                ${isAnimating ? 'animate-checkmark' : ''}
              `}
              style={{
                strokeDasharray: isAnimating ? 20 : 0,
                strokeDashoffset: isAnimating ? 20 : 0,
                animation: isAnimating ? 'drawCheckmark 200ms ease-out forwards' : 'none',
              }}
            />
          </svg>
        )}
      </div>
      <span className={textClasses}>{text}</span>

      <style>{`
        @keyframes drawCheckmark {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
