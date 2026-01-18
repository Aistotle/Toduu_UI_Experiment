import React, { useRef } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

interface ChapterProps {
  title?: string;
  explanation?: string;
  content: (progress: number) => React.ReactNode;
  isStandalone?: boolean;
}

export const Chapter: React.FC<ChapterProps> = ({ title, explanation, content, isStandalone = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(ref);

  const wrapperClasses = isStandalone
    ? ''
    : 'min-h-screen flex flex-col items-center justify-center py-40 px-4';

  return (
    <div ref={ref} className={wrapperClasses}>
      {title && (
        <h2 className="text-2xl md:text-3xl font-medium mb-6 text-center">{title}</h2>
      )}
      <div className="w-full flex items-center justify-center">
        {content(progress)}
      </div>
      {explanation && (
        <p className="max-w-2xl text-center text-base md:text-lg font-light mt-16 text-neutral-600">
          {explanation}
        </p>
      )}
    </div>
  );
};
