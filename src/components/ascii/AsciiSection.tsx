import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { VoronoiPlane } from './VoronoiPlane'

function VoronoiSectionFallback() {
  return (
    <div className="h-full w-full bg-ink flex items-center justify-center">
      <div className="text-bg/50 font-sans text-sm">Loading...</div>
    </div>
  )
}

export function AsciiSection() {
  const containerRef = useRef<HTMLElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // If user prefers reduced motion, show a static fallback
  if (prefersReducedMotion) {
    return (
      <section
        className="relative h-screen overflow-hidden"
        style={{ backgroundColor: '#1F1B16' }}
        aria-label="Visual effect showcase"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-4xl md:text-6xl text-bg/90" style={{ letterSpacing: '-0.02em' }}>
              Crafted with care
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      style={{ backgroundColor: '#000000' }}
      aria-label="Visual effect showcase"
    >
      <Suspense fallback={<VoronoiSectionFallback />}>
        <Canvas
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <VoronoiPlane />
        </Canvas>
      </Suspense>
    </section>
  )
}
