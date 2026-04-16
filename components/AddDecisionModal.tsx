'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Zap, Loader2, AlertCircle } from 'lucide-react'

const EVENT_TYPES = [
  { value: 'DECISION', label: 'Décision technique' },
  { value: 'INCIDENT', label: 'Incident' },
  { value: 'DEPLOY', label: 'Deploy' },
]

interface Props {
  projectId: string
}

export default function AddDecisionModal({ projectId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    type: 'DECISION',
    title: '',
    description: '',
    url: '',
    author: '',
  })

  function close() {
    setOpen(false)
    setError('')
    setForm({ type: 'DECISION', title: '', description: '', url: '', author: '' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projectId }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Erreur')
      }
      close()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-[#111111] border border-[#2a2a2a] text-[#8a8a8a] hover:border-[#3a3a3a] hover:text-[#f4f4f4] transition-all"
      >
        <Plus size={14} />
        Ajouter
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal */}
          <div className="relative bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-purple-400" />
                <h2 className="font-semibold text-[#f4f4f4] text-sm">Ajouter un événement</h2>
              </div>
              <button
                onClick={close}
                className="p-1.5 text-[#8a8a8a] hover:text-[#f4f4f4] hover:bg-[#1e1e1e] rounded-lg transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-[#c4c4c4] mb-1.5">Type</label>
                <div className="flex gap-2 flex-wrap">
                  {EVENT_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, type: value })}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        form.type === value
                          ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                          : 'bg-[#161616] border-[#2a2a2a] text-[#8a8a8a] hover:border-[#3a3a3a]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-[#c4c4c4] mb-1.5">
                  Titre <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Choix de PostgreSQL plutôt que MongoDB"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full bg-[#161616] border border-[#2a2a2a] focus:border-indigo-500 rounded-lg px-3 py-2 text-[#f4f4f4] placeholder-[#555] text-sm outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-[#c4c4c4] mb-1.5">
                  Contexte & justification
                </label>
                <textarea
                  placeholder="Pourquoi cette décision a été prise, le contexte, les alternatives considérées..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#161616] border border-[#2a2a2a] focus:border-indigo-500 rounded-lg px-3 py-2 text-[#f4f4f4] placeholder-[#555] text-sm outline-none transition-colors resize-none"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-medium text-[#c4c4c4] mb-1.5">Auteur</label>
                <input
                  type="text"
                  placeholder="username"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full bg-[#161616] border border-[#2a2a2a] focus:border-indigo-500 rounded-lg px-3 py-2 text-[#f4f4f4] placeholder-[#555] text-sm outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 text-xs text-red-400">
                  <AlertCircle size={13} />
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {loading && <Loader2 size={13} className="animate-spin" />}
                  Ajouter
                </button>
                <button type="button" onClick={close} className="text-sm text-[#8a8a8a] hover:text-[#f4f4f4] transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
