import type { ServiceContext } from '@vtex/api'
import serials from '../data/serials.json'

interface SerialRecord {
  serial: string
  codigoItem: string | null
  descricaoProduto: string | null
  numeroPedido: number | null
  dataLancamentoPedido: string | null
}

type SerialMap = Record<string, SerialRecord>

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
  const serialMap = serials as SerialMap

  if (!normalizedSerial) {
    ctx.status = 400
    ctx.body = {
      found: false,
      message: 'Número de série inválido.',
    }

    await next()
    return
  }

  const record = serialMap[normalizedSerial]

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
}
