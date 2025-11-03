import Link from 'next/link'
import { notFound } from 'next/navigation'

import { conversationFixtures, deckFixtures } from '@slidesai/domain'

import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { ConversationSimulator } from '@/components/studio/conversation-simulator'
import { fetchConversation, fetchDeck } from '@/lib/data'

interface PageProps {
  params: { id: string }
}

async function loadDeck(deckId: string) {
  try {
    return await fetchDeck(deckId)
  } catch (error) {
    console.error(`Failed to load deck ${deckId} from API, falling back to fixtures`, error)
    return deckFixtures.find((item) => item.id === deckId)
  }
}

async function loadConversation(deckId: string) {
  try {
    return await fetchConversation(deckId)
  } catch (error) {
    console.error(`Failed to load conversation ${deckId} from API, falling back to fixtures`, error)
    return conversationFixtures[deckId] ?? []
  }
}

export default async function ConversationPage({ params }: PageProps) {
  const deck = await loadDeck(params.id)
  if (!deck) {
    notFound()
  }

  const transcript = await loadConversation(deck.id)

  return (
    <AppShell
      title={deck.title}
      subtitle={`${deck.meta.audience} • ${deck.status.replace('_', ' ')}`}
      actions={
        <div className="flex gap-3">
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
          <Button>Export deck</Button>
        </div>
      }
    >
      <ConversationSimulator transcript={transcript} outline={deck.outline} />
    </AppShell>
  )
}
