import './index.css'
import { Composition } from 'remotion'
import { OkbaLogo } from './OkbaLogo'
import { ClinicBackdrop } from './ClinicBackdrop'
import { ClinicDrone3D } from './ClinicDrone3D'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Survol drone 3D — vraies photos transformées en relief 3D (12 s) */}
      <Composition
        id="ClinicDrone3D"
        component={ClinicDrone3D}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Fond cinématique de la clinique (vraies photos, 2.5D) — section À propos
          • 360 f @ 30 fps = 12 s : aérien → façade rue → entrée, fondus enchaînés
      */}
      <Composition
        id="ClinicBackdrop"
        component={ClinicBackdrop}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Animation logo Clinique OKBA
          • Transparent (aucun fond) — superposable sur n'importe quel fond
          • 130 f @ 30 fps ≈ 4.3 s : tige → plante → CLINIQUE → reflet → respiration
      */}
      <Composition
        id="OkbaLogo"
        component={OkbaLogo}
        durationInFrames={130}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  )
}
