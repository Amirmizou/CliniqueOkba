'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Simple hardcoded password for demonstration
        if (password === 'admin123') {
            // Set a cookie or local storage to maintain session (simplified)
            localStorage.setItem('admin_auth', 'true')
            router.push('/admin/dashboard')
        } else {
            setError('Mot de passe incorrect')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        <Lock className="h-6 w-6 text-primary" />
                        Administration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </div>
                        <Button type="submit" className="w-full">
                            Se connecter
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
