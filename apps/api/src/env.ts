import { config } from 'dotenv'
import { z } from 'zod'

config({ path: process.env.API_ENV_PATH || '.env' })

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  LLM_PROVIDER: z.enum(['mock', 'openai', 'openrouter']).default('mock'),
  LLM_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().optional(),
  LLM_BASE_URL: z.string().optional(),
  LLM_HTTP_REFERER: z.string().optional(),
  LLM_TITLE: z.string().optional(),
  USE_MOCK_ORCHESTRATOR: z.coerce.boolean().default(true),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

if (parsed.data.LLM_PROVIDER !== 'mock' && !parsed.data.LLM_API_KEY) {
  console.error('LLM_API_KEY is required when LLM_PROVIDER is set to a live provider')
  process.exit(1)
}

export const env = parsed.data
