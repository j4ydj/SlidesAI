import { randomUUID } from 'node:crypto'

import type { ConversationMessage } from '@slidesai/domain'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { appendConversation, getDeck, listConversationMessages } from '../data/deck-repository'
import { generateAssistantReply } from '../services/orchestrator'

const deckParamsSchema = z.object({ deckId: z.string() })

const messageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  strategy: z.string().optional(),
  timestamp: z.string(),
})

export async function registerConversationRoutes(app: FastifyInstance) {
  app.get('/:deckId/messages', async (request) => {
    const { deckId } = deckParamsSchema.parse(request.params)

    const transcript = await listConversationMessages(deckId)
    return { data: transcript }
  })

  app.post('/:deckId/messages', async (request, reply) => {
    const { deckId } = deckParamsSchema.parse(request.params)
    const { message } = z.object({ message: z.string().min(1) }).parse(request.body)

    const deck = await getDeck(deckId)
    if (!deck) {
      return reply.notFound('Deck not found')
    }

    const transcript = await listConversationMessages(deckId)

    const userMessage: ConversationMessage = {
      id: randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    }

    const assistantMessage = await generateAssistantReply({
      deckTitle: deck.title,
      deckObjective: deck.meta.objective,
      latestUserMessage: userMessage.content,
      transcript: [...transcript, userMessage],
    })

    const savedMessages = await appendConversation(deckId, [userMessage, assistantMessage])

    return reply.code(201).send({ data: savedMessages.slice(-2) })
  })

  app.get('/schema/message', async () => {
    return { schema: messageSchema.shape }
  })
}
