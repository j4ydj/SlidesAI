import { z } from 'zod'

export const conversationMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  strategy: z.string().optional(),
  content: z.string(),
  timestamp: z.string(),
})

export type ConversationMessage = z.infer<typeof conversationMessageSchema>

export type ConversationStore = Record<string, ConversationMessage[]>

export const conversationFixtures: ConversationStore = {
  'enterprise-q4': [
    {
      id: 'm1',
      role: 'assistant',
      strategy: 'Story outline',
      content:
        'Here is the suggested flow: 1) Executive summary, 2) FY24 performance, 3) Operational resiliency, 4) FY25 priorities. Let me know where to dive deeper.',
      timestamp: '2025-11-01T16:00:00Z',
    },
    {
      id: 'm2',
      role: 'user',
      content: 'Let\'s make "Operational resiliency" more about supply chain wins, not general ops updates.',
      timestamp: '2025-11-01T16:02:00Z',
    },
    {
      id: 'm3',
      role: 'assistant',
      strategy: 'Slide updates',
      content:
        'Understood. I will reposition slide 6 as "Supply chain stabilization" and highlight the 22% reduction in lead times. Do you want an accompanying visual?',
      timestamp: '2025-11-01T16:03:30Z',
    },
  ],
}
