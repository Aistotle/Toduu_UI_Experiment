import { useState } from 'react';

// A bowl.
// It holds nothing. It does nothing.
// It is only itself, carefully.

export function Bowl() {
  const [angle, setAngle] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setAngle({ x: y * 12, y: x * 12 });
  };

  const handleMouseLeave = () => {
    setAngle({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // The glaze color shifts ever so slightly with angle
  const baseHue = 28;
  const glazeColor = `hsl(${baseHue + angle.y * 0.5}, ${18 + Math.abs(angle.x)}%, ${82 - Math.abs(angle.y) * 0.5}%)`;
  const innerShadow = `hsl(${baseHue}, 15%, ${72 - Math.abs(angle.x) * 2}%)`;
  const rimLight = `hsl(${baseHue + 5}, 12%, ${94 + angle.x * 2}%)`;

  return (
    <section
      style={{
        minHeight: '100vh',
        background: '#F7F6F3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', system-ui, sans-serif",
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* The surface it sits on - suggested, not shown */}
      <div
        style={{
          position: 'relative',
          width: '400px',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* The bowl */}
        <div
          style={{
            position: 'relative',
            width: '220px',
            height: '140px',
            transition: 'transform 600ms cubic-bezier(0.32, 0.72, 0, 1)',
            transform: `perspective(800px) rotateX(${angle.x}deg) rotateY(${angle.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Shadow on surface */}
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              transform: `translateX(-50%) translateX(${angle.y * 2}px)`,
              width: '180px',
              height: '30px',
              background: 'radial-gradient(ellipse, rgba(31, 27, 22, 0.08) 0%, transparent 70%)',
              filter: 'blur(8px)',
              transition: 'all 600ms cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          />

          {/* Bowl body - the outer form */}
          <svg
            viewBox="0 0 220 140"
            style={{
              width: '100%',
              height: '100%',
              overflow: 'visible',
            }}
          >
            <defs>
              {/* Glaze gradient */}
              <linearGradient id="glaze" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={rimLight} />
                <stop offset="30%" stopColor={glazeColor} />
                <stop offset="70%" stopColor={glazeColor} />
                <stop offset="100%" stopColor={innerShadow} />
              </linearGradient>

              {/* Inner shadow gradient */}
              <radialGradient id="inner" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor={innerShadow} stopOpacity="0.3" />
                <stop offset="100%" stopColor={innerShadow} stopOpacity="0.8" />
              </radialGradient>

              {/* Subtle rim highlight */}
              <linearGradient id="rim" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={rimLight} />
                <stop offset="50%" stopColor={glazeColor} />
              </linearGradient>
            </defs>

            {/* The bowl's outer edge */}
            <ellipse
              cx="110"
              cy="35"
              rx="100"
              ry="28"
              fill="url(#glaze)"
              style={{
                transition: 'all 600ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            />

            {/* The bowl's body curve */}
            <path
              d={`
                M 10 35
                Q 10 120, 110 125
                Q 210 120, 210 35
              `}
              fill="url(#glaze)"
              style={{
                transition: 'all 600ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            />

            {/* The interior visible through the opening */}
            <ellipse
              cx="110"
              cy="38"
              rx="88"
              ry="22"
              fill={innerShadow}
              style={{
                transition: 'all 600ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            />

            {/* Inner depth suggestion */}
            <ellipse
              cx="110"
              cy="42"
              rx="70"
              ry="16"
              fill="url(#inner)"
              style={{
                transition: 'all 600ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            />

            {/* Rim highlight - the thin edge catching light */}
            <ellipse
              cx="110"
              cy="35"
              rx="100"
              ry="28"
              fill="none"
              stroke={rimLight}
              strokeWidth="2"
              style={{
                transition: 'all 600ms cubic-bezier(0.32, 0.72, 0, 1)',
                opacity: 0.6,
              }}
            />

            {/* A subtle imperfection - the maker's mark */}
            <circle
              cx="160"
              cy="85"
              r="3"
              fill={innerShadow}
              opacity="0.15"
            />
          </svg>
        </div>
      </div>

      {/* No label. No explanation. Just a whisper. */}
      <p
        style={{
          marginTop: '64px',
          color: '#6E6A62',
          fontSize: '13px',
          opacity: isHovered ? 0.5 : 0.25,
          transition: 'opacity 800ms cubic-bezier(0.32, 0.72, 0, 1)',
          letterSpacing: '0.04em',
          fontStyle: 'italic',
        }}
      >
        for holding
      </p>
    </section>
  );
}
