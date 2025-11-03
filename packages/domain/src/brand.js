import { z } from 'zod';
export const brandToneSchema = z.object({
    voice: z.string().describe('Narrative voice guidance'),
    keywords: z.array(z.string()).describe('Adjectives or tonal anchors'),
});
export const brandKitSchema = z.object({
    id: z.string(),
    name: z.string(),
    primaryColor: z.string().regex(/^#/, 'Must be hex color'),
    secondaryColor: z.string().regex(/^#/, 'Must be hex color'),
    typography: z.object({
        heading: z.string(),
        body: z.string(),
    }),
    tone: brandToneSchema,
    logoUrl: z.string().url(),
    updatedAt: z.string(),
});
export const brandKitFixtures = [
    {
        id: 'northwind-enterprise',
        name: 'Northwind Enterprise - Corporate',
        primaryColor: '#1f6feb',
        secondaryColor: '#fef08a',
        typography: {
            heading: 'Soehne',
            body: 'Inter',
        },
        tone: {
            voice: 'Confident, data-backed, executive-ready.',
            keywords: ['confident', 'measured', 'strategic'],
        },
        logoUrl: 'https://placehold.co/120x48?text=NE',
        updatedAt: '2025-10-12T14:22:00Z',
    },
    {
        id: 'brightline-agency',
        name: 'Brightline Agency - Pitch',
        primaryColor: '#f97316',
        secondaryColor: '#0f172a',
        typography: {
            heading: 'Neue Haas Grotesk',
            body: 'Source Sans Pro',
        },
        tone: {
            voice: 'Energetic, optimistic, design-forward.',
            keywords: ['energetic', 'optimistic', 'design-forward'],
        },
        logoUrl: 'https://placehold.co/120x48?text=BL',
        updatedAt: '2025-09-03T09:10:00Z',
    },
];
//# sourceMappingURL=brand.js.map