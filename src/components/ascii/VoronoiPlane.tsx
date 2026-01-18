import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ShaderMaterial, Vector2 } from 'three'

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;

  varying vec2 vUv;

  // Color palette matched to reference image (stained glass)
  vec3 purple = vec3(0.36, 0.27, 0.84);      // #5B45D6 - vibrant purple-blue
  vec3 pink = vec3(0.94, 0.72, 0.94);        // #F0B8F0 - soft pink
  vec3 amber = vec3(0.85, 0.60, 0.20);       // #D99933 - golden amber
  vec3 lavender = vec3(0.78, 0.69, 0.88);    // #C8B0E0 - soft lavender
  vec3 magenta = vec3(0.94, 0.55, 0.94);     // #F08CF0 - bright magenta

  // Pseudo-random function
  vec2 random2(vec2 p) {
    return fract(sin(vec2(
      dot(p, vec2(127.1, 311.7)),
      dot(p, vec2(269.5, 183.3))
    )) * 43758.5453);
  }

  // Select color based on cell ID
  vec3 selectColor(float id) {
    float t = fract(id * 5.0);

    if (t < 0.2) {
      return purple;
    } else if (t < 0.4) {
      return pink;
    } else if (t < 0.6) {
      return amber;
    } else if (t < 0.8) {
      return lavender;
    } else {
      return magenta;
    }
  }

  void main() {
    // Aspect ratio correction
    vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 st = vUv * aspectRatio * 8.0; // Cell density

    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float minDist = 1.0;
    float secondMinDist = 1.0;
    float cellId = 0.0;

    // Check neighboring cells (3x3 grid)
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = random2(i_st + neighbor);

        // Slow, organic animation of cell centers
        point = 0.5 + 0.4 * sin(uTime * 0.15 + 6.2831 * point);

        vec2 diff = neighbor + point - f_st;
        float dist = length(diff);

        if (dist < minDist) {
          secondMinDist = minDist;
          minDist = dist;
          cellId = random2(i_st + neighbor).x;
        } else if (dist < secondMinDist) {
          secondMinDist = dist;
        }
      }
    }

    // Get cell color based on ID (flat, solid color like reference)
    vec3 color = selectColor(cellId);

    // Stained glass black edges (thicker to match reference)
    float edgeWidth = 0.05;
    float edge = smoothstep(0.0, edgeWidth, secondMinDist - minDist);
    color = mix(vec3(0.0), color, edge);

    gl_FragColor = vec4(color, 1.0);
  }
`

export function VoronoiPlane() {
  const materialRef = useRef<ShaderMaterial>(null)
  const { viewport, size } = useThree()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new Vector2(size.width, size.height) },
  }), [size.width, size.height])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
