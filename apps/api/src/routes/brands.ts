import type { FastifyInstance } from 'fastify'

import { listBrandKits } from '../data/brand-repository'

export async function registerBrandRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const data = await listBrandKits()
    return { data }
  })
}
