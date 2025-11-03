'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { AppWindow, BarChart3, Home, Layers, Settings } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '../ui/button'

const sidebarLinks = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/create', label: 'New deck', icon: Layers },
  { href: '/studio/demo', label: 'Conversation studio', icon: AppWindow },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface AppShellProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export function AppShell({ title, subtitle, actions, children }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[color:var(--background)] grid-background">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col gap-8 px-6 py-8 border-r border-[color:var(--border)] bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[color:var(--accent)]/20 flex items-center justify-center text-[color:var(--accent)] font-semibold">
              SA
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">SlidesAI</p>
              <p className="text-base font-semibold text-slate-100">Deck Copilot</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/10',
                    isActive ? 'bg-white/15 text-white shadow-inner shadow-indigo-500/10' : 'text-slate-300',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-slate-200">Brand kits</p>
            <p className="text-xs text-slate-400 mt-1">Upload typography, logos, and tone guidance once.</p>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Manage kits
            </Button>
          </div>
        </aside>
        <main className="flex-1 px-6 py-10">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
            <div>
              {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
              {title && <h1 className="text-4xl font-semibold text-slate-100">{title}</h1>}
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
                JD
              </div>
            </div>
          </header>
          <div className="space-y-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
