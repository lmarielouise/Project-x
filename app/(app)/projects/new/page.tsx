'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, GitBranch, Key, Loader2, AlertCircle } from 'lucide-react'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    githubRepo: '',
    githubToken: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Erreur lors de la création')
      }
      const project = await res.json()

      // Auto-sync after creation
      await fetch(`/api/projects/${project.id}/sync`, { method: 'POST' })

      router.push(`/projects/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-[#8a8a8a] hover:text-[#f4f4f4] text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={14} />
        Retour aux projets
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#f4f4f4]">Nouveau projet</h1>
        <p className="text-[#8a8a8a] text-sm mt-1">
          Connectez un repo GitHub pour créer la timeline de votre projet.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project name */}
        <div>
          <label className="block text-sm font-medium text-[#c4c4c4] mb-1.5">
            Nom du projet <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Mon super projet"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-indigo-500 rounded-lg px-3 py-2.5 text-[#f4f4f4] placeholder-[#8a8a8a] text-sm outline-none transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#c4c4c4] mb-1.5">
            Description <span className="text-[#8a8a8a] font-normal">(optionnel)</span>
          </label>
          <textarea
            placeholder="Une courte description du projet..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-indigo-500 rounded-lg px-3 py-2.5 text-[#f4f4f4] placeholder-[#8a8a8a] text-sm outline-none transition-colors resize-none"
          />
        </div>

        {/* GitHub repo */}
        <div>
          <label className="block text-sm font-medium text-[#c4c4c4] mb-1.5">
            <span className="flex items-center gap-1.5">
              <GitBranch size={13} />
              Repo GitHub <span className="text-red-400">*</span>
            </span>
          </label>
          <input
            type="text"
            placeholder="owner/repository"
            value={form.githubRepo}
            onChange={(e) => setForm({ ...form, githubRepo: e.target.value })}
            required
            pattern="[a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+"
            className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-indigo-500 rounded-lg px-3 py-2.5 text-[#f4f4f4] placeholder-[#8a8a8a] text-sm outline-none transition-colors font-mono"
          />
          <p className="text-[#8a8a8a] text-xs mt-1">Format : owner/repository (ex: vercel/next.js)</p>
        </div>

        {/* GitHub token */}
        <div>
          <label className="block text-sm font-medium text-[#c4c4c4] mb-1.5">
            <span className="flex items-center gap-1.5">
              <Key size={13} />
              Token GitHub <span className="text-[#8a8a8a] font-normal">(optionnel pour les repos publics)</span>
            </span>
          </label>
          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={form.githubToken}
            onChange={(e) => setForm({ ...form, githubToken: e.target.value })}
            className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-indigo-500 rounded-lg px-3 py-2.5 text-[#f4f4f4] placeholder-[#8a8a8a] text-sm outline-none transition-colors font-mono"
          />
          <p className="text-[#8a8a8a] text-xs mt-1">
            Personal Access Token avec scope <code className="text-indigo-400 bg-indigo-400/10 px-1 rounded">repo</code>.
            Nécessaire pour les repos privés.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2.5 text-sm text-red-400">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Création & synchronisation...' : 'Créer et synchroniser'}
          </button>
          <Link
            href="/projects"
            className="text-sm text-[#8a8a8a] hover:text-[#f4f4f4] transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
