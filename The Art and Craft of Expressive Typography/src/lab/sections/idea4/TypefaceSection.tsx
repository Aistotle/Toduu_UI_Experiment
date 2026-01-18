import React, { useState } from 'react';
import { SplitSection } from '../../components/SplitSection';

const options = [
  { id: 'inter', label: 'Sans', className: 'font-sans', blurb: 'Clean, modern, approachable.' },
  { id: 'serif', label: 'Serif', className: 'font-serif italic', blurb: 'Elegant, literary, timeless.' },
  { id: 'mono', label: 'Mono', className: 'font-mono', blurb: 'Precise, technical, honest.' },
];

export const Idea04TypefaceSection: React.FC = () => {
  const [active, setActive] = useState(options[0]);

  return (
    <SplitSection
      reverse
      left={(
        <>
          <p className="text-xs font-mono uppercase tracking-[0.5em] text-black/50">Typeface = Voice</p>
          <h3 className="text-4xl font-light">Choose the narrator.</h3>
          <p>Idea 04 cycled through buttons to swap copy tone. Here, each button toggles the specimen voice and descriptive blurb.</p>
        </>
      )}
      right={(
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setActive(option)}
                className={`rounded-full border px-4 py-2 text-sm uppercase tracking-[0.3em] transition ${
                  active.id === option.id ? 'bg-black text-white border-black' : 'border-black/20 text-black/60'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className={`text-3xl text-black ${active.className}`}>“{active.blurb}”</p>
        </div>
      )}
    />
  );
};

export default Idea04TypefaceSection;
