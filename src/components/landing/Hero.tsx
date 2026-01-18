import { Link } from 'react-router-dom';
import { useStaggeredEntrance } from '../../hooks/useStaggeredEntrance';
import { Button } from './Button';
import { TaskDemo } from './TaskDemo';

export function Hero() {
  const styles = useStaggeredEntrance([
    { delay: 0, duration: 500 },     // headline
    { delay: 150, duration: 400 },   // subhead
    { delay: 300, duration: 500 },   // demo
    { delay: 450, duration: 350 },   // button
  ]);

  return (
    <section className="min-h-[90vh] flex items-center px-6 py-16 md:py-24 relative">
      {/* Navigation */}
      <nav className="absolute top-6 right-6 flex gap-6">
        <Link
          to="/lab"
          className="text-sm font-sans text-ink-muted hover:text-ink transition-colors"
        >
          Lab
        </Link>
        <Link
          to="/alliance"
          className="text-sm font-sans text-ink-muted hover:text-ink transition-colors"
        >
          Alliance
        </Link>
      </nav>

      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20">
          {/* Text content */}
          <div className="lg:w-[55%] space-y-8">
            <h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-ink leading-[1.1] tracking-tight"
              style={styles[0]}
            >
              What if finishing
              <br />
              <span className="italic font-normal">felt like exhaling?</span>
            </h1>

            <p
              className="font-sans text-lg md:text-xl text-ink-muted max-w-md leading-relaxed"
              style={styles[1]}
            >
              Toduu strips away the noise. What remains is momentum.
            </p>

            <div style={styles[3]}>
              <Button>Start fresh</Button>
            </div>
          </div>

          {/* Living demo */}
          <div
            className="lg:w-[45%] flex justify-center lg:justify-end"
            style={styles[2]}
          >
            <TaskDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
