import React, { useState, useEffect } from 'react';
import { Chapter } from './components/Chapter';
import {
  BrokenWord, MissingLetterWord, VibrateWord, SquishWord, ExitWord,
  FloatWord, LoopWord, HappyWord, VariableWord, KerningPlay
} from "./components/TypeStudies";

const App: React.FC = () => {
  const [firstVpProgress, setFirstVpProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vpHeight = window.innerHeight;
      const progress = Math.min(1, scrollY / vpHeight);
      setFirstVpProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="bg-[#f8f8f8] text-[#111111] antialiased">
      <main>
        {/* Section 1: Cold Open */}
        <section className="h-screen flex flex-col justify-center items-center p-4">
          <h1 className="text-center text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-none">
            <VariableWord text="EXPRESSIVE" progress={firstVpProgress} />
          </h1>
          <h1 className="text-center text-5xl md:text-8xl lg:text-9xl font-light tracking-widest leading-none mt-2">
            TYPOGRAPHY
          </h1>
        </section>

        {/* Section 2: Thesis */}
        <Chapter
          title="Thesis"
          content={(progress) => (
            <p className="text-3xl md:text-5xl lg:text-6xl max-w-4xl font-light leading-tight text-center">
              Typography isn’t decoration. It’s <VariableWord text="behavior" progress={progress} className="inline-block"/> and voice on a grid.
            </p>
          )}
        />
        
        {/* Section 3: Studies */}
        
        <Chapter
          title="Scale as Meaning"
          explanation="Scale is volume. We grow and shrink to whisper or shout."
          content={(p) => (
            <div className="text-[min(18vw,180px)] font-black leading-none">
              <SquishWord text="LOUD" progress={p} />
            </div>
          )}
        />

        <Chapter
          title="Weight & Gravity"
          explanation="Heavy words feel slow. Light words float."
          content={(p) => (
            <div className="text-[min(14vw,160px)] leading-none">
              <BrokenWord text="broken" pivotIndex={3} progress={p} className="font-black" />
            </div>
          )}
        />

        <Chapter
          title="Presence & Absence"
          explanation="Remove a letter and the mind supplies it. Silence can speak."
          content={() => (
            <div className="text-[min(12vw,120px)] font-semibold">
              <MissingLetterWord text="missing" targetIndex={4} />
            </div>
          )}
        />

        <Chapter
          title="Texture & Nervous Energy"
          explanation="Ghost layers + micro-jitter create the sensation of vibration."
          content={() => (
            <div className="text-[min(18vw,160px)] font-medium">
              <VibrateWord text="vibrate" />
            </div>
          )}
        />

        <Chapter
          title="Elasticity & Pressure"
          explanation="Compression and stretch make type feel physical."
          content={(p) => (
            <div className="text-[min(20vw,180px)] font-black">
              <SquishWord text="squish" progress={p} max={0.35} />
            </div>
          )}
        />

        <Chapter
          title="Path & Pictogram"
          explanation="Letters can act out ideas. A door opens; a letter leans toward escape."
          content={(p) => (
            <div className="text-[min(16vw,160px)]">
              <ExitWord progress={p} />
            </div>
          )}
        />

        <Chapter
          title="Medium as Mood"
          explanation="A sine baseline turns letters into buoys."
          content={() => (
            <div className="text-[min(14vw,140px)] font-extrabold">
              <FloatWord text="FLOAT" amplitude={10} speed={1} />
            </div>
          )}
        />

        <Chapter
          title="Connected Voice"
          explanation="Imply a single continuous stroke across forms."
          content={() => (
            <div className="text-[min(14vw,140px)] font-black">
              <LoopWord text="loop" />
            </div>
          )}
        />

        <Chapter
          title="Play"
          explanation="Not every idea needs a paragraph. Some words just smile."
          content={() => (
            <div className="text-[min(12vw,120px)] font-black">
              <HappyWord text="HAPPY" />
            </div>
          )}
        />

        <section className="min-h-screen flex flex-col items-center justify-center py-40 px-4">
          <Chapter
            title="Craft"
            explanation="Kerning is felt, not memorized. Drag letters and feel the tension resolve."
            content={() => <KerningPlay text="AVATAR" />}
            isStandalone
          />
        </section>

        {/* Section 4: Finale */}
        <Chapter
          title="Coda"
          explanation="A paragraph that performs: weight, rhythm, spacing, motion."
          content={(p)=>(
            <div className="max-w-[40ch] text-balance leading-tight text-center">
              <span className="var-heavy text-[min(9vw,84px)]">Type</span>{' '}
              <span className="inline-block" style={{ letterSpacing:`${(p*0.12).toFixed(3)}em` }}>breathes</span>{' '}
              <VibrateWord text="when" className="text-[min(7vw,64px)]"/>
              {' '}it{' '}
              <SquishWord text="feels" progress={p} className="text-[min(8vw,72px)] font-black"/>
              {' '}and{' '}
              <span className="var-frail text-[min(7vw,64px)]">says nothing.</span>
            </div>
          )}
        />

        {/* Section 5: Outro */}
        <section className="h-screen flex items-center justify-center p-4">
          <p className="max-w-xl text-center text-2xl md:text-4xl font-light">
            Type is not just what you read. It’s how a page feels when it says nothing.
          </p>
        </section>

      </main>
    </div>
  );
};

export default App;