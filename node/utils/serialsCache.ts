import fetch from 'node-fetch'

interface SerialRecord {
  serial: string
  codigoItem: string | null
  descricaoProduto: string | null
  numeroPedido: number | null
  dataLancamentoPedido: string | null
}

export type SerialMap = Record<string, SerialRecord>

const SERIALS_URL = 'https://stermax.com.br/images_idealine/serials.json'
const CACHE_TTL_MS = 10 * 60 * 1000

let cachedSerialMap: SerialMap | null = null
let cacheExpiresAt = 0
let loadingPromise: Promise<SerialMap> | null = null

async function fetchSerialMap(): Promise<SerialMap> {
  const startedAt = Date.now()

  const response = await fetch(SERIALS_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  const elapsedMs = Date.now() - startedAt

  if (!response.ok) {
    throw new Error(
      `Falha ao carregar base de seriais: status=${response.status} url=${SERIALS_URL} elapsedMs=${elapsedMs}`
    )
  }

  const data = (await response.json()) as SerialMap

  if (!data || typeof data !== 'object') {
    throw new Error(`Base de seriais inválida: url=${SERIALS_URL}`)
  }

  return data
}

export async function getSerialMap(): Promise<SerialMap> {
  const now = Date.now()

  if (cachedSerialMap && now < cacheExpiresAt) {
    return cachedSerialMap
  }

  if (loadingPromise) {
    return loadingPromise
  }

  loadingPromise = fetchSerialMap()
    .then((data) => {
      cachedSerialMap = data
      cacheExpiresAt = Date.now() + CACHE_TTL_MS
      return data
    })
    .catch((error) => {
      // IMPORTANT: loga o motivo real (DNS, timeout, TLS, status, etc.)
      console.error('[serialsCache] fetchSerialMap error:', error)

      // Se já temos cache antigo, não derruba o fluxo
      if (cachedSerialMap) {
        console.warn(
          '[serialsCache] Using stale cached serial map due to fetch error.'
        )
        return cachedSerialMap
      }

      throw error
    })
    .finally(() => {
      loadingPromise = null
    })

  return loadingPromise
}
