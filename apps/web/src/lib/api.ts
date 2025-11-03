const DEFAULT_API_BASE = 'http://localhost:4000'

export type ApiResponse<T> = {
  data: T
}

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE
}

type ApiOptions = RequestInit & { cached?: boolean }

export async function apiGet<T>(path: string, options: ApiOptions = {}) {
  const { cached = true, ...init } = options
  const url = `${getApiBaseUrl()}${path}`
  const response = await fetch(url, {
    ...init,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: cached ? 'force-cache' : 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export async function apiPost<TBody extends Record<string, unknown>, TResult>(
  path: string,
  body: TBody,
  options: RequestInit = {},
) {
  const url = `${getApiBaseUrl()}${path}`

  const response = await fetch(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as TResult
}
