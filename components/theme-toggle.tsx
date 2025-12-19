'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Éviter l'hydratation mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant='outline'
        size='icon'
        className='relative h-9 w-9 rounded-full border-border/50 hover:border-primary/50 transition-all duration-300'
      >
        <Sun className='h-4 w-4' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className='relative h-9 w-9 rounded-full border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden group hover:scale-105 active:scale-95'
      aria-label={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icons with smooth transition */}
      <div className="relative w-4 h-4">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Sun className='h-4 w-4 text-orange-500 drop-shadow-lg' />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Moon className='h-4 w-4 text-blue-600 drop-shadow-lg' />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
