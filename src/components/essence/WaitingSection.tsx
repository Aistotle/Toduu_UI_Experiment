import { useState, useCallback } from 'react';
import { ORGANIC_PATHS } from './OrganicShape';

interface Seed {
    id: number;
    label: string;
    path: string;
    isWobbling: boolean;
}

const SEEDS: Seed[] = [
    { id: 1, label: "thinking about it", path: ORGANIC_PATHS.seed1, isWobbling: false },
    { id: 2, label: "not yet", path: ORGANIC_PATHS.seed2, isWobbling: false },
    { id: 3, label: "someday", path: ORGANIC_PATHS.seed3, isWobbling: false },
    { id: 4, label: "when ready", path: ORGANIC_PATHS.seed4, isWobbling: false },
];

export function WaitingSection() {
    const [seeds, setSeeds] = useState(SEEDS);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const handleSeedClick = useCallback((id: number) => {
        // Trigger wobble animation
        setSeeds(prev => prev.map(seed =>
            seed.id === id ? { ...seed, isWobbling: true } : seed
        ));

        // Remove wobble class after animation completes
        setTimeout(() => {
            setSeeds(prev => prev.map(seed =>
                seed.id === id ? { ...seed, isWobbling: false } : seed
            ));
        }, 400);
    }, []);

    return (
        <section className="min-h-[500px] flex flex-col items-center justify-center px-6 py-24">
            <h2 className="font-serif text-3xl text-ink mb-16 tracking-tight">
                for waiting.
            </h2>

            <div className="flex flex-wrap justify-center gap-12 md:gap-16">
                {seeds.map((seed, index) => (
                    <div
                        key={seed.id}
                        onClick={() => handleSeedClick(seed.id)}
                        onMouseEnter={() => setHoveredId(seed.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`
                            flex flex-col items-center gap-4 cursor-pointer select-none
                            transition-transform duration-300 ease-ds
                            ${hoveredId === seed.id ? '-translate-y-0.5' : ''}
                        `}
                    >
                        {/* Seed shape */}
                        <div
                            className={`
                                w-16 h-16 animate-breathe
                                ${seed.isWobbling ? 'animate-wobble' : ''}
                            `}
                            style={{
                                animationDelay: `${index * 200}ms`,
                            }}
                        >
                            <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full"
                            >
                                <path
                                    d={seed.path}
                                    fill="none"
                                    stroke="var(--ds-ink-muted)"
                                    strokeWidth="2"
                                    className="transition-all duration-300"
                                    style={{
                                        strokeOpacity: hoveredId === seed.id ? 0.4 : 0.2,
                                    }}
                                />
                            </svg>
                        </div>

                        {/* Label */}
                        <span
                            className={`
                                font-sans text-sm text-ink-muted
                                transition-opacity duration-300
                                ${hoveredId === seed.id ? 'opacity-100' : 'opacity-60'}
                            `}
                        >
                            {seed.label}
                        </span>
                    </div>
                ))}
            </div>

            <p className="mt-20 font-sans text-sm text-ink-muted opacity-50 italic text-center max-w-xs">
                Some things need time. Not everything is now.
            </p>
        </section>
    );
}
