'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderGit2, Settings, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/projects', label: 'Projets', icon: FolderGit2 },
  { href: '/settings', label: 'Paramètres', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 h-screen bg-[#0d0d0d] border-r border-[#1e1e1e] flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Layers size={14} className="text-white" />
          </div>
          <span className="font-semibold text-[#f4f4f4] text-sm">DevMemory</span>
        </div>
        <p className="text-[#666] text-xs mt-1.5 leading-snug">La mémoire de vos projets</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-indigo-600/15 text-indigo-400 font-medium'
                  : 'text-[#8a8a8a] hover:text-[#f4f4f4] hover:bg-[#161616]'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1e1e1e]">
        <p className="text-[#555] text-xs">v0.1.0</p>
      </div>
    </aside>
  )
}
