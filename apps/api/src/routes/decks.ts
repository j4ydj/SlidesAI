import { randomUUID } from 'node:crypto'

import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { createDeck, getDeck, listDecks } from '../data/deck-repository'

const createDeckBodySchema = z.object({
  title: z.string().min(3),
  objective: z.string().min(5),
  audience: z.string().min(3),
  tone: z.string().optional(),
  brandKitId: z.string().optional(),
})

export async function registerDeckRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const data = await listDecks()
    return { data }
  })

  app.get('/:id', async (request, reply) => {
    const paramsSchema = z.object({ id: z.string() })
    const { id } = paramsSchema.parse(request.params)

    const deck = await getDeck(id)
    if (!deck) {
      return reply.notFound('Deck not found')
    }
    return { data: deck }
  })

  app.post('/', async (request, reply) => {
    const body = createDeckBodySchema.parse(request.body)
    const newDeck = await createDeck({
      id: randomUUID(),
      title: body.title,
      owner: 'You',
      objective: body.objective,
      audience: body.audience,
      tone: body.tone ?? 'Balanced executive tone',
      brandKitId: body.brandKitId ?? null,
    })

    return reply.code(201).send({ data: newDeck })
  })
}
