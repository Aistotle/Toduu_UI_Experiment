import React, { useMemo, useRef, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const INK = 'var(--ink)';
const INK_SOFT = 'rgba(17,17,17,0.45)';
const INK_GHOST = 'rgba(17,17,17,0.15)';
const INK_SOLID = 'rgba(17,17,17,0.85)';

export const ClockDemo: React.FC = () => {
  return (
    <div
      className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-widest select-none"
      style={{ color: INK }}
    >
      <span className="inline-flex items-center">
        <span>C</span>
        <span
          className="relative w-[1em] h-[1em] border-[3px] rounded-full mx-1 flex items-center justify-center"
          style={{ borderColor: INK }}
        >
          <div className="absolute w-1 h-1/3 clock-hand-hour" style={{ backgroundColor: INK, bottom: '50%' }} />
          <div className="absolute w-0.5 h-1/2 clock-hand-minute" style={{ backgroundColor: INK, bottom: '50%' }} />
        </span>
        <span>CK</span>
      </span>
    </div>
  );
};

const GravityLetter: React.FC<{ children: string }> = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const randomRotation = useMemo(() => (Math.random() - 0.5) * 15, []);
  const randomY = useMemo(() => Math.random() * 10, []);

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-block transition-transform duration-500 ease-out"
      style={{
        transform: `translateY(${isHovered ? 20 : randomY}px) rotate(${isHovered ? randomRotation * 2 : randomRotation}deg)`,
        cursor: 'pointer',
      }}
    >
      {children}
    </span>
  );
};

export const GravityDemo: React.FC = () => {
  const word = 'Gravity';
  return (
    <div className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-wider select-none" style={{ color: INK }}>
      {word.split('').map((char, index) => (
        <GravityLetter key={`${char}-${index}`}>{char}</GravityLetter>
      ))}
    </div>
  );
};

export const HighDemo: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.5 });
  return (
    <div
      ref={ref}
      className="text-8xl sm:text-9xl font-bold tracking-normal select-none relative h-48 w-full flex justify-center items-center"
      style={{ color: INK }}
    >
      <span className="inline-flex items-end">
        <span>H</span>
        <span className="inline-flex flex-col items-center mx-1">
          <span
            className="w-4 h-4 rounded-full transition-transform duration-1000 ease-in-out"
            style={{
              backgroundColor: INK,
              transform: `translateY(${isVisible ? '-100px' : '0px'})`,
            }}
          />
          <span className="-mt-2">i</span>
        </span>
        <span>gh</span>
      </span>
    </div>
  );
};

export const ParallelDemo: React.FC = () => {
  return (
    <div className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-normal select-none" style={{ color: INK }}>
      <span className="inline-flex items-center">
        <span>para</span>
        <span className="inline-block h-[1.2em] w-2 mx-1" style={{ backgroundColor: INK }} />
        <span className="inline-block h-[1.2em] w-2 mx-1" style={{ backgroundColor: INK }} />
        <span>el</span>
      </span>
    </div>
  );
};

export const TsunamiDemo: React.FC = () => {
  return (
    <div className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-wide select-none flex items-center" style={{ color: INK }}>
      <span>T</span>
      <svg viewBox="0 0 200 100" width="120" height="100" className="mx-2" style={{ color: INK }}>
        <path className="tsunami-wave" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" d="M 10 80 C 40 20, 60 20, 90 80 S 140 140, 190 80" />
      </svg>
      <span>unami</span>
    </div>
  );
};

export const ElevatorDemo: React.FC = () => {
  const [level, setLevel] = useState(0);

  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
      <div
        className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-wide select-none transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(${level}px)`, color: INK }}
      >
        <span>ELE</span>
        <span
          onClick={() => setLevel((prev) => Math.max(prev - 40, -40))}
          className="transition-colors cursor-pointer text-[color:rgba(17,17,17,0.45)] hover:text-[var(--ink)]"
          title="Go Up"
        >
          V
        </span>
        <span
          onClick={() => setLevel((prev) => Math.min(prev + 40, 40))}
          className="transition-colors cursor-pointer text-[color:rgba(17,17,17,0.45)] hover:text-[var(--ink)]"
          title="Go Down"
        >
          A
        </span>
        <span>TOR</span>
      </div>
      {level !== 0 && (
        <button
          onClick={() => setLevel(0)}
          className="absolute bottom-4 text-xs py-1 px-3 rounded-full shadow-sm transition-colors bg-[var(--ink)] text-[var(--bg)]"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export const SmileDemo: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="text-8xl sm:text-9xl font-bold tracking-tight select-none flex justify-center items-center cursor-pointer h-48"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ color: INK }}
      aria-label="Word 'Smile'. Hover over it to see the 'i' wink."
    >
      <span>Sm</span>
      <span className="relative w-[0.5em] h-[1.1em] mx-1">
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[0.2em] h-[0.6em] rounded-sm" style={{ backgroundColor: INK }} />
        <span
          className="absolute top-[0.1em] left-1/2 -translate-x-1/2 transition-all duration-200 ease-out origin-center"
          style={{
            backgroundColor: INK,
            width: isHovered ? '0.6em' : '0.4em',
            height: isHovered ? '0.1em' : '0.4em',
            borderRadius: '9999px',
          }}
        />
      </span>
      <span>le</span>
    </div>
  );
};

export const VoyeurDemo: React.FC = () => {
  const oRef = useRef<HTMLSpanElement>(null);
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
      className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-widest select-none w-full h-full flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPupilPos({ x: 0, y: 0 })}
      style={{ color: INK }}
      aria-label="Word 'VOYEUR', where the 'O' is an eye that follows your cursor."
    >
      <span>V</span>
      <span
        ref={oRef}
        className="relative w-[1em] h-[1em] border-[3px] rounded-full mx-2 flex items-center justify-center"
        style={{ borderColor: INK }}
      >
        <span className="absolute w-1/2 h-1/2 rounded-full flex items-center justify-center" style={{ backgroundColor: INK }}>
          <span
            className="w-1/2 h-1/2 rounded-full transition-transform duration-100 ease-out"
            style={{ backgroundColor: 'var(--bg)', transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}
          />
        </span>
      </span>
      <span className="mx-1" style={{ color: INK_SOFT }}>
        Y
      </span>
      <span>EUR</span>
    </div>
  );
};

export const ZipperDemo: React.FC = () => {
  const [zipHeight, setZipHeight] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const toothMaskHeight = 5 * 18; // remove 5 zipper teeth while keeping overall alignment manageable
  const gradient = `linear-gradient(to bottom, ${INK_SOFT} 2px, transparent 2px), linear-gradient(to bottom, ${INK_SOFT} 2px, transparent 2px)`;

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const nativeEvent = e.nativeEvent;
    const isTouch = 'touches' in nativeEvent;
    const clientY = isTouch
      ? (nativeEvent as TouchEvent).touches[0]?.clientY ?? 0
      : (nativeEvent as MouseEvent).clientY;
    const trackLimit = Math.max(10, rect.height - toothMaskHeight);
    const newHeight = Math.max(10, Math.min(trackLimit, clientY - rect.top));
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
      className="text-6xl sm:text-7xl md:text-8xl font-black tracking-widest select-none flex items-center justify-center w-full h-64"
      onMouseMove={handleDrag}
      onTouchMove={handleDrag}
      onMouseUp={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      style={{ color: INK }}
      aria-label="Word 'ZIPPER' with a draggable zipper."
    >
      <span>Z</span>
      <div
        ref={trackRef}
        className="relative h-4/5 mx-2 flex flex-col items-center"
        style={{ width: '1.5rem', top: `${toothMaskHeight / 2}px` }}
      >
        <div className="absolute top-0 h-full overflow-hidden" style={{ width: '1.5rem' }}>
          <div
            className="absolute inset-0"
            style={{ background: gradient, backgroundSize: '100% 18px', backgroundPosition: '0 0, 100% 9px', backgroundRepeat: 'repeat-y' }}
          />
          <div
            aria-hidden
            className="absolute bottom-0 w-full"
            style={{ height: `${toothMaskHeight}px`, backgroundColor: 'var(--bg)' }}
          />
        </div>
        <div className="absolute top-0" style={{ width: '3px', height: `${zipHeight}px`, backgroundColor: INK_SOLID }} />
        <div
          className="absolute rounded-sm cursor-grab active:cursor-grabbing z-10 transition-colors"
          style={{ width: '9px', height: '14px', top: `${zipHeight}px`, transform: 'translateY(-50%)', backgroundColor: INK_SOFT }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        />
      </div>
      <span>PPER</span>
    </div>
  );
};

const moonPhases = [
  <circle key="full" cx="25" cy="25" r="24" fill="currentColor" />,
  <path key="wg" d="M25,1 A24,24 0 1,0 25,49 A16,24 0 1,1 25,1 Z" fill="currentColor" />,
  <path key="lq" d="M25,1 A24,24 0 1,0 25,49 L25,1 Z" fill="currentColor" />,
  <path key="wc" d="M17,6 A24,24 0 1,0 17,44 A16,16 0 1,1 17,6 Z" fill="currentColor" />,
  <circle key="new" cx="25" cy="25" r="24" fill="transparent" stroke="currentColor" strokeWidth="1" />,
  <path key="wxc" d="M33,6 A24,24 0 1,1 33,44 A16,16 0 1,0 33,6 Z" fill="currentColor" />,
  <path key="fq" d="M25,49 A24,24 0 1,0 25,1 L25,49 Z" fill="currentColor" />,
  <path key="wxg" d="M25,1 A24,24 0 1,1 25,49 A16,24 0 1,0 25,1 Z" fill="currentColor" />,
];

export const MoonDemo: React.FC = () => {
  const [phase1, setPhase1] = useState(0);
  const [phase2, setPhase2] = useState(4);

  const nextPhase = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => (prev + 1) % moonPhases.length);
  };

  return (
    <div className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-wider select-none flex items-center justify-center" style={{ color: INK }}>
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

export const TunnelDemo: React.FC = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="text-8xl md:text-9xl font-black tracking-tighter select-none flex items-center justify-center h-48"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
      style={{ perspective: '1000px', color: INK }}
      aria-label="Word 'TUNNEL', hover to look inside."
    >
      <span>TU</span>
      <div className="relative mx-1 transition-transform duration-100 ease-out" style={{ transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
        <span className="absolute opacity-50" style={{ transform: 'translateZ(-50px)', color: INK_SOFT }}>NN</span>
        <span className="absolute opacity-75" style={{ transform: 'translateZ(-25px)', color: INK_SOLID }}>NN</span>
        <span>NN</span>
      </div>
      <span>EL</span>
    </div>
  );
};

export const SpidermanDemo: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentX = x / rect.width;
    setRotation((percentX - 0.5) * 30);
  };

  return (
    <div
      ref={containerRef}
      className="text-6xl sm:text-7xl md:text-8xl font-black tracking-normal select-none w-full flex justify-center items-end h-64"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation(0)}
      style={{ color: INK }}
      aria-label="Word 'SPIDER-MAN', hover to make the 'M' swing."
    >
      <span>SPIDER-</span>
      <div className="relative w-[1.2em] h-[2em] mx-1">
        <div className="absolute top-[-2em] left-1/2 w-px h-[3em]" style={{ backgroundColor: INK_SOFT }} />
        <div
          className="absolute top-[-0.2em] left-0 w-full transition-transform duration-300 ease-out"
          style={{ transformOrigin: 'top center', transform: `rotate(${rotation}deg)` }}
        >
          M
        </div>
      </div>
      <span>AN</span>
    </div>
  );
};
