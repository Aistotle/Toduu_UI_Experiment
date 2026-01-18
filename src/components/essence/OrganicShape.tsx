import { useState } from 'react';

// Collection of organic SVG paths - each is hand-crafted with bezier curves
// to feel like natural pebbles/seeds, not geometric shapes
export const ORGANIC_PATHS = {
    seed1: "M50 8 C25 8 8 25 8 48 C8 75 22 92 50 92 C78 92 92 75 92 48 C92 25 75 8 50 8",
    seed2: "M48 6 C20 10 6 28 8 52 C10 78 28 94 52 92 C76 90 94 72 92 48 C90 24 76 2 48 6",
    seed3: "M52 8 C28 5 8 22 6 48 C4 74 20 92 48 94 C76 96 96 78 94 52 C92 26 76 11 52 8",
    seed4: "M50 5 C22 8 5 25 8 50 C11 75 28 95 50 92 C72 89 92 72 89 50 C86 28 78 2 50 5",
    pebble1: "M50 10 C30 8 12 22 10 45 C8 68 20 88 45 90 C70 92 90 78 92 55 C94 32 70 12 50 10",
    pebble2: "M45 8 C22 12 8 30 10 52 C12 74 30 92 55 90 C80 88 94 68 92 45 C90 22 68 4 45 8",
};

interface OrganicShapeProps {
    path: string;
    label?: string;
    filled?: boolean;
    fillColor?: string;
    fillOpacity?: number;
    strokeOpacity?: number;
    size?: number;
    className?: string;
    onClick?: () => void;
    onHover?: (hovered: boolean) => void;
    breathing?: boolean;
    breathingDelay?: number;
}

export function OrganicShape({
    path,
    label,
    filled = false,
    fillColor = 'var(--ds-accent)',
    fillOpacity = 1,
    strokeOpacity = 0.2,
    size = 64,
    className = '',
    onClick,
    onHover,
    breathing = false,
    breathingDelay = 0,
}: OrganicShapeProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        onHover?.(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsPressed(false);
        onHover?.(false);
    };

    const handleMouseDown = () => {
        setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleClick = () => {
        onClick?.();
    };

    // Dynamic stroke opacity based on hover
    const currentStrokeOpacity = isHovered ? Math.min(strokeOpacity + 0.2, 0.5) : strokeOpacity;

    return (
        <div
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className={`
                flex flex-col items-center gap-3
                cursor-pointer select-none
                transition-transform duration-300 ease-ds
                ${isHovered ? '-translate-y-0.5' : ''}
                ${isPressed ? 'scale-95' : isHovered ? 'scale-105' : ''}
                ${className}
            `}
            style={{
                animationDelay: breathing ? `${breathingDelay}ms` : undefined,
            }}
        >
            <div
                className={`relative ${breathing ? 'animate-breathe' : ''}`}
                style={{
                    width: size,
                    height: size,
                    animationDelay: breathing ? `${breathingDelay}ms` : undefined,
                }}
            >
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                >
                    {/* Background outline */}
                    <path
                        d={path}
                        fill="none"
                        stroke="var(--ds-ink-muted)"
                        strokeOpacity={currentStrokeOpacity}
                        strokeWidth="2"
                        className="transition-all duration-300"
                    />
                    {/* Fill shape - scales from center for "plop" effect */}
                    <path
                        d={path}
                        fill={fillColor}
                        fillOpacity={fillOpacity}
                        className={`
                            transition-all duration-700 ease-ds origin-center
                            ${filled ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                        `}
                        style={{ transformOrigin: '50px 50px' }}
                    />
                </svg>
            </div>
            {label && (
                <span
                    className={`
                        font-sans text-sm transition-all duration-300
                        ${filled ? 'text-accent font-medium' : 'text-ink-muted'}
                        ${isHovered ? 'opacity-100' : 'opacity-70'}
                    `}
                >
                    {label}
                </span>
            )}
        </div>
    );
}
