import { PrismaClient } from '@prisma/client'
import {
  brandKitFixtures,
  conversationFixtures,
  deckFixtures,
} from '@slidesai/domain'

const prisma = new PrismaClient()

async function main() {
  await prisma.conversationMessage.deleteMany()
  await prisma.deckSection.deleteMany()
  await prisma.deck.deleteMany()
  await prisma.brandKit.deleteMany()

  for (const kit of brandKitFixtures) {
    await prisma.brandKit.create({
      data: {
        id: kit.id,
        name: kit.name,
        primaryColor: kit.primaryColor,
        secondaryColor: kit.secondaryColor,
        headingFont: kit.typography.heading,
        bodyFont: kit.typography.body,
        toneVoice: kit.tone.voice,
        toneKeywords: JSON.stringify(kit.tone.keywords),
        logoUrl: kit.logoUrl,
      },
    })
  }

  for (const deck of deckFixtures) {
    await prisma.deck.create({
      data: {
        id: deck.id,
        title: deck.title,
        owner: deck.owner,
        status: deck.status,
        dueAt: new Date(deck.dueAt),
        objective: deck.meta.objective,
        audience: deck.meta.audience,
        tone: deck.meta.tone,
        brandKitId: deck.meta.brandKitId,
        sections: {
          create: deck.outline.map((section, index) => ({
            title: section.title,
            status: section.status,
            slideCount: section.slideCount,
            order: index,
          })),
        },
        messages: {
          create: (conversationFixtures[deck.id] ?? []).map((message) => ({
            id: message.id,
            role: message.role,
            strategy: message.strategy,
            content: message.content,
            createdAt: new Date(message.timestamp),
          })),
        },
      },
    })
  }
}

main()
  .catch((error) => {
    console.error('Error seeding database', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
