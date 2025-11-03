import { prisma } from './prisma'

export async function listBrandKits() {
  const records = (await prisma.brandKit.findMany({
    orderBy: { updatedAt: 'desc' },
  })) as Array<{
    id: string
    name: string
    primaryColor: string
    secondaryColor: string
    headingFont: string
    bodyFont: string
    toneVoice: string
    toneKeywords: string
    logoUrl: string
    updatedAt: Date
  }>

  return records.map((kit) => ({
    id: kit.id,
    name: kit.name,
    primaryColor: kit.primaryColor,
    secondaryColor: kit.secondaryColor,
    typography: {
      heading: kit.headingFont,
      body: kit.bodyFont,
    },
    tone: {
      voice: kit.toneVoice,
      keywords: safeParseKeywords(kit.toneKeywords),
    },
    logoUrl: kit.logoUrl,
    updatedAt: kit.updatedAt.toISOString(),
  }))
}

function safeParseKeywords(raw: string) {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as string[]) : String(raw).split(',').map((value) => value.trim())
  } catch {
    return raw.split(',').map((value) => value.trim())
  }
}

