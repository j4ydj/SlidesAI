import Link from 'next/link'

import { brandKitFixtures, type BrandKit } from '@slidesai/domain'

import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { IntakeWizard } from '@/components/wizard/intake-wizard'
import { fetchBrandKits } from '@/lib/data'

const guidance = [
  {
    title: 'Upload anything',
    body: 'Drop docs, spreadsheets, transcripts, or connect Google Drive. We extract structure and insights automatically.',
  },
  {
    title: 'Conversation-ready',
    body: 'Every intake answer becomes part of the shared memory the copilot references in chat.',
  },
  {
    title: 'Brand controls',
    body: 'Pick an existing brand kit or let the copilot propose a visual exploration before you lock it in.',
  },
]

async function loadBrandKits(): Promise<BrandKit[]> {
  try {
    return await fetchBrandKits()
  } catch (error) {
    console.error('Failed to load brand kits from API, falling back to fixtures', error)
    return brandKitFixtures
  }
}

export default async function CreatePage() {
  const brandKits = await loadBrandKits()

  return (
    <AppShell
      title="Brief the copilot"
      subtitle="Tell SlidesAI what we’re building and how to show up."
      actions={
        <Button variant="secondary" asChild>
          <Link href="/dashboard">Cancel</Link>
        </Button>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <IntakeWizard />
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold text-white">Copilot tips</h2>
            <ul className="mt-4 space-y-4 text-sm text-slate-300">
              {guidance.map((item) => (
                <li key={item.title}>
                  <p className="font-medium text-slate-100">{item.title}</p>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold text-white">Brand kits</h2>
            <p className="mt-1 text-sm text-slate-400">Your selections inform tone, colors, logos, and compliance checks.</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {brandKits.slice(0, 3).map((kit) => (
                <div key={kit.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-sm font-medium text-white">{kit.name}</p>
                  <p className="text-xs text-slate-400">
                    Primary {kit.primaryColor} · Tone keywords {kit.tone.keywords.join(', ')}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full">
              Manage brand kits
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
