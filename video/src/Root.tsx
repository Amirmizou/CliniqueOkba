import React from 'react'
import { Composition } from 'remotion'
import { ClinicPromo } from './promo/ClinicPromo'
import { FPS, TOTAL_DURATION } from './promo/constants'

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ClinicPromo"
      component={ClinicPromo}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  )
}
