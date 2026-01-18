import React, { useState } from 'react';
import { ScrollStep } from '../../components/ScrollStep';

export const Idea02SilenceBox: React.FC = () => {
  const [hover, setHover] = useState(false);

  return (
    <section className="rounded-[32px] border border-black/10 bg-white/90 p-8 md:p-12">
      <ScrollStep>
        {() => (
          <div className="text-center">
            <p className="text-xs font-mono uppercase tracking-[0.6em] text-black/50">Idea 02 · Silence</p>
            <h3 className="mt-4 text-4xl font-semibold">Negative space is an instrument.</h3>
            <p className="mt-3 text-black/60">Hover to feel how the copy fades into quiet—preserving the behavior from the standalone HTML version.</p>
          </div>
        )}
      </ScrollStep>
      <div
        className="mt-10 flex min-h-[40vh] items-center justify-center rounded-[28px] border border-black/10 bg-white shadow-inner transition-colors"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <p className={`text-xl tracking-[0.4em] uppercase text-black/40 transition-opacity duration-700 ${hover ? 'opacity-0' : 'opacity-100'}`}>
          Hover to feel silence
        </p>
      </div>
    </section>
  );
};

export default Idea02SilenceBox;
