'use client'

import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'

export default function Error({ 
  error, 
  reset 
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-center bg-background text-center'>
      <div className='space-y-8'>
        <div className='space-y-4'>
          <h1 className='text-6xl font-bold text-destructive'>Oups !</h1>
          <p className='text-2xl font-semibold text-foreground'>Une erreur est survenue</p>
          <p className='text-muted-foreground mx-auto max-w-md'>
            Quelque chose s'est mal passé sur nos serveurs. Veuillez réessayer.
          </p>
        </div>
        <Button onClick={() => reset()} className='flex items-center gap-2'>
          <RotateCw className='h-4 w-4' />
          Réessayer
        </Button>
      </div>
    </div>
  )
}
