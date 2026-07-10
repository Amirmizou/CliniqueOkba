import './index.css'
import { Composition } from 'remotion'
import { OkbaLogo } from './OkbaLogo'
import { LogoMotion } from './LogoMotion'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Motion graphic vectoriel — cercle qui se dessine, feuilles qui
          poussent une à une, wordmark révélé, tagline. Construit à partir
          des éléments du logo (branche · cercle · texte). */}
      <Composition
        id="LogoMotion"
        component={LogoMotion}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* Ancienne version (wipe du logo raster) — conservée */}
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
