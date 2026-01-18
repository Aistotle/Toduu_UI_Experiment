import { useStaggeredEntrance } from '../../hooks/useStaggeredEntrance';

export function ChapterWeight() {
  const styles = useStaggeredEntrance([
    { delay: 0, duration: 400 },
    { delay: 100, duration: 400 },
    { delay: 200, duration: 400 },
  ]);

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Text content */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div style={styles[0]}>
              <span className="font-sans text-accent text-sm font-semibold tracking-wider uppercase">
                Chapter 02: Weight
              </span>
            </div>

            <h2
              className="font-serif text-4xl md:text-5xl font-medium text-ink mt-4 mb-6 leading-tight"
              style={styles[1]}
            >
              The Gravity of Words
            </h2>

            <div style={styles[2]}>
              <p className="font-sans text-lg leading-relaxed text-ink-muted">
                Weight adds physical presence to the abstract characters. Light weights
                feel airy, elegant, and ephemeral. Heavy weights feel grounded, urgent,
                and loud.
              </p>
            </div>
          </div>

          {/* Weight demo */}
          <div className="lg:col-span-8 min-h-[60vh] flex items-center justify-center bg-ink text-bg rounded-xl relative overflow-hidden p-8">
            <div
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-center leading-tight"
              style={{ fontWeight: 100 }}
            >
              Emotion
              <br />
              <span className="italic">Gravity</span>
              <br />
              Impact
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
