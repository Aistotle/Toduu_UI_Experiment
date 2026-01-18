import React, { useState } from 'react';

const passages = [
  {
    id: 'tight',
    leading: 1,
    copy: [
      'Tight rhythm creates',
      'intensity and urgency',
      'demanding attention',
    ],
  },
  {
    id: 'balanced',
    leading: 1.6,
    copy: [
      'Comfortable spacing allows',
      'the reader to breathe',
      'and absorb each thought',
    ],
  },
  {
    id: 'generous',
    leading: 2.5,
    copy: [
      'Generous line height',
      '',
      'creates contemplative',
      '',
      'peaceful moments',
    ],
  },
];

export const Idea01RhythmVignette: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className="rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-10 text-center">
      <div className="space-y-4">
        <p className="text-xs font-mono uppercase tracking-[0.6em] text-slate-500">Idea 01 · Rhythm</p>
        <h3 className="text-4xl md:text-5xl font-playfair font-bold text-slate-900">The breath between lines</h3>
        <p className="text-base md:text-lg text-slate-600">
          Adjusting line height is like setting the cadence of a conversation. Hover each block to feel the shift in pace.
        </p>
      </div>
      <div className="mt-12 grid gap-8">
        {passages.map(({ id, leading, copy }) => (
          <div
            key={id}
            onMouseEnter={() => setActiveId(id)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(id)}
            onBlur={() => setActiveId(null)}
            className="rounded-3xl border border-white/60 bg-white/70 px-6 py-8 shadow-[0_20px_50px_rgba(46,91,255,0.08)] transition duration-300"
            style={{
              lineHeight: leading,
              transform: activeId === id ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: activeId === id ? '0 35px 80px rgba(76,81,191,0.25)' : undefined,
            }}
          >
            <p className="text-2xl md:text-3xl text-slate-800">
              {copy.map((line, idx) => (
                <React.Fragment key={`${id}-${idx}`}>
                  {line}
                  {idx !== copy.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-slate-500">
              Line height&nbsp;
              <span className="font-semibold text-slate-900">{leading.toFixed(1)}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Idea01RhythmVignette;
