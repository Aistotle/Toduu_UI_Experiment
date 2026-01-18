import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Chapter } from './components/Chapter';
import { AnimatedText } from './components/primitives/AnimatedText';
import { ColdOpen } from './components/ColdOpen';
import {
  BrokenWord, VibrateWord, SquishWord, ExitWord,
  FloatWord, LoopWord, HappyWord, KerningPlay, SquishScene
} from './components/TypeStudies';
import { CalibratedMissingLetter } from './components/CalibratedMissingLetter';
import { TextureSentence } from './components/TextureSentence';
import { LabSection } from './lab/components/LabSection';
import { labSectionConfigs } from './lab/sections';
import { ScaleSentence } from './components/ScaleSentence';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { InteractiveShowcase } from './components/TypographicShowcase';
import { TypographyLabPage } from './v3/TypographyLabPage';

const HomeExperience: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div className="bg-[var(--bg)] text-[var(--ink)] antialiased">
      <main>

        {/* ===== Cold Open ===== */}
        <ColdOpen />

        {/* ===== Thesis (v1 content) ===== */}
        <section className="min-h-screen flex items-center justify-center py-24 px-4">
          <Chapter
            title="Thesis"
            content={(progress) => <ThesisSentence progress={progress} />}
          />
        </section>

        {/* ===== NEW STUDIES (from v2) ===== */}
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
          content={(p) => (
            <div className="text-[min(12vw,120px)] font-semibold">
              <CalibratedMissingLetter text="missing" index={4} progress={p} />
            </div>
          )}
        />
        <Chapter
          title="Texture & Nervous Energy"
          explanation="Ghost layers + micro-jitter create the sensation of vibration."
          content={(p) => (
            <div className="text-[min(18vw,160px)] font-medium">
              <VibrateWord text="vibrate" progress={p} />
            </div>
          )}
        />
        <Chapter
          title="Elasticity & Pressure"
          explanation="Compression and stretch make type feel physical."
          content={(p) => (
            <div className="text-[min(20vw,180px)] font-black">
              <SquishScene text="squish" progress={p} />
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
        <Chapter
          title="Craft"
          explanation="Kerning is felt, not memorized. Drag letters and feel the tension resolve."
          content={() => <KerningPlay text="AVATAR" />}
          isStandalone
        />

        <InteractiveShowcase />

        {/* ===== Legacy Chapters from v1 ===== */}
        <Chapter
          title="Scale as Emphasis"
          explanation="Size creates hierarchy. The biggest thing wins attention."
          content={(progress) => (
            <ScaleSentence
              className="text-[clamp(28px,5vw,64px)] font-light text-center"
              text="Sometimes, the loudest voice in the room is simply the biggest."
              target="biggest"
              progress={prefersReducedMotion ? 1 : progress}
            />
          )}
        />
        <Chapter
          title="Weight & Texture"
          explanation="Texture shifts meaning: let the sentence whisper, shout, float, then land."
          content={(progress) => (
            <TextureSentence progress={progress} className="mx-auto" />
          )}
        />
        <Chapter
          title="Spacing and Tension"
          explanation="Tracking, the space between letters, can build tension when tight or create calm when open. It controls the rhythm and density of words."
          content={(progress) => (
            <p
              className="text-4xl md:text-7xl lg:text-9xl font-bold text-center transition-all duration-200"
              style={{ letterSpacing: `${-1 + progress * 2.5}rem` }}
            >
              {progress < 0.5 ? 'TENSION' : 'RELEASE'}
            </p>
          )}
        />
        <Chapter
          title="Typeface as Voice"
          explanation="A typeface is a voice. A serif can feel formal and traditional. A sans-serif feels modern and clean. A script feels personal and elegant. The choice of font sets the entire tone."
          content={(progress) => {
            const getFontClass = () => {
              if (progress < 0.33) return 'font-playfair';
              if (progress < 0.66) return '';
              return 'font-roboto-mono';
            };
            return (
              <p className={`text-3xl md:text-5xl lg:text-6xl text-center leading-snug transition-all duration-300 ${getFontClass()}`}>
                The quick brown fox jumps over the lazy dog.
              </p>
            );
          }}
        />
        <Chapter
          title="Negative Space and Silence"
          explanation="The space around the type is as important as the type itself. It gives words room to breathe and allows the message to land with clarity and focus."
          content={(progress) => (
            <div className="h-[50vh] flex items-center justify-center">
              <p
                className="text-2xl md:text-3xl lg:text-4xl text-center font-light transition-opacity duration-500"
                style={{ opacity: 1 - progress * 2 }}
              >
                What isn't there often speaks the loudest.
              </p>
            </div>
          )}
        />

        {/* ===== Original Finale from v1 ===== */}
        <section className="min-h-[200vh] flex items-center justify-center py-40 px-4 relative">
          <div className="sticky top-0 h-screen flex flex-col items-center justify-center max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-medium mb-12">Finale</h2>
            <Chapter
              isStandalone
              content={(progress) => (
                <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight">
                  Good typography is a{' '}
                  <AnimatedText style={{ fontWeight: 100 + progress * 800 }} children="performance" />
                  . Every element—
                  <AnimatedText style={{ transform: `scale(${1 + progress * 0.5})` }} children="size" />
                  , weight, space, and form—works in{' '}
                  <AnimatedText style={{ letterSpacing: `${progress * 0.5}rem` }} children="harmony" />{' '}
                  to create meaning, to guide the eye, and to make words{' '}
                  <AnimatedText style={{ opacity: 1 - progress * 0.8, fontStyle: 'italic' }} children="sing" />
                  .
                </p>
              )}
            />
          </div>
        </section>

        {/* ===== New Coda ===== */}
        <Chapter
          title="Coda"
          explanation="A paragraph that performs: weight, rhythm, spacing, motion."
          content={(p) => (
            <div className="max-w-[40ch] text-balance leading-tight">
              <span className="var-heavy text-[min(9vw,84px)]">Type</span>{' '}
              <span className="inline-block" style={{ letterSpacing: `${(p * 0.12).toFixed(3)}em` }}>breathes</span>{' '}
              <VibrateWord text="when" className="text-[min(7vw,64px)]" />
              {' '}it{' '}
              <SquishWord text="feels" progress={p} className="text-[min(8vw,72px)] font-black" />
              {' '}and{' '}
              <span className="var-frail text-[min(7vw,64px)]">says nothing.</span>
            </div>
          )}
        />

        {/* ===== Quiet Outro ===== */}
        <section className="h-screen flex items-center justify-center p-4">
          <p className="max-w-xl text-center text-2xl md:text-4xl font-light">
            Type is not just what you read. It’s how a page feels when it says nothing.
          </p>
        </section>

      </main>
    </div>
  );
};

const ExpressiveLabPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <header className="px-6 py-14 border-b border-black/10">
        <p className="text-xs font-mono tracking-[0.6em] uppercase text-black/60">Expressive Lab</p>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mt-4">
          Integration Workspace
        </h1>
        <p className="max-w-2xl text-base text-black/70 mt-4">
          This page stays intentionally modular. Each section below is a drop-in slot where we can transplant
          fragments from the five idea explorations without rewriting the app shell.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ← Back to Main Performance
          </Link>
        </div>
      </header>
      <main className="py-16 space-y-16">
        {labSectionConfigs.map(({ Component, ...metadata }) => {
          const isCard = metadata.layout === 'card';
          const wrapperClass = isCard ? 'px-6 max-w-5xl mx-auto' : '';
          return (
            <div key={metadata.id} className={wrapperClass}>
              <LabSection metadata={metadata}>
                <Component />
              </LabSection>
            </div>
          );
        })}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div id="scale-overlay-bottom" className="pointer-events-none fixed inset-0 z-40 bg-black opacity-0 transition-opacity duration-300" aria-hidden />
      <div id="scale-overlay-top" className="pointer-events-none fixed inset-0 z-50 bg-black opacity-0 transition-opacity duration-300" aria-hidden />
      <Routes>
        <Route path="/" element={<HomeExperience />} />
        <Route path="/expressive-lab" element={<ExpressiveLabPage />} />
        <Route path="/typography-lab" element={<TypographyLabPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

const getThesisBand = (progress: number): 0 | 1 | 2 => {
  if (progress < 0.33) return 0;
  if (progress < 0.66) return 1;
  return 2;
};

const ThesisSentence: React.FC<{ progress: number }> = ({ progress }) => {
  const targetBand = getThesisBand(progress);
  const [band, setBand] = useState<0 | 1 | 2>(targetBand);
  const [showPlayfair, setShowPlayfair] = useState(targetBand === 2);

  useEffect(() => {
    setBand(targetBand);
  }, [targetBand]);

  useEffect(() => {
    setShowPlayfair(targetBand === 2);
  }, [targetBand]);

  const behaviorWeights = [360, 620, 780];
  const behaviorRotation = [-4, 0, 2];
  const behaviorBaseline = ['-0.02em', '0em', '-0.04em'];
  const emotionOpacity = [0.95, 0.72, 0.45];
  const emotionContrast = [100, 90, 80];
  const emotionBlur = ['0px', '0.5px', '1px'];

  return (
    <p className="text-3xl md:text-5xl lg:text-6xl max-w-4xl font-light leading-tight">
      Typography isn’t decoration. It’s{' '}
      <span
        className="inline-block"
        style={{
          fontFamily: '\'Fraunces\', serif',
          fontVariationSettings: `"wght" ${behaviorWeights[band]}`,
          letterSpacing: behaviorBaseline[band],
          transform: `rotate(${behaviorRotation[band]}deg)`,
          transition: 'font-variation-settings 400ms ease, letter-spacing 400ms ease, transform 400ms ease',
        }}
      >
        behavior
      </span>
      ,{' '}
      <span className="inline-block relative">
        <span
          className="transition-opacity duration-300"
          style={{
            opacity: showPlayfair ? 0 : 1,
            transform: `skewX(${showPlayfair ? 0 : -8}deg)`,
            display: 'inline-block',
          }}
        >
          voice
        </span>
        <span
          className="absolute inset-0 transition-all duration-300 font-playfair"
          style={{
            opacity: showPlayfair ? 1 : 0,
            fontStyle: 'italic',
            transform: `skewX(${showPlayfair ? -12 : 0}deg)`,
          }}
          aria-hidden
        >
          voice
        </span>
      </span>
      , and{' '}
      <span
        className="inline-block transition-all duration-500"
        style={{
          opacity: emotionOpacity[band],
          filter: `contrast(${emotionContrast[band]}%)`,
          transform: `translateY(${band === 2 ? '0.1em' : '0'})`,
          textDecoration: band === 0 ? 'none' : 'underline',
          textDecorationStyle: 'wavy',
          textDecorationColor: `rgba(17,17,17,${0.3 + band * 0.25})`,
          textDecorationThickness: '0.08em',
          textUnderlineOffset: '0.15em',
          color: 'inherit',
          mixBlendMode: band === 2 ? 'multiply' : 'normal',
          backdropFilter: `blur(${emotionBlur[band]})`,
        }}
      >
        emotion
      </span>{' '}
      on a grid.
    </p>
  );
};
