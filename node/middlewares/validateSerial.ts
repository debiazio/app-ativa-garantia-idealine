import type { ServiceContext } from '@vtex/api'

import { getSerialMap } from '../utils/serialsCache'
import type { SerialMap } from '../utils/serialsCache'

interface SerialRecord {
  serial: string
  codigoItem: string | null
  descricaoProduto: string | null
  numeroPedido: number | null
  dataLancamentoPedido: string | null
}

function normalizeSerial(value: string) {
  return String(value || '')
    .trim()
    .toUpperCase()
}

export async function validateSerial(
  ctx: ServiceContext,
  next: () => Promise<unknown>
) {
  const { serial } = ctx.vtex.route.params as { serial?: string }

  const normalizedSerial = normalizeSerial(serial || '')

  if (!normalizedSerial) {
    ctx.status = 400
    ctx.body = {
      found: false,
      message: 'Número de série inválido.',
    }

    await next()

    return
  }

  try {
    const serialMap = (await getSerialMap()) as SerialMap
    const record = serialMap[normalizedSerial] as SerialRecord | undefined

    if (!record) {
      ctx.status = 404
      ctx.body = {
        found: false,
        message: 'Número de série não encontrado.',
      }

      await next()

      return
    }

    ctx.status = 200
    ctx.body = {
      found: true,
      serial: record.serial,
      descricaoProduto: record.descricaoProduto,
      codigoItem: record.codigoItem,
      numeroPedido: record.numeroPedido,
      dataLancamentoPedido: record.dataLancamentoPedido,
    }

    await next()
  } catch (_error) {
    ctx.status = 503
    ctx.body = {
      found: false,
      message: 'Não foi possível validar o número de série no momento.',
    }

    await next()
  }
}
