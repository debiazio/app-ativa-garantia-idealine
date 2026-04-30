import type { ServiceContext, IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { json } from 'co-body'

import { getSerialMap } from '../utils/serialsCache'
import type { SerialMap } from '../utils/serialsCache'

interface ActivationPayload {
  serial?: string
  nome?: string
  email?: string
  emailto?: string
  cpf?: string
  telefone?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  canalCompra?: string
}

interface SerialRecord {
  serial: string
  codigoItem: string | null
  descricaoProduto: string | null
  numeroPedido: number | null
  dataLancamentoPedido: string | null
}

class MasterDataClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexcommercestable.com.br`, context, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

  public createDocument(entity: string, data: Record<string, unknown>) {
    return this.http.post(`/api/dataentities/${entity}/documents`, data, {
      metric: 'masterdata-create-document',
    })
  }
}

function normalizeSerial(value: string) {
  return String(value || '')
    .trim()
    .toUpperCase()
}

function normalizeText(value: string) {
  return String(value || '').trim()
}

function onlyDigits(value: string) {
  return String(value || '').replace(/\D/g, '')
}

function addDays(dateString: string, days: number) {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    throw new Error('INVALID_DATA_LANCAMENTO_PEDIDO')
  }

  date.setDate(date.getDate() + days)

  return date
}

function addYears(date: Date, years: number) {
  const nextDate = new Date(date)
  nextDate.setFullYear(nextDate.getFullYear() + years)
  return nextDate
}

function toIsoWithoutMilliseconds(date: Date) {
  return date.toISOString().split('.')[0]
}

function getWarrantyRule(descricaoProduto: string | null) {
  const description = String(descricaoProduto || '').toUpperCase()

  if (description.includes('BELLINHA')) {
    return { rule: 'bellinha_2_anos', years: 2 }
  }

  if (description.includes('LA BELLE')) {
    return { rule: 'la_belle_2_anos', years: 2 }
  }

  if (description.includes('COPO/HASTE/SEPARADOR')) {
    return { rule: 'kit_2_anos', years: 2 }
  }

  return { rule: 'padrao_1_ano', years: 1 }
}

function getWarrantyStatus(dataValidadeDate: Date) {
  const now = new Date()
  return now.getTime() > dataValidadeDate.getTime() ? 'expirada' : 'ativa'
}

function getEmailFromBody(body: ActivationPayload) {
  const raw = body.emailto || body.email || ''
  return normalizeText(raw).toLowerCase()
}

function validatePayload(body: ActivationPayload) {
  if (!normalizeSerial(body.serial || '')) return 'VALIDATION_ERROR_SERIAL'
  if (!normalizeText(body.nome || '')) return 'VALIDATION_ERROR_NOME'
  if (!getEmailFromBody(body)) return 'VALIDATION_ERROR_EMAIL'
  if (!onlyDigits(body.cpf || '')) return 'VALIDATION_ERROR_CPF'
  if (!onlyDigits(body.telefone || '')) return 'VALIDATION_ERROR_TELEFONE'
  if (!onlyDigits(body.cep || '')) return 'VALIDATION_ERROR_CEP'
  if (!normalizeText(body.endereco || '')) return 'VALIDATION_ERROR_ENDERECO'
  if (!normalizeText(body.numero || '')) return 'VALIDATION_ERROR_NUMERO'
  if (!normalizeText(body.canalCompra || '')) return 'VALIDATION_ERROR_CANAL_COMPRA'
  return ''
}

export async function saveActivation(
  ctx: ServiceContext,
  next: () => Promise<unknown>
) {
  if (ctx.method !== 'POST') {
    ctx.status = 405
    ctx.body = { success: false, message: 'Não foi possível finalizar o cadastro.' }
    await next()
    return
  }

  let body = {} as ActivationPayload

  try {
    body = (await json(ctx.req)) as ActivationPayload
  } catch (error) {
    console.error('saveActivation body parse error:', error)
    ctx.status = 400
    ctx.body = { success: false, message: 'Não foi possível finalizar o cadastro.' }
    await next()
    return
  }

  const validationError = validatePayload(body)

  if (validationError) {
    console.error('saveActivation validation error:', validationError, body)
    ctx.status = 400
    ctx.body = { success: false, message: 'Não foi possível finalizar o cadastro.' }
    await next()
    return
  }

  try {
    const serial = normalizeSerial(body.serial || '')
    const serialMap = (await getSerialMap()) as SerialMap
    const record = serialMap[serial] as SerialRecord | undefined

    if (!record) {
      console.error('saveActivation serial not found:', serial)
      ctx.status = 404
      ctx.body = { success: false, message: 'Não foi possível finalizar o cadastro.' }
      await next()
      return
    }

    if (!record.dataLancamentoPedido) {
      console.error('saveActivation missing dataLancamentoPedido:', record)
      ctx.status = 422
      ctx.body = { success: false, message: 'Não foi possível finalizar o cadastro.' }
      await next()
      return
    }

    const emailValue = getEmailFromBody(body)

    const dataAtivacaoDate = new Date()
    const dataEmissaoNotaFiscalDate = addDays(record.dataLancamentoPedido, 1)
    const warrantyRule = getWarrantyRule(record.descricaoProduto)
    const dataValidadeDate = addYears(dataEmissaoNotaFiscalDate, warrantyRule.years)

    const document = {
      serial,
      descricaoProduto: record.descricaoProduto,
      codigoItem: record.codigoItem,
      nome: normalizeText(body.nome || ''),

      // IMPORTANT: manda os dois para satisfazer o Master Data (emailto obrigatório)
      email: emailValue,
      emailto: emailValue,

      cpf: onlyDigits(body.cpf || ''),
      telefone: onlyDigits(body.telefone || ''),
      cep: onlyDigits(body.cep || ''),
      endereco: normalizeText(body.endereco || ''),
      numero: normalizeText(body.numero || ''),
      complemento: normalizeText(body.complemento || ''),
      canalCompra: normalizeText(body.canalCompra || ''),

      dataAtivacao: toIsoWithoutMilliseconds(dataAtivacaoDate),
      dataEmissaoNotaFiscal: toIsoWithoutMilliseconds(dataEmissaoNotaFiscalDate),
      dataInicioGarantia: toIsoWithoutMilliseconds(dataEmissaoNotaFiscalDate),
      dataValidade: toIsoWithoutMilliseconds(dataValidadeDate),

      regraGarantiaAplicada: warrantyRule.rule,
      status: getWarrantyStatus(dataValidadeDate),
      origemCadastro: 'site',
      workspace: ctx.vtex.workspace,
    }

    const masterData = new MasterDataClient(ctx.vtex)
    await masterData.createDocument('GA', document)

    ctx.status = 200
    ctx.body = { success: true, message: 'Cadastro finalizado com sucesso.' }
    await next()
  } catch (error) {
    console.error('saveActivation unexpected error:', error)
    ctx.status = 500
    ctx.body = { success: false, message: 'Não foi possível finalizar o cadastro.' }
    await next()
  }
}
