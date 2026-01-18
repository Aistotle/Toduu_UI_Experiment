import { WaitingSection } from '../components/essence/WaitingSection';
import { ChoosingSection } from '../components/essence/ChoosingSection';
import { ArrivingSection } from '../components/essence/ArrivingSection';

export function EssencePage() {
    return (
        <div className="min-h-screen bg-bg">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a
                        href="/"
                        className="font-serif text-lg text-ink hover:text-accent transition-colors duration-300"
                    >
                        Toduu
                    </a>
                    <span className="font-sans text-sm text-ink-muted">
                        Essence
                    </span>
                </div>
            </header>

            {/* Content */}
            <main className="pt-20">
                {/* Intro */}
                <section className="min-h-[40vh] flex flex-col items-center justify-center px-6 py-16">
                    <h1 className="font-serif text-4xl md:text-5xl text-ink text-center tracking-tight mb-6">
                        The shape of intention.
                    </h1>
                    <p className="font-sans text-ink-muted text-center max-w-md">
                        Three moments. Each a different way of being with what matters.
                    </p>
                </section>

                {/* Divider */}
                <div className="w-16 h-px bg-ink-muted/20 mx-auto" />

                {/* Section 1: for waiting */}
                <WaitingSection />

                {/* Divider */}
                <div className="w-16 h-px bg-ink-muted/20 mx-auto" />

                {/* Section 2: for choosing */}
                <ChoosingSection />

                {/* Divider */}
                <div className="w-16 h-px bg-ink-muted/20 mx-auto" />

                {/* Section 3: for arriving */}
                <ArrivingSection />

                {/* Footer */}
                <footer className="py-24 px-6 text-center">
                    <p className="font-sans text-sm text-ink-muted opacity-40">
                        Waiting. Choosing. Arriving.
                    </p>
                    <a
                        href="/"
                        className="inline-block mt-8 font-sans text-sm text-ink-muted hover:text-ink transition-colors duration-300"
                    >
                        &larr; Back home
                    </a>
                </footer>
            </main>

            {/* Grain overlay */}
            <div className="grain" />
        </div>
    );
}
