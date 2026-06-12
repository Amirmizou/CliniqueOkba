'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  
  const [activeLocale, setActiveLocale] = React.useState(locale)

  React.useEffect(() => {
    setActiveLocale(locale)
  }, [locale])

  const getLocalizedPath = (targetLocale: string) => {
    if (!pathname) return targetLocale === 'fr' ? '/' : `/${targetLocale}`;
    
    const segments = pathname.split('/');
    const currentPrefix = segments[1];
    const hasLocalePrefix = currentPrefix === 'fr' || currentPrefix === 'ar';

    if (hasLocalePrefix) {
      if (targetLocale === 'fr') {
        segments.splice(1, 1);
        return segments.join('/') || '/';
      } else {
        segments[1] = targetLocale;
        return segments.join('/');
      }
    } else {
      if (targetLocale === 'fr') {
        return pathname;
      } else {
        return `/${targetLocale}${pathname === '/' ? '' : pathname}`;
      }
    }
  }

  const playScannerBeep = (isArTarget: boolean) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Deux fréquences différentes selon la langue (bip aigu vs bip plus grave)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isArTarget ? 1200 : 880, ctx.currentTime);
      
      // Enveloppe de volume courte et sèche (faible volume pour ne pas gêner)
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Ignorer silencieusement si l'audio n'est pas supporté ou bloqué par le navigateur
    }
  }

  const toggleLanguage = () => {
    const nextLocale = activeLocale === 'fr' ? 'ar' : 'fr'
    setActiveLocale(nextLocale)
    playScannerBeep(nextLocale === 'ar')
    router.replace(getLocalizedPath(nextLocale), { scroll: false })
  }

  const isAr = activeLocale === 'ar'

  // Easing scanner smooth
  const SCAN_EASE = [0.4, 0, 0.2, 1]
  const SCAN_DURATION = 0.65

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className="relative flex items-center justify-center w-[84px] h-[36px] rounded-full bg-secondary/30 border border-border shadow-inner overflow-hidden cursor-pointer group hover:bg-secondary/40 transition-colors touch-target"
      aria-label="Toggle language scanner"
    >
      {/* BASE LAYER: FR Active / AR Inactive */}
      <div className="absolute inset-0 flex justify-between items-center px-[14px]">
        <span className="font-sans text-[13px] font-bold text-primary drop-shadow-[0_0_8px_var(--primary)]">
          FR
        </span>
        <span className="font-sans text-[16px] font-bold pb-0.5 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/60">
          ع
        </span>
      </div>

      {/* TOP LAYER: FR Inactive / AR Active (Revealed by clip-path wipe) */}
      <motion.div
        className="absolute inset-0 flex justify-between items-center px-[14px] bg-secondary/10 backdrop-blur-[1px]"
        initial={false}
        animate={{ clipPath: isAr ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
        transition={{ duration: SCAN_DURATION, ease: SCAN_EASE }}
      >
        <span className="font-sans text-[13px] font-bold text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/60">
          FR
        </span>
        <span className="font-sans text-[16px] font-bold pb-0.5 text-primary drop-shadow-[0_0_8px_var(--primary)]">
          ع
        </span>
      </motion.div>

      {/* THE SCANNER BEAM */}
      <motion.div
        className="absolute top-0 bottom-0 z-20 flex items-center justify-center pointer-events-none"
        initial={false}
        animate={{ left: isAr ? '100%' : '0%' }}
        transition={{ duration: SCAN_DURATION, ease: SCAN_EASE }}
        style={{ x: "-50%" }}
      >
        {/* Core beam line */}
        <div className="w-[2px] h-[100%] bg-primary/80 shadow-[0_0_10px_var(--primary)]" />
        
        {/* The rotating scanner circle (◉) */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full border-[2px] border-dashed border-primary shadow-[0_0_8px_var(--primary)] flex items-center justify-center"
          initial={false}
          animate={{ rotate: isAr ? 360 : 0 }}
          transition={{ duration: SCAN_DURATION, ease: SCAN_EASE }}
        >
           {/* Inner dot */}
           <div className="w-[4px] h-[4px] bg-white rounded-full shadow-[0_0_5px_#fff]" />
        </motion.div>
      </motion.div>
    </button>
  )
}
