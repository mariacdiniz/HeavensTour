import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, useGLTF, Float } from '@react-three/drei'
import type { Group } from 'three'
import { useTheme } from '@/contexts/ThemeContext'

const MODEL_PATH = '/models/aircraft.glb'

async function isValidGlbAvailable(): Promise<boolean> {
  try {
    const res = await fetch(MODEL_PATH, { headers: { Range: 'bytes=0-3' } })
    if (!res.ok && res.status !== 206) return false
    const contentType = res.headers.get('content-type') ?? ''
    if (contentType.includes('text/html')) return false
    const buffer = await res.arrayBuffer()
    if (buffer.byteLength < 4) return false
    const magic = new TextDecoder().decode(new Uint8Array(buffer, 0, 4))
    return magic === 'glTF'
  } catch {
    return false
  }
}

function ProceduralAircraft({ light }: { light?: boolean }) {
  const group = useRef<Group>(null)
  const body = light ? '#e2e8f0' : '#cbd5e1'
  const wing = light ? '#cbd5e1' : '#94a3b8'

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={group} scale={1.1} position={[0, -0.2, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.22, 2.4, 24]} />
        <meshStandardMaterial color={body} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.02, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[2.8, 0.05, 0.55]} />
        <meshStandardMaterial color={wing} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.35, -0.85]} rotation={[0.55, 0, Math.PI / 2]}>
        <boxGeometry args={[0.9, 0.04, 0.35]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.28} />
      </mesh>
      <mesh position={[1.15, 0, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.14, 0.35, 16]} />
        <meshStandardMaterial color={light ? '#3b82f6' : '#5eb8e8'} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  )
}

function GltfAircraft() {
  const { scene } = useGLTF(MODEL_PATH)
  const group = useRef<Group>(null)
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.1
  })
  return (
    <group ref={group}>
      <primitive object={scene} scale={0.45} position={[0, -0.5, 0]} />
    </group>
  )
}

function AircraftModel({ light }: { light?: boolean }) {
  const [mode, setMode] = useState<'loading' | 'gltf' | 'procedural'>('loading')

  useEffect(() => {
    let cancelled = false
    isValidGlbAvailable().then((valid) => {
      if (cancelled) return
      if (valid) {
        useGLTF.preload(MODEL_PATH)
        setMode('gltf')
      } else {
        setMode('procedural')
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (mode === 'gltf') {
    return (
      <Suspense fallback={<ProceduralAircraft light={light} />}>
        <GltfAircraft />
      </Suspense>
    )
  }

  return <ProceduralAircraft light={light} />
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function SceneContent({
  showControls,
  light,
}: {
  showControls?: boolean
  light?: boolean
}) {
  return (
    <>
      {!light && (
        <Stars radius={80} depth={40} count={1200} factor={2} saturation={0} fade speed={0.3} />
      )}
      <ambientLight intensity={light ? 0.85 : 0.4} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={light ? 1.2 : 1}
        color={light ? '#fff' : '#e0f2fe'}
      />
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.2}>
        <AircraftModel light={light} />
      </Float>
      <Suspense fallback={null}>
        <Environment preset={light ? 'city' : 'dawn'} />
      </Suspense>
      {showControls && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.05}
          minPolarAngle={Math.PI / 3.2}
        />
      )}
    </>
  )
}

interface AircraftSceneProps {
  className?: string
  height?: number | string
  showControls?: boolean
}

export function AircraftScene({
  className = '',
  height = 420,
  showControls = true,
}: AircraftSceneProps) {
  const { theme } = useTheme()
  const light = theme === 'light'

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-runway ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent"
      />
      <SceneErrorBoundary fallback={null}>
        <Canvas
          className="!absolute inset-0"
          camera={{ position: [0, 1.2, 7], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent showControls={showControls} light={light} />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  )
}

/** Fundo do app — céu claro ou noite discreta (sem “espaço”) */
export function SkyBackground() {
  const { theme } = useTheme()

  if (theme === 'light') {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, #dce9f5 0%, #eef3f9 45%, var(--bg) 100%)',
        }}
      />
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-background">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgb(37 99 235 / 0.12), transparent)',
        }}
      />
    </div>
  )
}
