import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={20} className="text-[#8a8a8a]" />
        <h1 className="text-2xl font-semibold text-[#f4f4f4]">Paramètres</h1>
      </div>

      <div className="space-y-6">
        <section className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
          <h2 className="font-medium text-[#f4f4f4] mb-1">À propos de DevMemory</h2>
          <p className="text-[#8a8a8a] text-sm leading-relaxed">
            DevMemory est la mémoire vivante de vos projets. Il connecte vos repos GitHub pour
            créer une timeline unifiée de tout ce qui se passe — commits, PRs, issues, releases — et
            vous permet d&apos;y ajouter vos propres décisions techniques pour conserver le contexte
            dans le temps.
          </p>
        </section>

        <section className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
          <h2 className="font-medium text-[#f4f4f4] mb-3">Intégrations disponibles</h2>
          <div className="space-y-3">
            {[
              { name: 'GitHub', desc: 'Commits, PRs, Issues, Releases', status: 'Disponible' },
              { name: 'Jira', desc: 'Tickets, Sprints, Epics', status: 'Bientôt' },
              { name: 'Linear', desc: 'Issues, Cycles, Projects', status: 'Bientôt' },
              { name: 'Slack', desc: 'Messages, Décisions, Alertes', status: 'Bientôt' },
              { name: 'PagerDuty', desc: 'Incidents, Alertes', status: 'Bientôt' },
            ].map(({ name, desc, status }) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-[#1e1e1e] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#f4f4f4]">{name}</p>
                  <p className="text-xs text-[#8a8a8a]">{desc}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    status === 'Disponible'
                      ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                      : 'bg-[#1a1a1a] text-[#555] border border-[#2a2a2a]'
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
