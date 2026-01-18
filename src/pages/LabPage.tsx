import { MorningCommit } from '../components/toduu-lab/MorningCommit';
import { EnergyGarden } from '../components/toduu-lab/EnergyGarden';
import { EveningRelease } from '../components/toduu-lab/EveningRelease';

export function LabPage() {
    return (
        <div className="min-h-screen bg-bg text-ink selection:bg-accent selection:text-white pb-32">
            {/* Navigation / Header */}
            <header className="fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-50 bg-bg/80 backdrop-blur-sm">
                <h1 className="font-serif font-semibold text-xl tracking-tight">Toduu Lab.</h1>
                <a href="/" className="font-sans text-sm text-ink-muted hover:text-ink transition-colors">
                    Back to Home
                </a>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
                <h1 className="font-serif text-5xl md:text-6xl text-ink mb-6 tracking-tight">
                    Philosophy in Motion
                </h1>
                <p className="font-sans text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
                    Three experiments exploring the intersection of digital tools and human intent.
                    Warmth. Craft. Irresistible progress.
                </p>
            </section>

            {/* Gallery */}
            <main className="max-w-6xl mx-auto px-6 space-y-32 md:space-y-48">

                {/* Experiment 1: Morning Commit */}
                <section>
                    <div className="mb-8 flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-ink-muted/20"></div>
                        <span className="font-sans text-xs uppercase tracking-widest text-ink-muted">01. Intent</span>
                        <div className="h-px w-12 bg-ink-muted/20"></div>
                    </div>
                    <div className="bg-surface rounded-2xl md:rounded-3xl shadow-1 p-8 md:p-16 border border-ink/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/20 via-accent/50 to-accent/20 opacity-50"></div>
                        <MorningCommit />
                    </div>
                </section>

                {/* Experiment 2: Energy Garden */}
                <section>
                    <div className="mb-8 flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-ink-muted/20"></div>
                        <span className="font-sans text-xs uppercase tracking-widest text-ink-muted">02. Nurture</span>
                        <div className="h-px w-12 bg-ink-muted/20"></div>
                    </div>
                    <div className="bg-surface rounded-2xl md:rounded-3xl shadow-1 p-8 md:p-16 border border-ink/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/20 via-accent/50 to-accent/20 opacity-50"></div>
                        <EnergyGarden />
                    </div>
                </section>

                {/* Experiment 3: Evening Release */}
                <section>
                    <div className="mb-8 flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-ink-muted/20"></div>
                        <span className="font-sans text-xs uppercase tracking-widest text-ink-muted">03. Peace</span>
                        <div className="h-px w-12 bg-ink-muted/20"></div>
                    </div>
                    <div className="bg-surface rounded-2xl md:rounded-3xl shadow-1 p-8 md:p-16 border border-ink/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/20 via-accent/50 to-accent/20 opacity-50"></div>
                        <EveningRelease />
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="mt-32 text-center font-sans text-ink-muted opacity-50 text-sm">
                <p>Crafted for Toduu.</p>
            </footer>

            {/* Grain Overlay */}
            <div className="grain"></div>
        </div>
    );
}
