'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { useEffect } from 'react'

export default function AdminDashboardStudioPage() {
    useEffect(() => {
        // Intercepter l'erreur de vérification de version de Sanity pour éviter l'overlay Next.js
        const originalError = console.error;
        console.error = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('Failed to fetch version for package')) {
                return; // Ignorer cette erreur inoffensive
            }
            originalError.apply(console, args);
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            if (event.reason && event.reason.message === 'Failed to fetch' && event.reason.stack?.includes('sanity')) {
                event.preventDefault(); // Empêcher l'overlay Next.js
            }
        };
        
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        
        return () => {
            console.error = originalError;
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return <NextStudio config={config} />
}
