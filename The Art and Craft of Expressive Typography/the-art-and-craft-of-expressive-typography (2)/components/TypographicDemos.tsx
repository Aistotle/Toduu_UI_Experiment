
import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// Demo 1: Clock
export const ClockDemo: React.FC = () => {
  return (
    <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-widest select-none">
      <span className="inline-flex items-center">
        <span>C</span>
        <span className="relative w-[1em] h-[1em] border-4 border-white rounded-full mx-1 flex items-center justify-center">
          <div className="absolute w-1 h-1/3 bg-white bottom-1/2 clock-hand-hour"></div>
          <div className="absolute w-0.5 h-1/2 bg-white bottom-1/2 clock-hand-minute"></div>
        </span>
        <span>CK</span>
      </span>
    </div>
  );
};

// Demo 2: Gravity
const GravityLetter: React.FC<{ children: string }> = ({ children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const randomRotation = React.useMemo(() => (Math.random() - 0.5) * 15, []);
    const randomY = React.useMemo(() => Math.random() * 10, []);

    return (
        <span 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            className="inline-block transition-transform duration-500 ease-out"
            style={{ 
                transform: `translateY(${isHovered ? 20 : randomY}px) rotate(${isHovered ? randomRotation * 2 : randomRotation}deg)`,
                cursor: 'pointer'
            }}
        >
            {children}
        </span>
    );
};
export const GravityDemo: React.FC = () => {
    const word = "Gravity";
    return (
        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-wider select-none">
            {word.split('').map((char, index) => (
                <GravityLetter key={index}>{char}</GravityLetter>
            ))}
        </div>
    );
};


// Demo 3: High
export const HighDemo: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
  return (
    <div ref={ref} className="text-8xl sm:text-9xl font-bold text-white tracking-normal select-none relative h-48 w-full flex justify-center items-center">
      <span className="inline-flex items-end">
        <span>H</span>
        <span className="inline-flex flex-col items-center mx-1">
            <span 
                className={`w-4 h-4 bg-white rounded-full transition-transform duration-1000 ease-in-out`}
                style={{ transform: `translateY(${isVisible ? '-100px' : '0px'})`}}
            ></span>
            <span className="-mt-2">i</span>
        </span>
        <span>gh</span>
      </span>
    </div>
  );
};


// Demo 4: Parallel
export const ParallelDemo: React.FC = () => {
  return (
    <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-normal select-none">
      <span className="inline-flex items-center">
        <span>para</span>
        <span className="inline-block h-[1.2em] w-2 bg-white mx-1"></span>
        <span className="inline-block h-[1.2em] w-2 bg-white mx-1"></span>
        <span>el</span>
      </span>
    </div>
  );
};


// Demo 5: Tsunami
export const TsunamiDemo: React.FC = () => {
    return (
        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-wide select-none flex items-center">
            <span>T</span>
            <svg viewBox="0 0 200 100" width="120" height="100" className="mx-2">
                <path
                    className="tsunami-wave"
                    fill="none"
                    stroke="white"
                    strokeWidth="12"
                    strokeLinecap="round"
                    d="M 10 80 C 40 20, 60 20, 90 80 S 140 140, 190 80"
                />
            </svg>
            <span>unami</span>
        </div>
    );
};


// Demo 6: Elevator
export const ElevatorDemo: React.FC = () => {
    const [level, setLevel] = useState(0);

    return (
        <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
            <div 
                className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-wide select-none transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(${level}px)` }}
            >
                <span>ELE</span>
                <span 
                    onClick={() => setLevel(prev => Math.max(prev - 40, -40))} 
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title="Go Up"
                >V</span>
                <span 
                    onClick={() => setLevel(prev => Math.min(prev + 40, 40))} 
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title="Go Down"
                >A</span>
                <span>TOR</span>
            </div>
            {level !== 0 && (
                <button 
                    onClick={() => setLevel(0)}
                    className="absolute bottom-4 text-xs bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full transition-all"
                >
                    Reset
                </button>
            )}
        </div>
    );
};

// Demo 7: Smile
export const SmileDemo: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="text-8xl sm:text-9xl font-bold text-white tracking-tight select-none flex justify-center items-center cursor-pointer h-48"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Word 'Smile'. Hover over it to see the 'i' wink."
    >
      <span>Sm</span>
      <span className="relative w-[0.5em] h-[1.1em] mx-1">
         <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[0.2em] h-[0.6em] bg-white rounded-sm"></span>
         <span 
          className="absolute top-[0.1em] left-1/2 -translate-x-1/2 bg-white transition-all duration-200 ease-out origin-center"
          style={{ 
            width: isHovered ? '0.6em' : '0.4em',
            height: isHovered ? '0.1em' : '0.4em',
            borderRadius: '9999px',
          }}
        ></span>
      </span>
      <span>le</span>
    </div>
  );
};

// Demo 8: Voyeur
export const VoyeurDemo: React.FC = () => {
    const oRef = React.useRef<HTMLSpanElement>(null);
    const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!oRef.current) return;
        const rect = oRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const maxMove = rect.width / 5;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX);

        const x = Math.min(distance, maxMove) * Math.cos(angle);
        const y = Math.min(distance, maxMove) * Math.sin(angle);
        
        setPupilPos({ x, y });
    };

    return (
        <div 
            className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-widest select-none w-full h-full flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setPupilPos({ x: 0, y: 0 })}
            aria-label="Word 'VOYEUR', where the 'O' is an eye that follows your cursor."
        >
            <span>V</span>
            <span ref={oRef} className="relative w-[1em] h-[1em] border-4 border-white rounded-full mx-2 flex items-center justify-center">
                 <span className="absolute w-1/2 h-1/2 rounded-full bg-white flex items-center justify-center">
                    <span 
                        className="w-1/2 h-1/2 bg-gray-900 rounded-full transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`}}
                    ></span>
                 </span>
            </span>
            <span className="text-gray-500">Y</span>
            <span>EUR</span>
        </div>
    );
};

// Demo 9: Zipper
export const ZipperDemo: React.FC = () => {
    const [zipHeight, setZipHeight] = useState(10); // in px
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = React.useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const clientY = 'touches' in e ? e.nativeEvent.touches[0].clientY : e.nativeEvent.clientY;
        const newHeight = Math.max(10, Math.min(rect.height, clientY - rect.top));
        setZipHeight(newHeight);
    };

    React.useEffect(() => {
        const end = () => setIsDragging(false);
        window.addEventListener('mouseup', end);
        window.addEventListener('touchend', end);
        return () => {
            window.removeEventListener('mouseup', end);
            window.removeEventListener('touchend', end);
        };
    }, []);

    return (
        <div 
            className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-widest select-none flex items-center justify-center w-full h-64"
            onMouseMove={handleDrag}
            onTouchMove={handleDrag}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            onMouseLeave={handleDragEnd}
            aria-label="Word 'ZIPPER' with a draggable zipper."
        >
            <span>ZIPP</span>
            <div ref={trackRef} className="relative w-12 h-4/5 mx-2 flex flex-col items-center">
                {/* Zipper teeth background */}
                <div className="absolute top-0 w-12 h-full overflow-hidden">
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #4b5563 2px, transparent 2px), linear-gradient(to bottom, #4b5563 2px, transparent 2px)', backgroundSize: '100% 20px', backgroundPosition: '0 0, 100% 10px', backgroundRepeat: 'repeat-y' }} />
                </div>
                {/* The "unzipped" part */}
                <div className="absolute top-0 w-2 h-full bg-gray-800" style={{ height: `${zipHeight}px`}}></div>
                {/* Zipper pull */}
                <div 
                    className="absolute w-6 h-8 bg-gray-400 hover:bg-gray-300 rounded-sm cursor-grab active:cursor-grabbing z-10"
                    style={{ top: `${zipHeight}px`, transform: 'translateY(-50%)' }}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                ></div>
            </div>
            <span>ER</span>
        </div>
    );
};

// Demo 10: Moon
const moonPhases = [
    <circle key="full" cx="25" cy="25" r="24" fill="white" />,
    <path key="wg" d="M25,1 A24,24 0 1,0 25,49 A16,24 0 1,1 25,1 Z" fill="white" />,
    <path key="lq" d="M25,1 A24,24 0 1,0 25,49 L25,1 Z" fill="white" />,
    <path key="wc" d="M17,6 A24,24 0 1,0 17,44 A16,16 0 1,1 17,6 Z" fill="white" />,
    <circle key="new" cx="25" cy="25" r="24" fill="transparent" stroke="white" strokeWidth="1"/>,
    <path key="wxc" d="M33,6 A24,24 0 1,1 33,44 A16,16 0 1,0 33,6 Z" fill="white" />,
    <path key="fq" d="M25,49 A24,24 0 1,0 25,1 L25,49 Z" fill="white" />,
    <path key="wxg" d="M25,1 A24,24 0 1,1 25,49 A16,24 0 1,0 25,1 Z" fill="white" />,
];

export const MoonDemo: React.FC = () => {
    const [phase1, setPhase1] = useState(0);
    const [phase2, setPhase2] = useState(4);

    const nextPhase = (setter: React.Dispatch<React.SetStateAction<number>>) => {
        setter(prev => (prev + 1) % moonPhases.length);
    };

    return (
        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-wider select-none flex items-center justify-center">
            <span>M</span>
             <svg 
                viewBox="0 0 50 50" 
                className="w-[1em] h-[1em] mx-1 cursor-pointer"
                onClick={() => nextPhase(setPhase1)}
                aria-label="First 'O' in Moon, click to change phase."
                role="button"
            >
                {moonPhases[phase1]}
            </svg>
            <svg 
                viewBox="0 0 50 50" 
                className="w-[1em] h-[1em] mx-1 cursor-pointer"
                onClick={() => nextPhase(setPhase2)}
                aria-label="Second 'O' in Moon, click to change phase."
                role="button"
            >
                {moonPhases[phase2]}
            </svg>
            <span>N</span>
        </div>
    );
};

// Demo 11: Tunnel
export const TunnelDemo: React.FC = () => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const { width, height } = rect;
        
        const rotateX = ((y / height) - 0.5) * -30;
        const rotateY = ((x / width) - 0.5) * 30;
        setRotation({ x: rotateX, y: rotateY });
    };

    return (
        <div 
            ref={containerRef}
            className="text-8xl md:text-9xl font-black text-white tracking-tighter select-none flex items-center justify-center h-48"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setRotation({ x: 0, y: 0 })}
            style={{ perspective: '1000px' }}
            aria-label="Word 'TUNNEL', hover to look inside."
        >
            <span>TU</span>
            <div className="relative mx-1 transition-transform duration-100 ease-out" style={{ transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`}}>
                <span className="absolute opacity-50" style={{transform: 'translateZ(-50px)'}}>NN</span>
                <span className="absolute opacity-75" style={{transform: 'translateZ(-25px)'}}>NN</span>
                <span>NN</span>
            </div>
            <span>EL</span>
        </div>
    );
};

// Demo 12: Spiderman
export const SpidermanDemo: React.FC = () => {
    const [rotation, setRotation] = useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentX = x / rect.width;
        setRotation((percentX - 0.5) * 30); // range -15 to 15 deg
    };

    return (
        <div 
            ref={containerRef}
            className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-normal select-none w-full flex justify-center items-end h-64"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setRotation(0)}
            aria-label="Word 'SPIDER-MAN', hover to make the 'M' swing."
        >
            <span>SPIDER-</span>
            <div className="relative w-[1.2em] h-[2em] mx-1">
                <div className="absolute top-[-2em] left-1/2 w-px h-[3em] bg-gray-500"></div>
                <div 
                    className="absolute top-[-0.2em] left-0 w-full transition-transform duration-300 ease-out"
                    style={{ 
                        transformOrigin: 'top center',
                        transform: `rotate(${rotation}deg)`
                    }}
                >
                    M
                </div>
            </div>
            <span>AN</span>
        </div>
    );
};
