'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className='w-10 h-10 rounded-full border border-border/50 bg-secondary/20' />
    )
  }

  const isDark = theme === 'dark'

  const playSwitchSound = (turningOff: boolean) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Son mécanique de l'interrupteur (clac sec)
      osc.type = 'square';
      osc.frequency.setValueAtTime(turningOff ? 200 : 400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Ignorer si bloqué
    }
  }

  const toggleTheme = () => {
    const nextIsDark = !isDark
    playSwitchSound(nextIsDark)
    setTheme(nextIsDark ? 'dark' : 'light')
  }

  return (

    <button
      onClick={toggleTheme}
      type="button"
      className="relative flex items-center justify-center w-10 h-10 rounded-full group outline-none touch-target"
      aria-label="Toggle theme surgical light"
    >
      {/* Base/Boîtier du scialytique */}
      <div className="absolute inset-0 rounded-full border-[1px] border-[#1e293b]/60 bg-[#0a0f1c] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_2px_4px_rgba(0,0,0,0.1)] transition-colors group-hover:border-[#334155]/80" />

      {/* The 3 large LED Pods array (pétales du scialytique style "Maquet/Steris clover") */}
      {[0, 120, 240].map((angle, i) => (
        <div 
          key={angle}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {/* Petal body */}
          <motion.div 
            className="w-[18px] h-[18px] rounded-full border border-[#020408]/80 -translate-y-[7px] z-0"
            initial={false}
            animate={{
              backgroundColor: isDark ? '#111827' : '#ffffff',
              boxShadow: isDark 
                ? 'inset 0 3px 6px rgba(0,0,0,0.9)' 
                : '0 0 15px rgba(255,255,255,0.9), 0 0 25px rgba(250,204,21,0.5), inset 0 0 8px #fff'
            }}
            transition={{ 
              duration: 0.15, 
              // Séquence d'allumage rotative (très rapide)
              delay: isDark ? 0 : i * 0.04 
            }}
          />
        </div>
      ))}

      {/* Center Sterile Handle (Poignée centrale stérile) */}
      <div className="absolute w-[12px] h-[12px] rounded-full border-[2px] border-[#020408] bg-[#334155] shadow-[0_4px_8px_rgba(0,0,0,0.8)] flex items-center justify-center z-10 transition-transform group-hover:scale-110">
        {/* Standby indicator LED (Small green dot when OFF) */}
        <motion.div 
          className="w-[3px] h-[3px] rounded-full"
          animate={{
            backgroundColor: isDark ? '#10b981' : '#1e293b',
            boxShadow: isDark ? '0 0 4px #10b981, 0 0 8px rgba(16,185,129,0.5)' : 'none'
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Main Blinding Flare (Glows OUTSIDE the button bounds when ON) */}
      <motion.div
        className="absolute inset-[-14px] z-20 pointer-events-none"
        initial={false}
        animate={{ 
          background: isDark 
            ? 'radial-gradient(circle at center, rgba(255,255,255,0) 0%, transparent 100%)'
            : 'radial-gradient(circle at center, rgba(255,255,255,0.95) 15%, rgba(255,248,180,0.45) 45%, transparent 70%)',
          opacity: isDark ? 0 : 1,
          scale: isDark ? 0.8 : 1
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      
      {/* Front glass lens reflection */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)] pointer-events-none z-30" />
    </button>
  )
}
