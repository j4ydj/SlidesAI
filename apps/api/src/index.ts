import cors from '@fastify/cors'
import sensible from '@fastify/sensible'
import Fastify from 'fastify'

import { env } from './env'
import { registerBrandRoutes } from './routes/brands'
import { registerConversationRoutes } from './routes/conversation'
import { registerDeckRoutes } from './routes/decks'
import { registerHealthRoutes } from './routes/health'

const app = Fastify({
  logger: {
    transport:
      env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
            },
          }
        : undefined,
  },
})

app.register(cors, { origin: true, credentials: true })
app.register(sensible)

app.register(registerHealthRoutes, { prefix: '/health' })
app.register(registerBrandRoutes, { prefix: '/api/brands' })
app.register(registerDeckRoutes, { prefix: '/api/decks' })
app.register(registerConversationRoutes, { prefix: '/api/conversation' })

app
  .listen({ port: env.PORT, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`API ready on port ${env.PORT}`)
  })
  .catch((error) => {
    app.log.error(error, 'Error starting API server')
    process.exit(1)
  })
