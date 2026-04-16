import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevMemory',
  description: 'La mémoire vivante de vos projets — timeline unifiée, décisions, GitHub.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#0a0a0a] text-[#f4f4f4] antialiased">{children}</body>
    </html>
  )
}
