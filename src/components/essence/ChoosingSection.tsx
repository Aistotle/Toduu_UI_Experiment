import { useState, useCallback, useMemo } from 'react';
import { ORGANIC_PATHS } from './OrganicShape';

interface ScatteredShape {
    id: number;
    label: string;
    path: string;
    // Initial scattered position (relative to center, in pixels)
    offsetX: number;
    offsetY: number;
    rotation: number;
    // Exit trajectory (direction to drift when departing)
    exitX: number;
    exitY: number;
    exitRotation: number;
}

const LABELS = ["this", "that", "maybe", "later", "soon", "now"];
const PATHS = [
    ORGANIC_PATHS.pebble1,
    ORGANIC_PATHS.pebble2,
    ORGANIC_PATHS.seed1,
    ORGANIC_PATHS.seed2,
    ORGANIC_PATHS.seed3,
    ORGANIC_PATHS.seed4,
];

function generateScatteredPositions(): ScatteredShape[] {
    return LABELS.map((label, i) => {
        // Create a scattered but contained distribution
        const angle = (i / LABELS.length) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 40 + Math.random() * 30;

        return {
            id: i,
            label,
            path: PATHS[i],
            offsetX: Math.cos(angle) * distance,
            offsetY: Math.sin(angle) * distance,
            rotation: -5 + Math.random() * 10,
            // Exit trajectory is roughly away from center
            exitX: Math.cos(angle) * 80,
            exitY: Math.sin(angle) * 80,
            exitRotation: -10 + Math.random() * 20,
        };
    });
}

export function ChoosingSection() {
    const [shapes, setShapes] = useState<ScatteredShape[]>(() => generateScatteredPositions());
    const [chosenId, setChosenId] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [showReset, setShowReset] = useState(false);

    const handleChoose = useCallback(() => {
        if (isAnimating || chosenId !== null) return;

        setIsAnimating(true);

        // Randomly pick one to remain
        const chosen = Math.floor(Math.random() * shapes.length);
        setChosenId(chosen);

        // Show reset button after animation settles
        setTimeout(() => {
            setIsAnimating(false);
            setShowReset(true);
        }, 1000);
    }, [isAnimating, chosenId, shapes.length]);

    const handleReset = useCallback(() => {
        setChosenId(null);
        setShowReset(false);
        setIsAnimating(true);

        // Generate new positions for re-entry
        setShapes(generateScatteredPositions());

        setTimeout(() => {
            setIsAnimating(false);
        }, 700);
    }, []);

    // Chosen shape info for display
    const chosenShape = useMemo(() => {
        if (chosenId === null) return null;
        return shapes[chosenId];
    }, [chosenId, shapes]);

    return (
        <section className="min-h-[500px] flex flex-col items-center justify-center px-6 py-24">
            <h2 className="font-serif text-3xl text-ink mb-16 tracking-tight">
                for choosing.
            </h2>

            {/* Interactive area */}
            <div
                onClick={chosenId === null ? handleChoose : undefined}
                className={`
                    relative w-80 h-80
                    ${chosenId === null ? 'cursor-pointer' : ''}
                `}
            >
                {shapes.map((shape, index) => {
                    const isChosen = chosenId === shape.id;
                    const isDeparting = chosenId !== null && !isChosen;

                    // Calculate styles based on state
                    let transform = '';
                    let opacity = 0.6;
                    let scale = 1;

                    if (chosenId === null) {
                        // Initial scattered state
                        transform = `translate(${shape.offsetX}px, ${shape.offsetY}px) rotate(${shape.rotation}deg)`;
                        opacity = hoveredId === shape.id ? 0.9 : 0.6;
                        scale = hoveredId === shape.id ? 1.05 : 1;
                    } else if (isChosen) {
                        // Chosen: center, grow, full opacity
                        transform = 'translate(0, 0) rotate(0deg)';
                        opacity = 1;
                        scale = 1.2;
                    } else if (isDeparting) {
                        // Departing: drift away and fade
                        transform = `translate(${shape.exitX}px, ${shape.exitY}px) rotate(${shape.exitRotation}deg)`;
                        opacity = 0;
                        scale = 0.8;
                    }

                    return (
                        <div
                            key={shape.id}
                            onMouseEnter={() => chosenId === null && setHoveredId(shape.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{
                                transform: `translate(-50%, -50%) ${transform} scale(${scale})`,
                                opacity,
                                transition: `all 700ms cubic-bezier(0.32, 0.72, 0, 1)`,
                                transitionDelay: isDeparting ? `${index * 50}ms` : '0ms',
                                zIndex: isChosen ? 10 : 1,
                            }}
                        >
                            <div className="flex flex-col items-center gap-3">
                                {/* Shape */}
                                <div
                                    className="w-14 h-14"
                                    style={{
                                        filter: isChosen ? 'drop-shadow(0 4px 12px rgba(18, 16, 11, 0.12))' : 'none',
                                        transition: 'filter 300ms ease 200ms',
                                    }}
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <path
                                            d={shape.path}
                                            fill="none"
                                            stroke="var(--ds-ink-muted)"
                                            strokeWidth="2"
                                            strokeOpacity={isChosen ? 0.5 : 0.3}
                                        />
                                    </svg>
                                </div>

                                {/* Label */}
                                <span
                                    className={`
                                        text-sm transition-all duration-500
                                        ${isChosen ? 'font-serif text-ink text-lg' : 'font-sans text-ink-muted'}
                                    `}
                                >
                                    {shape.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Reset link */}
            <button
                onClick={handleReset}
                className={`
                    mt-8 font-sans text-sm text-ink-muted
                    transition-all duration-500
                    hover:text-ink
                    ${showReset ? 'opacity-50 hover:opacity-100' : 'opacity-0 pointer-events-none'}
                `}
            >
                again
            </button>

            {chosenId === null && (
                <p className="mt-12 font-sans text-sm text-ink-muted opacity-50 italic text-center max-w-xs">
                    Tap to let one remain.
                </p>
            )}
        </section>
    );
}
