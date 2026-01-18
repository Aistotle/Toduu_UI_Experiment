import { useState } from 'react';

// Simple "wobbly" circle path for organic feel
const OrganicShape = ({ filled, onClick, label }: { filled: boolean; onClick: () => void; label: string }) => (
    <div
        onClick={onClick}
        className="flex flex-col items-center gap-3 cursor-pointer group"
    >
        <div className="relative w-16 h-16">
            {/* Background shape */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform duration-500 group-hover:scale-105 group-active:scale-95">
                <path
                    d="M50 5 C20 5 5 20 5 50 C5 80 20 95 50 95 C80 95 95 80 95 50 C95 20 80 5 50 5"
                    fill="none"
                    stroke="var(--ds-ink-muted)"
                    strokeOpacity="0.2"
                    strokeWidth="2"
                />
                {/* Fill shape - scales up from center */}
                <path
                    d="M50 5 C20 5 5 20 5 50 C5 80 20 95 50 95 C80 95 95 80 95 50 C95 20 80 5 50 5"
                    fill="var(--ds-accent)"
                    className={`transition-all duration-700 ease-ds origin-center ${filled ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                />
            </svg>
        </div>
        <span className={`font-sans text-sm transition-colors duration-300 ${filled ? 'text-accent font-medium' : 'text-ink-muted'}`}>
            {label}
        </span>
    </div>
);

export function EnergyGarden() {
    const [habits, setHabits] = useState([
        { id: 1, label: "Hydrate", filled: false },
        { id: 2, label: "Move", filled: false },
        { id: 3, label: "Create", filled: false },
        { id: 4, label: "Rest", filled: false },
    ]);

    const toggleHabit = (id: number) => {
        setHabits(habits.map(h => h.id === id ? { ...h, filled: !h.filled } : h));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto">
            <h2 className="font-serif text-3xl text-ink mb-12 animate-in fade-in duration-700">
                Tend your garden.
            </h2>

            <div className="grid grid-cols-2 gap-12">
                {habits.map((habit, index) => (
                    <div
                        key={habit.id}
                        className="animate-in zoom-in-95 duration-700 ease-ds"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <OrganicShape
                            filled={habit.filled}
                            label={habit.label}
                            onClick={() => toggleHabit(habit.id)}
                        />
                    </div>
                ))}
            </div>

            <p className="mt-16 font-sans text-sm text-ink-muted opacity-60 italic animate-in fade-in duration-1000 delay-500">
                Small actions, growing slowly.
            </p>
        </div>
    );
}
