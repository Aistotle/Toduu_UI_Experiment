import { useStaggeredEntrance } from '../../hooks/useStaggeredEntrance';

export function Philosophy() {
  const [style] = useStaggeredEntrance([
    { delay: 600, duration: 400 },
  ]);

  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-2xl mx-auto text-center" style={style}>
        {/* Subtle divider line */}
        <div className="w-12 h-px bg-ink/10 mx-auto mb-10" />

        <p className="font-sans text-lg md:text-xl leading-relaxed text-ink">
          Most task apps want your attention.{' '}
          <span className="text-accent font-medium">Toduu wants your victories.</span>
        </p>
        <p className="font-sans text-lg md:text-xl leading-relaxed text-ink-muted mt-4">
          No badges. No streaks. No guilt.
          <br />
          Just a quiet space where finishing feels natural.
        </p>
      </div>
    </section>
  );
}
