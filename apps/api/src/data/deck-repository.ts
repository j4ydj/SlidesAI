import type { ConversationMessage, DeckRecord } from '@slidesai/domain'

import { prisma } from './prisma'

type DeckSectionRecord = {
  id: string
  title: string
  status: string
  slideCount: number
  order: number
}

type DeckRow = {
  id: string
  title: string
  owner: string
  status: string
  dueAt: Date
  objective: string
  audience: string
  tone: string
  brandKitId: string | null
  sections: DeckSectionRecord[]
}

function mapDeck(record: DeckRow) {
  return {
    id: record.id,
    title: record.title,
    owner: record.owner,
    status: record.status as DeckRecord['status'],
    dueAt: record.dueAt.toISOString(),
    outline: record.sections
      .sort((a, b) => a.order - b.order)
      .map((section) => ({
        id: section.id,
        title: section.title,
        status: section.status as DeckRecord['outline'][number]['status'],
        slideCount: section.slideCount,
      })),
    meta: {
      objective: record.objective,
      audience: record.audience,
      tone: record.tone,
      brandKitId: record.brandKitId,
    },
  } satisfies DeckRecord
}

export async function listDecks() {
  const records = (await prisma.deck.findMany({
    include: { sections: true },
    orderBy: { updatedAt: 'desc' },
  })) as DeckRow[]

  return records.map(mapDeck)
}

export async function getDeck(id: string) {
  const record = (await prisma.deck.findUnique({
    where: { id },
    include: { sections: true },
  })) as DeckRow | null

  if (!record) {
    return null
  }

  return mapDeck(record)
}

export async function createDeck(input: {
  id: string
  title: string
  owner: string
  objective: string
  audience: string
  tone: string
  brandKitId?: string | null
}) {
  await prisma.deck.create({
    data: {
      id: input.id,
      title: input.title,
      owner: input.owner,
      status: 'intake_complete',
      dueAt: new Date(),
      objective: input.objective,
      audience: input.audience,
      tone: input.tone,
      brandKitId: input.brandKitId ?? null,
    },
  })

  return getDeck(input.id)
}

export async function listConversationMessages(deckId: string) {
  const messages = (await prisma.conversationMessage.findMany({
    where: { deckId },
    orderBy: { createdAt: 'asc' },
  })) as Array<{
    id: string
    role: string
    strategy: string | null
    content: string
    createdAt: Date
  }>

  return messages.map(
    (message) =>
      ({
        id: message.id,
        role: message.role as ConversationMessage['role'],
        strategy: message.strategy ?? undefined,
        content: message.content,
        timestamp: message.createdAt.toISOString(),
      }) satisfies ConversationMessage,
  )
}

export async function appendConversation(deckId: string, entries: ConversationMessage[]) {
  await prisma.conversationMessage.createMany({
    data: entries.map((entry) => ({
      id: entry.id,
      deckId,
      role: entry.role,
      strategy: entry.strategy ?? null,
      content: entry.content,
      createdAt: new Date(entry.timestamp),
    })),
  })

  return listConversationMessages(deckId)
}

