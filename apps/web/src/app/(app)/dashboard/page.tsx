import Link from 'next/link'

import { deckFixtures, type DeckRecord } from '@slidesai/domain'

import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { fetchDecks } from '@/lib/data'

const spotlight = [
  {
    title: 'Reusable frameworks',
    description: 'Save conversation-approved structures and deploy them across client work in one click.',
  },
  {
    title: 'Analytics baseline',
    description: 'Measure time saved and slide edits to showcase ROI to leadership or clients.',
  },
]

const workflows = ['Quarterly business review', 'Client renewal pitch', 'Campaign performance recap']

async function loadDecks(): Promise<DeckRecord[]> {
  try {
    return await fetchDecks()
  } catch (error) {
    console.error('Failed to load decks from API, falling back to fixtures', error)
    return deckFixtures
  }
}

export default async function DashboardPage() {
  const decks = await loadDecks()
  const inFlightDecks = decks.slice(0, 3)
  const metrics = [
    {
      title: 'Decks generated this week',
      value: String(decks.length),
      delta: '+64%',
    },
    {
      title: 'Average turnaround',
      value: '12m 42s',
      delta: '-38%',
    },
    {
      title: 'Brand compliance score',
      value: '97%',
      delta: '+5%',
    },
  ]

  return (
    <AppShell
      title="Workspace overview"
      subtitle={new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      actions={
        <div className="flex gap-3">
          <Button variant="secondary" asChild>
            <Link href="/create">New from template</Link>
          </Button>
          <Button asChild>
            <Link href="/create">Start deck</Link>
          </Button>
        </div>
      }
    >
      <section className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.title} className="glass-panel p-6">
            <p className="text-sm text-slate-400">{metric.title}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
            <p className="mt-2 text-xs text-emerald-400">{metric.delta} vs. last week</p>
          </div>
        ))}
      </section>

      <section className="glass-panel p-6">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-xl text-white">In-flight decks</h2>
            <p className="text-sm text-slate-400">Track conversation progress and export readiness.</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/reports">View all</Link>
          </Button>
        </header>
        <div className="mt-6 divide-y divide-white/10">
          {inFlightDecks.map((deck) => (
            <div key={deck.id} className="grid gap-4 py-4 sm:grid-cols-[1.5fr_.8fr_.8fr_.5fr] sm:items-center">
              <div>
                <p className="text-base font-medium text-white">{deck.title}</p>
                <p className="text-sm text-slate-400">Owner · {deck.owner}</p>
              </div>
              <p className="text-sm text-slate-300">
                {new Date(deck.dueAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
              <p className="text-sm text-indigo-300">{deck.status.replace('_', ' ')}</p>
              <div className="flex justify-end">
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/studio/${deck.id}`}>Open</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-6">
          <h2 className="text-xl text-white">Quick start</h2>
          <p className="text-sm text-slate-400">Launch common workflows tailored to your workspace.</p>
          <div className="mt-6 grid gap-4">
            {workflows.map((workflow) => (
              <button
                key={workflow}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/20"
              >
                {workflow}
                <span className="text-xs text-slate-400">Launch →</span>
              </button>
            ))}
          </div>
        </div>
        <div className="glass-panel p-6">
          <h2 className="text-xl text-white">What’s new</h2>
          <ul className="mt-6 space-y-4">
            {spotlight.map((item) => (
              <li key={item.title}>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-sm text-slate-400">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  )
}
