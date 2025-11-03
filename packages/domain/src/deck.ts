import { z } from 'zod'

export const deckStatusSchema = z.enum([
  'in_conversation',
  'draft_ready',
  'intake_complete',
  'export_ready',
])

export const deckOutlineSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['approved', 'needs_attention', 'drafting', 'planning']),
  slideCount: z.number().int().nonnegative(),
})

export const deckMetaSchema = z.object({
  objective: z.string(),
  audience: z.string(),
  tone: z.string(),
  brandKitId: z.string().nullable(),
})

export const deckRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  owner: z.string(),
  status: deckStatusSchema,
  dueAt: z.string(),
  outline: z.array(deckOutlineSectionSchema),
  meta: deckMetaSchema,
})

export type DeckStatus = z.infer<typeof deckStatusSchema>
export type DeckOutlineSection = z.infer<typeof deckOutlineSectionSchema>
export type DeckMeta = z.infer<typeof deckMetaSchema>
export type DeckRecord = z.infer<typeof deckRecordSchema>

export const deckFixtures: DeckRecord[] = [
  {
    id: 'enterprise-q4',
    title: 'Enterprise Q4 business review',
    owner: 'Amelia Hart',
    status: 'in_conversation',
    dueAt: '2025-11-01T22:00:00Z',
    outline: [
      { id: 'sec-1', title: 'Executive summary', status: 'approved', slideCount: 2 },
      { id: 'sec-2', title: 'FY24 performance', status: 'needs_attention', slideCount: 3 },
      { id: 'sec-3', title: 'Supply chain stabilization', status: 'drafting', slideCount: 2 },
      { id: 'sec-4', title: 'FY25 priorities', status: 'planning', slideCount: 3 },
    ],
    meta: {
      objective: 'Illuminate FY24 performance and highlight operational resiliency wins.',
      audience: 'Executive leadership team',
      tone: 'Confident, concise, data-backed',
      brandKitId: 'northwind-enterprise',
    },
  },
  {
    id: 'retail-campaign',
    title: 'Retail campaign recap — North America',
    owner: 'Devon Blake',
    status: 'draft_ready',
    dueAt: '2025-11-02T17:30:00Z',
    outline: [
      { id: 'sec-1', title: 'Campaign goals', status: 'approved', slideCount: 1 },
      { id: 'sec-2', title: 'Performance highlights', status: 'approved', slideCount: 2 },
      { id: 'sec-3', title: 'Next experiments', status: 'drafting', slideCount: 2 },
    ],
    meta: {
      objective: 'Celebrate campaign outcomes and align on future experiments.',
      audience: 'Client marketing directors',
      tone: 'Energetic, strategic, optimistic',
      brandKitId: 'brightline-agency',
    },
  },
]
