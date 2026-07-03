import { useMemo } from 'react'
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Easing,
} from 'remotion'
import { ThreeCanvas } from '@remotion/three'
import { useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * « Survol drone » 3D de la Clinique OKBA.
 * Chaque VRAIE photo est transformée en surface 3D à relief : une carte de
 * profondeur floutée (générée depuis la photo) déplace la géométrie → relief
 * LISSE, tandis que la photo nette reste la couleur. Une caméra en perspective
 * survole la scène comme un drone, avec fondus enchaînés fluides.
 */

const easeInOut = Easing.inOut(Easing.ease)

const PLANE_W = 30
const PLANE_H = 16.9 // ~16:9

function coverTexture(tex: THREE.Texture, planeAspect: number, biasY = 0.5) {
  const img = tex.image as { width: number; height: number }
  const texAspect = img.width / img.height
  tex.center.set(0.5, 0.5)
  if (texAspect > planeAspect) {
    const r = planeAspect / texAspect
    tex.repeat.set(r, 1)
    tex.offset.set((1 - r) / 2, 0)
  } else {
    const r = texAspect / planeAspect
    tex.repeat.set(1, r)
    tex.offset.set(0, (1 - r) * biasY)
  }
  tex.needsUpdate = true
}

type SceneProps = {
  color: string
  depth: string
  opacity: number
  zOffset: number
  displacement: number
  biasY?: number
}

const ReliefPlane: React.FC<SceneProps> = ({ color, depth, opacity, zOffset, displacement, biasY = 0.5 }) => {
  const [colorTex, depthTex] = useLoader(THREE.TextureLoader, [staticFile(color), staticFile(depth)])

  useMemo(() => {
    colorTex.colorSpace = THREE.SRGBColorSpace
    colorTex.minFilter = THREE.LinearFilter
    colorTex.magFilter = THREE.LinearFilter
    depthTex.minFilter = THREE.LinearFilter
    depthTex.magFilter = THREE.LinearFilter
    coverTexture(colorTex, PLANE_W / PLANE_H, biasY)
    coverTexture(depthTex, PLANE_W / PLANE_H, biasY)
  }, [colorTex, depthTex, biasY])

  if (opacity <= 0.001) return null

  return (
    <mesh position={[0, 0, zOffset]}>
      <planeGeometry args={[PLANE_W, PLANE_H, 260, 150]} />
      <meshStandardMaterial
        map={colorTex}
        emissiveMap={colorTex}
        emissive={'#ffffff'}
        emissiveIntensity={0.5}
        displacementMap={depthTex}
        displacementScale={displacement}
        displacementBias={-displacement * 0.5}
        roughness={1}
        metalness={0}
        transparent
        opacity={opacity}
        depthWrite={opacity > 0.5}
      />
    </mesh>
  )
}

/** Caméra « drone » — survol cinématique lisse de la maquette aérienne. */
const DroneRig: React.FC = () => {
  const frame = useCurrentFrame()
  const { camera } = useThree()

  const p = frame / 360

  // Établissement (recul haut) → poussée vers l'angle → glisse latérale →
  // légère orbite révélant la profondeur → retour doux.
  const z = interpolate(p, [0, 0.28, 0.62, 1], [18.2, 16.0, 15.9, 17.3], { easing: easeInOut })
  const x = interpolate(p, [0, 0.3, 0.62, 1], [-1.2, 0.4, 1.2, -0.4], { easing: easeInOut })
  const y = interpolate(p, [0, 0.32, 0.7, 1], [1.0, -0.3, -0.6, 0.5], { easing: easeInOut })
  const lookX = interpolate(p, [0, 0.5, 1], [0.7, -0.2, -0.6], { easing: easeInOut })
  const lookY = interpolate(p, [0, 0.5, 1], [-0.5, 0.1, 0.35], { easing: easeInOut })

  camera.position.set(x, y, z)
  camera.lookAt(lookX, lookY, 0)
  camera.updateMatrixWorld()

  return null
}

const Scene: React.FC = () => {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[-7, 9, 7]} intensity={0.7} />
      <DroneRig />
      {/* Survol drone 3D de la prise aérienne (relief le plus fidèle) */}
      <ReliefPlane color="clinic-3.png" depth="clinic-3-depth.jpg" opacity={1} zOffset={0} displacement={2.6} biasY={0.5} />
    </>
  )
}

export const ClinicDrone3D: React.FC = () => {
  const { width, height } = useVideoConfig()
  const frame = useCurrentFrame()

  const sweep = interpolate(frame, [0, 360], [-30, 130], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ backgroundColor: '#04140c' }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 18] }}
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Scene />
      </ThreeCanvas>

      {/* ── Étalonnage premium (par-dessus le canvas 3D) ── */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(115deg, transparent ${sweep - 14}%, rgba(255,255,255,0.09) ${sweep}%, transparent ${sweep + 14}%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(120% 92% at 50% 34%, rgba(0,0,0,0) 48%, rgba(0,26,15,0.42) 100%)',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill style={{ boxShadow: 'inset 0 0 230px 70px rgba(2,10,6,0.5)', pointerEvents: 'none' }} />
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #006633 20%, #00a651 50%, #FDE68A 68%, #006633 85%, transparent)',
            opacity: 0.9,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
