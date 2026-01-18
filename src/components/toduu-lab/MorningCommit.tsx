import { useState } from 'react';

export function MorningCommit() {
    const [committed, setCommitted] = useState(false);
    const [tasks, setTasks] = useState(['', '', '']);

    const handleCommit = () => {
        if (tasks.some(t => t.trim().length > 0)) {
            setCommitted(true);
        }
    };

    const handleChange = (index: number, value: string) => {
        const newTasks = [...tasks];
        newTasks[index] = value;
        setTasks(newTasks);
    };

    if (committed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-700 ease-ds">
                <h2 className="font-serif text-3xl text-ink mb-4">The day is yours.</h2>
                <p className="font-sans text-ink-muted">Go gently.</p>
                <button
                    onClick={() => setCommitted(false)}
                    className="mt-8 text-sm text-ink-muted hover:text-accent transition-colors duration-normal"
                >
                    Reset
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto">
            <h2 className="font-serif text-4xl text-ink mb-2 self-start animate-in slide-in-from-bottom-4 duration-700 ease-ds">
                Good morning.
            </h2>
            <p className="font-sans text-ink-muted mb-8 self-start animate-in slide-in-from-bottom-4 duration-700 delay-100 ease-ds">
                What are the three things that matter today?
            </p>

            <div className="w-full space-y-6">
                {tasks.map((task, index) => (
                    <div
                        key={index}
                        className="group relative animate-in slide-in-from-bottom-4 duration-500 ease-ds"
                        style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-muted/30 font-serif text-lg">
                            {index + 1}.
                        </span>
                        <input
                            type="text"
                            value={task}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="w-full bg-transparent border-b border-ink/10 py-3 pl-8 text-lg font-serif text-ink placeholder:text-ink-muted/30 focus:outline-none focus:border-accent transition-colors duration-300"
                            placeholder="Start typing..."
                        />
                    </div>
                ))}
            </div>

            <div className="mt-12 w-full flex justify-end animate-in fade-in duration-700 delay-500">
                <button
                    onClick={handleCommit}
                    className="bg-ink text-surface px-8 py-3 rounded-md font-sans font-medium hover:bg-accent active:scale-95 transition-all duration-300 shadow-2 hover:shadow-3"
                >
                    Commit to the Day
                </button>
            </div>
        </div>
    );
}
