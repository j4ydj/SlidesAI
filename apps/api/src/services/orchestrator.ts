import { randomUUID } from 'node:crypto'

import type { ConversationMessage } from '@slidesai/domain'
import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { z } from 'zod'

import { env } from '../env'

const assistantStrategies = [
  {
    strategy: 'Narrative arc update',
    templates: [
      'I recommend reframing {section} as "{hook}" so we can connect the metrics to executive priorities. Shall I draft the slide now?',
      'I can introduce a two-slide vignette covering {section}. Would you prefer a data visualization or a narrative timeline?',
    ],
  },
  {
    strategy: 'Tone alignment',
    templates: [
      'Understood on the tone shift. I will soften the phrasing in {section} and add a closer with two direct asks.',
      'Noted. I will rewrite those slides to feel more {tone} while keeping the proof points intact.',
    ],
  },
  {
    strategy: 'Data request',
    templates: [
      'To make the story credible, I need the latest value for {metric}. Paste it here or tag a data source to sync automatically.',
      'I’m missing the updated {metric}. Once you provide it I will refresh the chart and speaker notes.',
    ],
  },
] as const

const replyInputSchema = z.object({
  tone: z.string().default('executive-confident'),
  section: z.string().optional(),
  metric: z.string().optional(),
  hook: z.string().optional(),
})

const shouldUseLLM = !env.USE_MOCK_ORCHESTRATOR && env.LLM_PROVIDER !== 'mock' && Boolean(env.LLM_API_KEY)

function buildOpenAIClient() {
  if (!shouldUseLLM || !env.LLM_API_KEY) {
    return null
  }

  const baseURL = env.LLM_BASE_URL || (env.LLM_PROVIDER === 'openrouter' ? 'https://openrouter.ai/api/v1' : undefined)

  return new OpenAI({
    apiKey: env.LLM_API_KEY,
    baseURL,
    defaultHeaders:
      env.LLM_PROVIDER === 'openrouter'
        ? {
            'HTTP-Referer': env.LLM_HTTP_REFERER || 'http://localhost:3000',
            'X-Title': env.LLM_TITLE || 'SlidesAI Copilot',
          }
        : undefined,
  })
}

const openaiClient = buildOpenAIClient()
const openAIModel =
  env.LLM_MODEL || (env.LLM_PROVIDER === 'openrouter' ? 'openrouter/auto' : 'gpt-4o-mini')

interface GenerateAssistantReplyInput {
  deckTitle: string
  deckObjective: string
  latestUserMessage: string
  transcript: ConversationMessage[]
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function generateMockReply(input: z.input<typeof replyInputSchema>) {
  const parsed = replyInputSchema.parse(input)
  const choice = pickRandom(assistantStrategies)
  const template = pickRandom(choice.templates)

  const message = template
    .replace('{section}', parsed.section ?? 'the current section')
    .replace('{metric}', parsed.metric ?? 'the KPI you need featured')
    .replace('{hook}', parsed.hook ?? 'Strategic outlook')
    .replace('{tone}', parsed.tone.replace('-', ' '))

  return {
    id: randomUUID(),
    role: 'assistant' as const,
    strategy: choice.strategy,
    content: message,
    timestamp: new Date().toISOString(),
  }
}

function buildChatMessages(input: GenerateAssistantReplyInput): ChatCompletionMessageParam[] {
  const recentMessages = input.transcript.slice(-8)
  return [
    {
      role: 'system' as const,
      content:
        'You are SlidesAI, an executive presentation copilot. Respond with concise, actionable guidance that references storyline strategy and next steps. Always keep tone professional.',
    },
    {
      role: 'user' as const,
      content: `Deck title: ${input.deckTitle}
Objective: ${input.deckObjective}`,
    },
    ...recentMessages.map((message) => ({
      role: message.role,
      content: message.content,
    } satisfies ChatCompletionMessageParam)),
    {
      role: 'user' as const,
      content: input.latestUserMessage,
    },
  ]
}

export async function generateAssistantReply(
  input: GenerateAssistantReplyInput,
): Promise<ConversationMessage> {
  if (!shouldUseLLM || !openaiClient) {
    return generateMockReply({
      tone: 'executive-confident',
      section: input.transcript.slice(-1)[0]?.strategy,
    })
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model: openAIModel,
      messages: buildChatMessages(input),
      temperature: 0.6,
      max_tokens: 320,
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (content) {
      return {
        id: randomUUID(),
        role: 'assistant',
        strategy: 'LLM response',
        content,
        timestamp: new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error('LLM generation failed, using mock response', error)
  }

  return generateMockReply({ tone: 'executive-confident' })
}
