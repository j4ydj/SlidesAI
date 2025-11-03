import Link from 'next/link'
import { Button } from '@/components/ui/button'

const trustLogos = ['Google', 'Salesforce', 'IKEA', 'Stanford', 'Honeywell', 'Cornell']

const featureHighlights = [
  {
    title: 'Conversational copilot',
    body: 'Collaborate with an AI producer that explains every decision, proposes alternatives, and adapts tone instantly.',
  },
  {
    title: 'Brand-perfect by default',
    body: 'Upload kits once—SlidesAI enforces colors, typography, compliance rules, and logo usage automatically.',
  },
  {
    title: 'Data to deck in minutes',
    body: 'Ingest briefs, spreadsheets, or URLs. We summarize, storyboard, and draft ready-to-edit slides without copy-paste.',
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,110,245,0.25),_transparent_55%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-24 px-6 pb-24 pt-24">
        <header className="flex flex-col gap-8 text-center sm:text-left">
          <span className="mx-auto sm:mx-0 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">
            SlidesAI deck copilot
          </span>
          <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
            From raw content to board-ready slides in a single collaborative flow.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300 sm:text-xl">
            Give the AI what you have—reports, notes, or existing decks. Co-create structure, iterate on messaging, and export brand-perfect slides without ever touching a template.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/create">Start a new deck</Link>
            </Button>
            <Button variant="secondary" asChild className="w-full sm:w-auto">
              <Link href="/dashboard">Browse workspace</Link>
            </Button>
            <p className="text-xs text-slate-400 sm:ml-4">
              15-minute average from intake to export • SOC2-ready infrastructure
            </p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:grid-cols-3">
          {featureHighlights.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-slate-300">{feature.body}</p>
            </div>
          ))}
        </section>

        <section className="glass-panel p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Trusted by teams shipping faster</p>
          <div className="mt-6 grid grid-cols-2 gap-6 text-sm font-medium text-slate-300 sm:grid-cols-6">
            {trustLogos.map((brand) => (
              <div
                key={brand}
                className="flex h-14 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-center"
              >
                {brand}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
