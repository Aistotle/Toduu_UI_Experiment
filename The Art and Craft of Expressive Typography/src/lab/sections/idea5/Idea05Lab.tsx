import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { SliderControl } from '../../components/SliderControl';

const Hero: React.FC = () => {
  return (
    <section className="min-h-[60vh] space-y-10 text-left">
      <div className="flex items-center gap-4 text-xs uppercase tracking-[0.6em] text-black/60">
        <span className="w-10 h-px bg-black/30" />
        <span>Idea 05 · Framer Motion Chapters</span>
      </div>
      <div className="space-y-4">
        {['The Art', '& Craft', 'of Typography'].map((line, index) => (
          <motion.h2
            key={line}
            className={`text-5xl md:text-7xl font-serif ${index === 1 ? 'italic font-light' : 'font-semibold'}`}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 * index, duration: 0.8, ease: 'easeOut' }}
          >
            {line}
          </motion.h2>
        ))}
      </div>
      <motion.p
        className="max-w-xl text-lg text-black/70"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        Idea 05 leaned on Framer Motion for micro-interactions. This React version keeps the same cinematic timing while staying compatible with our Vite build.
      </motion.p>
    </section>
  );
};

const ScaleChapter: React.FC = () => {
  const [scale, setScale] = useState(60);

  return (
    <section className="grid gap-8 rounded-[32px] border border-black/10 bg-white/90 p-8 md:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-4">
        <p className="text-xs font-mono uppercase tracking-[0.5em] text-black/50">Chapter 01 · Scale</p>
        <h3 className="text-4xl font-serif">Hierarchy through size</h3>
        <p className="text-base text-black/70">
          A dial in the HTML prototype resized a large specimen (“Ag”). Here we animate the same glyph using Framer Motion so it eases to the new value instead of jumping.
        </p>
        <SliderControl
          label="Scale"
          value={scale}
          min={20}
          max={150}
          step={5}
          unitLabel="px"
          helperText="Drag to shout or whisper."
          onChange={setScale}
        />
      </div>
      <motion.div
        className="flex items-center justify-center rounded-3xl border border-black/10 bg-white"
        animate={{}}
      >
        <motion.span
          className="font-serif leading-none"
          animate={{ fontSize: `${scale}px` }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          Ag
        </motion.span>
      </motion.div>
    </section>
  );
};

const Idea05Lab: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="space-y-12">
      <motion.div className="h-1 w-full origin-left rounded-full bg-black" style={{ scaleX }} />
      <Hero />
      <ScaleChapter />
    </div>
  );
};

export default Idea05Lab;
