import { useState } from 'react';
import { useStaggeredEntrance } from '../../hooks/useStaggeredEntrance';

export function ChapterScale() {
  const [scale, setScale] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const styles = useStaggeredEntrance([
    { delay: 0, duration: 400 },
    { delay: 100, duration: 400 },
    { delay: 200, duration: 400 },
  ]);

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <div style={styles[0]}>
              <span className="font-sans text-accent text-sm font-semibold tracking-wider uppercase">
                Chapter 01: Scale
              </span>
            </div>

            <h2
              className="font-serif text-4xl md:text-5xl font-medium text-ink mt-4 mb-6 leading-tight"
              style={styles[1]}
            >
              Hierarchy through Size
            </h2>

            <p
              className="font-sans text-lg leading-relaxed text-ink-muted mb-8"
              style={styles[2]}
            >
              Scale is the most primal tool in a typographer's kit. It directs the eye
              immediately. Large text shouts; small text whispers. By manipulating scale,
              we create a map for the reader's attention.
            </p>

            {/* Slider control */}
            <div className="p-6 border border-ink/10 rounded-lg bg-surface/40 backdrop-blur-sm">
              <label className="block font-sans text-xs uppercase tracking-widest text-ink-muted mb-4">
                Adjust Scale
              </label>
              <input
                type="range"
                min="20"
                max="150"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full slider-toduu"
              />
            </div>
          </div>

          {/* Typography demo */}
          <div
            className={`order-1 lg:order-2 flex justify-center items-center h-[50vh] rounded-xl overflow-hidden relative border transition-all duration-300 ${
              isHovered
                ? 'bg-ink border-ink'
                : 'bg-surface/50 border-ink/5'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Dot pattern background */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(${isHovered ? '#FFFFFF' : '#1F1B16'} 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
              }}
            />

            <div
              className={`font-serif leading-none text-center transition-all duration-300 ease-ds ${
                isHovered ? 'text-white' : 'text-ink'
              }`}
              style={{ fontSize: `${scale}px` }}
            >
              Ag
            </div>

            <div className={`absolute bottom-4 right-4 font-mono text-xs transition-colors duration-300 ${
              isHovered ? 'text-white/40' : 'text-ink/40'
            }`}>
              {scale}px
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider-toduu {
          -webkit-appearance: none;
          background: transparent;
        }
        .slider-toduu::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: var(--ds-ink);
          cursor: pointer;
          margin-top: -6px;
        }
        .slider-toduu::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: var(--ds-ink-muted);
          opacity: 0.3;
          border-radius: 2px;
        }
        .slider-toduu:focus {
          outline: none;
        }
        .slider-toduu:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px var(--ds-accent);
        }
      `}</style>
    </section>
  );
}
