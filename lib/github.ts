export type GitHubEvent = {
  externalId: string
  type: string
  title: string
  description?: string
  url?: string
  author?: string
  avatarUrl?: string
  happenedAt: Date
  metadata?: Record<string, unknown>
}

async function ghFetch(path: string, token?: string | null) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`https://api.github.com${path}`, {
    headers,
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`)
  return res.json()
}

export async function fetchGitHubEvents(
  repo: string,
  token?: string | null
): Promise<GitHubEvent[]> {
  const events: GitHubEvent[] = []

  await Promise.allSettled([
    // Commits
    ghFetch(`/repos/${repo}/commits?per_page=100`, token).then((commits) => {
      for (const c of commits) {
        events.push({
          externalId: `commit_${c.sha}`,
          type: 'COMMIT',
          title: c.commit.message.split('\n')[0].substring(0, 120),
          description: c.commit.message.split('\n').slice(2).join('\n').trim() || undefined,
          url: c.html_url,
          author: c.author?.login ?? c.commit.author.name,
          avatarUrl: c.author?.avatar_url,
          happenedAt: new Date(c.commit.author.date),
          metadata: { sha: c.sha.substring(0, 7) },
        })
      }
    }),

    // Pull requests
    ghFetch(`/repos/${repo}/pulls?state=all&per_page=100&sort=updated`, token).then((pulls) => {
      for (const pr of pulls) {
        const type = pr.merged_at ? 'PR_MERGED' : pr.state === 'closed' ? 'PR_CLOSED' : 'PR_OPENED'
        events.push({
          externalId: `pr_${pr.id}_${type}`,
          type,
          title: `${pr.title} (#${pr.number})`,
          description: pr.body?.substring(0, 500) || undefined,
          url: pr.html_url,
          author: pr.user?.login,
          avatarUrl: pr.user?.avatar_url,
          happenedAt: new Date(pr.merged_at ?? pr.closed_at ?? pr.created_at),
          metadata: { number: pr.number },
        })
      }
    }),

    // Issues (excluding PRs)
    ghFetch(`/repos/${repo}/issues?state=all&per_page=100&sort=updated`, token).then((issues) => {
      for (const issue of issues) {
        if (issue.pull_request) continue
        const type = issue.state === 'closed' ? 'ISSUE_CLOSED' : 'ISSUE_OPENED'
        events.push({
          externalId: `issue_${issue.id}_${type}`,
          type,
          title: `${issue.title} (#${issue.number})`,
          description: issue.body?.substring(0, 500) || undefined,
          url: issue.html_url,
          author: issue.user?.login,
          avatarUrl: issue.user?.avatar_url,
          happenedAt: new Date(issue.closed_at ?? issue.created_at),
          metadata: {
            number: issue.number,
            labels: issue.labels?.map((l: { name: string }) => l.name) ?? [],
          },
        })
      }
    }),

    // Releases
    ghFetch(`/repos/${repo}/releases?per_page=50`, token).then((releases) => {
      for (const r of releases) {
        events.push({
          externalId: `release_${r.id}`,
          type: 'RELEASE',
          title: `Release ${r.tag_name}${r.name ? ` — ${r.name}` : ''}`,
          description: r.body?.substring(0, 500) || undefined,
          url: r.html_url,
          author: r.author?.login,
          avatarUrl: r.author?.avatar_url,
          happenedAt: new Date(r.published_at ?? r.created_at),
          metadata: { tag: r.tag_name, prerelease: r.prerelease },
        })
      }
    }),
  ])

  return events.sort((a, b) => b.happenedAt.getTime() - a.happenedAt.getTime())
}

export async function validateGitHubRepo(repo: string, token?: string | null) {
  const data = await ghFetch(`/repos/${repo}`, token)
  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    language: data.language,
  }
}
