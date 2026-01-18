import { useState, useCallback } from 'react';
import { ORGANIC_PATHS } from './OrganicShape';

const COMPLETION_WORDS = ["finish", "ship it", "let go", "exhale", "release", "move on", "done", "complete"];
const STONE_PATHS = [ORGANIC_PATHS.pebble1, ORGANIC_PATHS.pebble2, ORGANIC_PATHS.seed1, ORGANIC_PATHS.seed2];

interface Stone {
    id: number;
    word: string;
    path: string;
    state: 'waiting' | 'dropping' | 'settled';
    offsetX: number; // Slight random offset for organic pile
}

let stoneIdCounter = 0;

function createNewStone(): Stone {
    return {
        id: stoneIdCounter++,
        word: COMPLETION_WORDS[Math.floor(Math.random() * COMPLETION_WORDS.length)],
        path: STONE_PATHS[Math.floor(Math.random() * STONE_PATHS.length)],
        state: 'waiting',
        offsetX: -8 + Math.random() * 16,
    };
}

export function ArrivingSection() {
    const [currentStone, setCurrentStone] = useState<Stone>(() => createNewStone());
    const [completedStones, setCompletedStones] = useState<Stone[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isFilling, setIsFilling] = useState(false);

    const handleDrop = useCallback(() => {
        if (currentStone.state !== 'waiting') return;

        // Start the drop animation
        setCurrentStone(prev => ({ ...prev, state: 'dropping' }));

        // After drop animation (500ms), start fill animation
        setTimeout(() => {
            setCurrentStone(prev => ({ ...prev, state: 'settled' }));
            setIsFilling(true);
        }, 500);

        // After fill animation (700ms more), move to completed pile and create new stone
        setTimeout(() => {
            setCompletedStones(prev => {
                const updated = [{ ...currentStone, state: 'settled' as const }, ...prev];
                // Keep only 3 most recent
                return updated.slice(0, 3);
            });
            setIsFilling(false);
            setCurrentStone(createNewStone());
        }, 1200);
    }, [currentStone]);

    // Calculate stone vertical positions
    const thresholdY = 160; // Position of the threshold line
    const waitingY = thresholdY - 80; // Above the line
    const settledY = thresholdY + 60; // Below the line

    return (
        <section className="min-h-[600px] flex flex-col items-center justify-center px-6 py-24">
            <h2 className="font-serif text-3xl text-ink mb-8 tracking-tight">
                for arriving.
            </h2>

            {/* Threshold area */}
            <div className="relative w-full max-w-xs h-[400px]">
                {/* Current stone (above threshold or dropping) */}
                <div
                    onClick={handleDrop}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`
                        absolute left-1/2 -translate-x-1/2
                        cursor-pointer select-none
                        transition-all ease-ds
                        ${currentStone.state === 'waiting' ? 'duration-300' : 'duration-500'}
                    `}
                    style={{
                        top: currentStone.state === 'waiting'
                            ? waitingY
                            : currentStone.state === 'dropping'
                                ? settledY + 10 // Overshoot
                                : settledY,
                        transform: `translateX(-50%) ${
                            currentStone.state === 'waiting' && isHovered
                                ? 'translateY(-3px)'
                                : ''
                        } ${
                            currentStone.state === 'dropping'
                                ? 'rotate(-3deg)'
                                : currentStone.state === 'settled'
                                    ? 'rotate(0deg)'
                                    : ''
                        }`,
                        opacity: currentStone.state === 'settled' ? 0 : 1,
                    }}
                >
                    <div className="flex flex-col items-center gap-3">
                        {/* Stone shape */}
                        <div className="w-16 h-16 relative">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                {/* Outline */}
                                <path
                                    d={currentStone.path}
                                    fill="none"
                                    stroke="var(--ds-ink-muted)"
                                    strokeWidth="2"
                                    strokeOpacity={isHovered ? 0.4 : 0.25}
                                    className="transition-all duration-300"
                                />
                                {/* Fill - appears after settling */}
                                <path
                                    d={currentStone.path}
                                    fill="var(--ds-accent-completed)"
                                    className={`
                                        transition-all duration-700 ease-ds origin-center
                                        ${isFilling ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                                    `}
                                    style={{ transformOrigin: '50px 50px' }}
                                />
                            </svg>
                        </div>

                        {/* Word */}
                        <span
                            className={`
                                font-sans text-sm transition-all duration-300
                                ${isFilling ? 'text-accent-completed' : 'text-ink-muted'}
                            `}
                        >
                            {currentStone.word}
                        </span>
                    </div>
                </div>

                {/* Threshold line */}
                <div
                    className="absolute left-0 right-0 h-px bg-ink-muted"
                    style={{
                        top: thresholdY,
                        opacity: 0.2,
                    }}
                />

                {/* Completed stones (below threshold) */}
                {completedStones.map((stone, index) => (
                    <div
                        key={stone.id}
                        className="absolute left-1/2 transition-all duration-700 ease-ds"
                        style={{
                            top: settledY + index * 24,
                            transform: `translateX(calc(-50% + ${stone.offsetX}px))`,
                            opacity: 0.6 - index * 0.15,
                            zIndex: 3 - index,
                        }}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <path
                                        d={stone.path}
                                        fill="var(--ds-accent-completed)"
                                        fillOpacity={0.8}
                                    />
                                </svg>
                            </div>
                            <span className="font-sans text-xs text-ink-muted line-through opacity-60">
                                {stone.word}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Rising new stone indicator (subtle) */}
                {currentStone.state === 'waiting' && (
                    <div
                        className="absolute left-1/2 -translate-x-1/2 animate-rise"
                        style={{
                            top: waitingY,
                            animationDuration: '1000ms',
                        }}
                    />
                )}
            </div>

            <p className="mt-8 font-sans text-sm text-ink-muted opacity-50 italic text-center max-w-xs">
                The moment of crossing. Then the next.
            </p>
        </section>
    );
}
