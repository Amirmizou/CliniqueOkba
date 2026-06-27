'use client'

import React, { useRef, useEffect } from 'react'

interface UniversalPlayerProps {
  url: string
  playing?: boolean
  muted?: boolean
  controls?: boolean
  loop?: boolean
  className?: string
  poster?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onClick?: () => void
}

export function UniversalPlayer({
  url,
  playing = false,
  muted = false,
  controls = true,
  loop = false,
  className = '',
  poster,
  onPlay,
  onPause,
  onEnded,
  onClick
}: UniversalPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Autoplay effect for native video
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (playing) {
      v.play().catch((e) => {
        // Ignore NotSupportedError for placeholder/unsupported videos
        if (e.name !== 'NotSupportedError' && e.name !== 'NotAllowedError') {
          console.warn('[UniversalPlayer] play failed:', e.message)
        }
        onPause?.()
      })
    } else {
      v.pause()
    }
  }, [playing])

  if (!url) return null

  // Check if YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1]
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${playing ? 1 : 0}&mute=${muted ? 1 : 0}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${loop ? videoId : ''}&playsinline=1`
    
    return (
      <div className={`relative ${className}`} onClick={onClick}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ pointerEvents: controls ? 'auto' : 'none' }}
        />
      </div>
    )
  }

  // Check if Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/i)
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1]
    const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=${playing ? 1 : 0}&muted=${muted ? 1 : 0}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}`
    
    return (
      <div className={`relative ${className}`} onClick={onClick}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ pointerEvents: controls ? 'auto' : 'none' }}
        />
      </div>
    )
  }

  // Check if Facebook
  const isFacebook = url.includes('facebook.com') || url.includes('fb.watch')
  if (isFacebook) {
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=auto&autoplay=${playing ? 'true' : 'false'}`
    
    return (
      <div className={`relative ${className}`} onClick={onClick}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          style={{ pointerEvents: controls ? 'auto' : 'none' }}
        />
      </div>
    )
  }

  // Fallback to native HTML5 video for MP4/WebM
  return (
    <video
      ref={videoRef}
      src={url}
      poster={poster}
      muted={muted}
      loop={loop}
      controls={controls}
      playsInline
      autoPlay={playing}
      className={className}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnded}
      onClick={onClick}
    />
  )
}
