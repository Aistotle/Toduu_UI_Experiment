import React from 'react';
import { ScrollStep } from '../../components/ScrollStep';

const voices = [
  {
    title: 'Serif',
    description: '“I speak with tradition and ceremony.”',
    className: 'font-serif italic'
  },
  {
    title: 'Mono',
    description: '“I read like code: precise, technical, honest.”',
    className: 'font-mono'
  },
  {
    title: 'Sans',
    description: '“I sound modern, bold, and immediate.”',
    className: 'font-sans font-black'
  }
];

export const Idea02VoiceCards: React.FC = () => {
  return (
    <section className="rounded-[32px] border border-black/10 bg-white/90 p-8 md:p-12">
      <div className="text-center mb-10">
        <p className="text-xs font-mono uppercase tracking-[0.6em] text-black/50">Idea 02 · Typeface = Voice</p>
        <h3 className="mt-4 text-4xl font-semibold">Type choice is casting.</h3>
        <p className="mt-3 text-black/60">Cards animate in as you scroll—mirroring the IntersectionObserver micro reveals from the HTML prototype.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {voices.map((voice) => (
          <ScrollStep key={voice.title}>
            {({ visible }) => (
              <article className={`rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-transform duration-500 ${visible ? 'translate-y-0' : 'translate-y-6'}`}>
                <p className="text-xs uppercase tracking-[0.4em] text-black/40">{voice.title}</p>
                <p className={`mt-4 text-xl text-black ${voice.className}`}>{voice.description}</p>
              </article>
            )}
          </ScrollStep>
        ))}
      </div>
    </section>
  );
};

export default Idea02VoiceCards;
