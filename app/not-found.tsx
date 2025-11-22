import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-center bg-background text-center'>
      <div className='space-y-8'>
        <div className='space-y-4'>
          <h1 className='text-8xl font-bold text-primary'>404</h1>
          <p className='text-3xl font-semibold text-foreground'>Page non trouvée</p>
          <p className='text-muted-foreground mx-auto max-w-md'>
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        <Button asChild>
          <Link href='/' className='flex items-center gap-2'>
            <Home className='h-4 w-4' />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  )
}
