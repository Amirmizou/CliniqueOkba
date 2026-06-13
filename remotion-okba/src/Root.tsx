import './index.css'
import { Composition } from 'remotion'
import { OkbaLogo } from './OkbaLogo'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Animation logo Clinique OKBA — écran de chargement / habillage */}
      <Composition
        id="OkbaLogo"
        component={OkbaLogo}
        durationInFrames={110}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  )
}
