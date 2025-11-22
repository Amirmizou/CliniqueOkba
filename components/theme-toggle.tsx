'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

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
      <Button variant='outline' size='icon' className='h-9 w-9'>
        <Sun className='h-4 w-4' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className='h-9 w-9 transition-all duration-300 hover:scale-105'
    >
      {theme === 'light' ? (
        <Moon className='h-4 w-4 transition-all duration-300' />
      ) : (
        <Sun className='h-4 w-4 transition-all duration-300' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}





