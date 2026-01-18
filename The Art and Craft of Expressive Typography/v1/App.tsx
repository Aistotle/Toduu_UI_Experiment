
import React from 'react';
import { Chapter } from './components/Chapter';
import { useScrollProgress } from './hooks/useScrollProgress';

// Helper component for animated text based on scroll
const AnimatedText = ({ children, style }: { children: React.ReactNode, style: React.CSSProperties }) => {
  return <span className="inline-block" style={style}>{children}</span>;
};

const App: React.FC = () => {
  return (
    <div className="bg-[#f8f8f8] text-[#111111] antialiased">
      <main>
        {/* Section 1: Cold Open */}
        <section className="h-screen flex flex-col justify-center items-center p-4">
          <h1 className="text-center text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-none">
            EXPRESSIVE
          </h1>
          <h1 className="text-center text-5xl md:text-8xl lg:text-9xl font-light tracking-widest leading-none mt-2">
            TYPOGRAPHY
          </h1>
        </section>

        {/* Section 2: Thesis */}
        <section className="min-h-screen flex items-center justify-center py-24 px-4">
          <Chapter
            title="Thesis"
            content={(progress) => (
              <p className="text-3xl md:text-5xl lg:text-6xl max-w-4xl font-light leading-tight">
                Typography isn’t decoration. It’s {' '}
                {/* FIX: Explicitly pass children prop to resolve TypeScript error. */}
                <AnimatedText style={{ fontWeight: 100 + progress * 700 }} children='behavior' />
                ,{' '}
                {/* FIX: Explicitly pass children prop to resolve TypeScript error. */}
                <AnimatedText style={{ fontStyle: progress > 0.5 ? 'italic' : 'normal' }} children='voice' />
                , and{' '}
                {/* FIX: Explicitly pass children prop to resolve TypeScript error. */}
                <AnimatedText style={{ opacity: Math.max(0.2, 1 - progress * 1.5) }} children='emotion' />{' '}
                on a grid.
              </p>
            )}
          />
        </section>
        
        {/* Section 3: Chapters */}

        {/* Chapter 1: Scale */}
        <Chapter
          title="Scale as Emphasis"
          explanation="Size creates hierarchy and directs attention. What's big is important. What's small is secondary. Scale tells you where to look first."
          content={(progress) => (
            <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-snug text-center">
              Sometimes, the loudest voice in the room is simply the{' '}
              {/* FIX: Explicitly pass children prop to resolve TypeScript error. */}
              <AnimatedText style={{ transform: `scale(${1 + progress * 2.5})`, margin: `0 ${progress * 2}rem` }} children='biggest' />
              .
            </p>
          )}
        />
        
        {/* Chapter 2: Weight */}
        <Chapter
          title="Weight and Texture"
          explanation="Font weight changes the visual texture of a page. Lighter weights feel airy and delicate, while heavier weights are dense, strong, and assertive."
          content={(progress) => (
             <p className="text-3xl md:text-5xl lg:text-6xl text-center leading-snug transition-all duration-200"
                style={{ fontWeight: 100 + progress * 800 }}>
                Font weight is texture. It can be a whisper or a shout. It can feel light as air or heavy as stone.
             </p>
          )}
        />
        
        {/* Chapter 3: Spacing */}
        <Chapter
          title="Spacing and Tension"
          explanation="Tracking, the space between letters, can build tension when tight or create calm when open. It controls the rhythm and density of words."
          content={(progress) => (
            <p className="text-4xl md:text-7xl lg:text-9xl font-bold text-center transition-all duration-200"
               style={{ letterSpacing: `${-1 + progress * 2.5}rem` }}>
              {progress < 0.5 ? 'TENSION' : 'RELEASE'}
            </p>
          )}
        />
        
        {/* Chapter 4: Typeface as Voice */}
        <Chapter
          title="Typeface as Voice"
          explanation="A typeface is a voice. A serif can feel formal and traditional. A sans-serif feels modern and clean. A script feels personal and elegant. The choice of font sets the entire tone."
          content={(progress) => {
             const getFontClass = () => {
                 if (progress < 0.33) return 'font-playfair';
                 if (progress < 0.66) return ''; // Default 'Inter'
                 return 'font-roboto-mono';
             }
             return (
                <p className={`text-3xl md:text-5xl lg:text-6xl text-center leading-snug transition-all duration-300 ${getFontClass()}`}>
                    The quick brown fox jumps over the lazy dog.
                </p>
             )
          }}
        />

        {/* Chapter 5: Negative Space */}
        <Chapter
          title="Negative Space and Silence"
          explanation="The space around the type is as important as the type itself. It gives words room to breathe and allows the message to land with clarity and focus."
          content={(progress) => (
            <div className="h-[50vh] flex items-center justify-center">
                <p className="text-2xl md:text-3xl lg:text-4xl text-center font-light transition-opacity duration-500"
                   style={{ opacity: 1 - progress * 2 }}>
                    What isn't there often speaks the loudest.
                </p>
            </div>
          )}
        />

        {/* Section 4: Finale */}
        <section className="min-h-[200vh] flex items-center justify-center py-40 px-4 relative">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center max-w-4xl text-center">
                <h2 className="text-2xl md:text-3xl font-medium mb-12">Finale</h2>
                <Chapter
                    isStandalone={true}
                    content={(progress) => (
                        <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight">
                          Good typography is a{' '}
                          {/* FIX: Explicitly pass children prop to resolve TypeScript error. */}
                          <AnimatedText style={{ fontWeight: 100 + progress * 800 }} children='performance' />
                          . Every element—
                          {/* FIX: Explicitly pass children prop to resolve TypeScript error. */}
                          <AnimatedText style={{ transform: `scale(${1 + progress * 0.5})` }} children='size' />
                          , weight, space, and form—works in{' '}
                          {/* FIX: Explicitly pass children prop to resolve TypeScript error. */}
                          <AnimatedText style={{ letterSpacing: `${progress * 0.5}rem` }} children='harmony' />
                          {' '}to create meaning, to guide the eye, and to make words{' '}
                           {/* FIX: Explicitly pass children prop to resolve TypeScript error. */}
                           <AnimatedText style={{ opacity: 1 - progress * 0.8, fontStyle: 'italic' }} children='sing' />
                          .
                        </p>
                    )}
                />
            </div>
        </section>

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
