'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  projectId: string
}

export default function SyncButton({ projectId }: Props) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSync() {
    setState('loading')
    setMessage('')
    try {
      const res = await fetch(`/api/projects/${projectId}/sync`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Sync failed')
      setMessage(`${data.synced} nouveaux événements`)
      setState('success')
      router.refresh()
      setTimeout(() => setState('idle'), 3000)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erreur')
      setState('error')
      setTimeout(() => setState('idle'), 4000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {message && (
        <span
          className={cn(
            'text-xs px-2 py-1 rounded-md',
            state === 'success' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
          )}
        >
          {message}
        </span>
      )}
      <button
        onClick={handleSync}
        disabled={state === 'loading'}
        className={cn(
          'flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border transition-all',
          state === 'loading'
            ? 'bg-[#161616] border-[#2a2a2a] text-[#8a8a8a] cursor-not-allowed'
            : state === 'success'
            ? 'bg-green-400/10 border-green-400/30 text-green-400'
            : state === 'error'
            ? 'bg-red-400/10 border-red-400/30 text-red-400'
            : 'bg-[#111111] border-[#2a2a2a] text-[#8a8a8a] hover:border-[#3a3a3a] hover:text-[#f4f4f4]'
        )}
      >
        {state === 'success' ? (
          <CheckCircle2 size={14} />
        ) : state === 'error' ? (
          <AlertCircle size={14} />
        ) : (
          <RefreshCw size={14} className={cn(state === 'loading' && 'animate-spin')} />
        )}
        Sync GitHub
      </button>
    </div>
  )
}
