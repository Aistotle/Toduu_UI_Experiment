import { useState } from 'react';

export function EveningRelease() {
    const [text, setText] = useState('');
    const [isReleasing, setIsReleasing] = useState(false);
    const [released, setReleased] = useState(false);

    const handleRelease = () => {
        if (!text.trim()) return;

        setIsReleasing(true);
        // Animation timing
        setTimeout(() => {
            setReleased(true);
            setText('');
            setIsReleasing(false);
        }, 1000); // Wait for animation to finish
    };

    if (released) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-1000 ease-ds">
                <h2 className="font-serif text-3xl text-ink/80 mb-4">Mind clear.</h2>
                <p className="font-sans text-ink-muted">Rest well.</p>
                <button
                    onClick={() => setReleased(false)}
                    className="mt-8 text-sm text-ink-muted hover:text-accent transition-colors"
                >
                    Another thought?
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-lg mx-auto relative overflow-hidden">
            <h2
                className={`font-serif text-3xl text-ink mb-8 transition-opacity duration-700 ${isReleasing ? 'opacity-0' : 'opacity-100'}`}
            >
                What's on your mind?
            </h2>

            <div
                className={`w-full relative transition-all duration-1000 ease-ds ${isReleasing ? '-translate-y-24 opacity-0 scale-95 blur-sm' : ''}`}
            >
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-white/50 border border-ink/10 rounded-lg p-6 font-serif text-lg min-h-[160px] focus:outline-none focus:border-accent/50 focus:bg-white transition-colors duration-300 resize-none shadow-sm"
                    placeholder="Let it all out here..."
                />

                <div className="absolute bottom-4 right-4">
                    <span className="text-xs text-ink-muted/50 font-sans">
                        {text.length} chars
                    </span>
                </div>
            </div>

            <button
                onClick={handleRelease}
                disabled={!text.trim() || isReleasing}
                className={`mt-8 px-8 py-3 rounded-full font-sans font-medium transition-all duration-500
          ${!text.trim() ? 'bg-ink/5 text-ink-muted/50 cursor-not-allowed' : 'bg-ink text-surface hover:bg-accent hover:shadow-lg active:scale-95 cursor-pointer'}
          ${isReleasing ? 'opacity-0 translate-y-4' : 'opacity-100'}
        `}
            >
                Release it
            </button>
        </div>
    );
}
