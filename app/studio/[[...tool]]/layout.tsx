export const metadata = {
    title: 'Sanity Studio - Clinique OKBA',
    description: 'Gestion du contenu de la Clinique OKBA',
}

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    )
}
