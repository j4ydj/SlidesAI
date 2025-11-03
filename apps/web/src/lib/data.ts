import type { BrandKit, ConversationMessage, DeckRecord } from '@slidesai/domain'

import { apiGet, type ApiResponse } from './api'

export async function fetchDecks() {
  const response = await apiGet<ApiResponse<DeckRecord[]>>('/api/decks', { cached: false })
  return response.data
}

export async function fetchDeck(id: string) {
  const response = await apiGet<ApiResponse<DeckRecord>>(`/api/decks/${id}`, { cached: false })
  return response.data
}

export async function fetchBrandKits() {
  const response = await apiGet<ApiResponse<BrandKit[]>>('/api/brands', { cached: true })
  return response.data
}

export async function fetchConversation(deckId: string) {
  const response = await apiGet<ApiResponse<ConversationMessage[]>>(`/api/conversation/${deckId}/messages`, {
    cached: false,
  })
  return response.data
}
