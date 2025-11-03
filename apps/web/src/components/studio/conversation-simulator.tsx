'use client'

import { FormEvent, useMemo, useState } from 'react'
import clsx from 'clsx'

import type { ConversationMessage, DeckOutlineSection } from '@slidesai/domain'

import { Button } from '@/components/ui/button'

interface ConversationSimulatorProps {
  transcript?: ConversationMessage[]
  outline?: DeckOutlineSection[]
}

const cannedReplies = [
  {
    strategy: 'Narrative arc update',
    content:
      'I recommend reframing {section} as "{hook}" so we can connect the metrics to executive priorities. Shall I draft the slide now?',
  },
  {
    strategy: 'Tone alignment',
    content:
      'Understood on the tone shift. I will soften the phrasing in {section} and add a closer with two direct asks.',
  },
  {
    strategy: 'Data request',
    content:
      'To complete the growth story, I need the updated {metric}. Upload or paste it here and I will refresh the visuals before export.',
  },
]

const fallbackTranscript: ConversationMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    strategy: 'Story outline',
    content:
      'Here is the suggested flow: 1) Executive summary, 2) FY24 performance, 3) Operational resiliency, 4) FY25 priorities. Let me know where to dive deeper.',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm2',
    role: 'user',
    content: 'Let\'s make "Operational resiliency" more about supply chain wins, not general ops updates.',
    timestamp: new Date().toISOString(),
  },
]

export function ConversationSimulator({ transcript, outline }: ConversationSimulatorProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>(transcript?.length ? transcript : fallbackTranscript)
  const [input, setInput] = useState('')
  const [replyIndex, setReplyIndex] = useState(0)

  const derivedOutline = useMemo<DeckOutlineSection[]>(
    () =>
      outline?.length
        ? outline
        : [
            { title: 'Executive summary', status: 'approved', id: 'sec-1', slideCount: 2 },
            { title: 'FY24 performance', status: 'needs_attention', id: 'sec-2', slideCount: 3 },
            { title: 'Supply chain stabilization', status: 'drafting', id: 'sec-3', slideCount: 2 },
            { title: 'FY25 priorities', status: 'planning', id: 'sec-4', slideCount: 3 },
          ],
    [outline],
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!input.trim()) return

    const reply = cannedReplies[replyIndex % cannedReplies.length]

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: input.trim(),
        timestamp: new Date().toISOString(),
      },
      {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        strategy: reply.strategy,
        content: reply.content
          .replace('{section}', 'the current section')
          .replace('{metric}', 'the KPI you need featured')
          .replace('{hook}', 'Strategic outlook'),
        timestamp: new Date().toISOString(),
      },
    ])
    setReplyIndex((prev) => prev + 1)
    setInput('')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="glass-panel flex h-[620px] flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Conversation</h2>
            <p className="text-sm text-slate-400">Work with the copilot to finalize outline and slides.</p>
          </div>
          <Button size="sm" variant="secondary">
            Expand outline
          </Button>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6 scrollbar-hidden">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx('max-w-[80%] rounded-3xl px-5 py-4 text-sm leading-relaxed', {
                'ml-auto bg-[color:var(--accent)]/20 text-slate-100': message.role === 'user',
                'bg-white/8 text-slate-200': message.role === 'assistant',
              })}
            >
              {message.strategy && (
                <p className="mb-2 text-[10px] uppercase tracking-[0.4em] text-indigo-300">{message.strategy}</p>
              )}
              <p>{message.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="border-t border-white/10 px-6 py-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={2}
              placeholder="Ask the copilot to refine tone, add visuals, or pivot the story."
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/40"
            />
            <Button type="submit" className="px-5">
              Send
            </Button>
          </div>
        </form>
      </section>
      <aside className="glass-panel flex h-[620px] flex-col overflow-hidden">
        <header className="border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Deck blueprint</h2>
          <p className="text-sm text-slate-400">Approve sections and monitor slide readiness.</p>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6 scrollbar-hidden">
          {derivedOutline.map((section) => (
            <div key={section.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{section.title}</p>
                <span
                  className={clsx(
                    'rounded-full px-3 py-1 text-[11px] uppercase tracking-wide',
                    section.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : section.status === 'needs_attention'
                      ? 'bg-amber-500/10 text-amber-300'
                      : section.status === 'drafting'
                      ? 'bg-indigo-500/10 text-indigo-200'
                      : 'bg-slate-500/10 text-slate-200',
                  )}
                >
                  {section.status.replace('_', ' ')}
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-400">{section.slideCount} slides</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                  Preview slides
                </Button>
                <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                  Ask for alt
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 px-6 py-4 text-sm text-slate-300">
          <p className="font-medium text-white">Export readiness</p>
          <div className="mt-3 h-2 w-full rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: '72%' }} />
          </div>
          <p className="mt-2 text-xs text-slate-400">6 of 8 slides approved • Tone score 93%</p>
        </div>
      </aside>
    </div>
  )
}
