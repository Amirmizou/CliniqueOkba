import './index.css'
import { Composition } from 'remotion'
import { OkbaLogo } from './OkbaLogo'

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
