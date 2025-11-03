'use client'

import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'

const steps = [
  {
    id: 'context',
    title: 'Context & goal',
    description: 'Summarize the presentation objective so the copilot can plan the story arc.',
    fields: [
      {
        id: 'topic',
        label: 'Working title',
        placeholder: 'Q4 business review for enterprise leadership',
      },
      {
        id: 'objective',
        label: 'Primary business outcome',
        placeholder: 'Align the executive team on FY26 priorities and highlight top wins.',
      },
    ],
  },
  {
    id: 'audience',
    title: 'Audience & tone',
    description: 'Set expectations for voice, stakes, and the level of detail required.',
    fields: [
      {
        id: 'audience',
        label: 'Who is reviewing this deck?',
        placeholder: 'CEO, CFO, functional VP leaders',
      },
      {
        id: 'tone',
        label: 'Preferred tone or messaging guidance',
        placeholder: 'Confident and data-backed with an optimistic but grounded perspective.',
      },
    ],
  },
  {
    id: 'inputs',
    title: 'Inputs & assets',
    description: 'Tell us what existing content we should ingest before planning the outline.',
    fields: [
      {
        id: 'sources',
        label: 'Source links or files',
        placeholder: 'Paste URLs or summarize folder contents you’ll upload.',
      },
      {
        id: 'highlights',
        label: 'Key metrics or headlines to emphasize',
        placeholder: 'Revenue +28% YoY, customer satisfaction record high, supply chain stabilized.',
      },
    ],
  },
  {
    id: 'brand',
    title: 'Brand & guardrails',
    description: 'Choose a brand kit or let the copilot suggest a draft style.',
    fields: [
      {
        id: 'brand-kit',
        label: 'Brand kit',
        placeholder: 'Northwind Enterprises · Corporate',
      },
      {
        id: 'constraints',
        label: 'Compliance or messaging constraints',
        placeholder: 'No external roadmap references; avoid discussing unreleased SKUs.',
      },
    ],
  },
]

export function IntakeWizard() {
  const [stepIndex, setStepIndex] = useState(0)

  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex])

  return (
    <div className="glass-panel px-8 py-10">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Intake</p>
          <h2 className="text-3xl font-semibold text-white">
            {steps[stepIndex].title}
          </h2>
          <p className="mt-2 text-sm text-slate-300">{steps[stepIndex].description}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-[color:var(--accent)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-300">{progress}%</span>
        </div>

        <div className="grid gap-5">
          {steps[stepIndex].fields.map((field) => (
            <div key={field.id} className="grid gap-2">
              <label className="text-sm font-medium text-slate-200" htmlFor={field.id}>
                {field.label}
              </label>
              <textarea
                id={field.id}
                rows={3}
                placeholder={field.placeholder}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/40"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                aria-label={`Go to ${step.title}`}
                onClick={() => setStepIndex(index)}
                className={clsx(
                  'h-2 w-10 rounded-full transition-all',
                  index <= stepIndex ? 'bg-[color:var(--accent)]' : 'bg-white/10',
                )}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            >
              Back
            </Button>
            {stepIndex === steps.length - 1 ? (
              <Button size="sm">Continue to conversation</Button>
            ) : (
              <Button size="sm" onClick={() => setStepIndex((current) => Math.min(steps.length - 1, current + 1))}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
