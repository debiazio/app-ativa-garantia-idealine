import React, { useMemo, useState } from 'react'
import styles from './dadosPessoais.module.css'
import common from '../formCommon.module.css'

interface DadosPessoaisProps {
  isActive: boolean
  onContinue?: (data: {
    nome: string
    emailto: string  // ← ALTERAÇÃO 1: interface
    cpf: string
    telefone: string
  }) => void
}

type FieldErrors = {
  nome: string
  emailto: string  // ← ALTERAÇÃO 2: type FieldErrors
  cpf: string
  telefone: string
}

type FieldTouched = {
  nome: boolean
  emailto: boolean  // ← ALTERAÇÃO 3: type FieldTouched
  cpf: boolean
  telefone: boolean
}

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function capitalizeWords(value: string) {
  return value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatNomeOnChange(value: string) {
  return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
}

function formatNomeOnBlur(value: string) {
  const cleaned = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
  const normalized = normalizeSpaces(cleaned)

  if (!normalized) {
    return ''
  }

  return capitalizeWords(normalized)
}

function validateNome(value: string) {
  const normalized = normalizeSpaces(value)

  if (!normalized) {
    return 'Informe seu nome completo.'
  }

  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(normalized)) {
    return 'Digite apenas letras.'
  }

  const words = normalized.split(' ').filter(Boolean)

  if (words.length < 2) {
    return 'Informe nome e sobrenome completos.'
  }

  const hasShortWord = words.some((word) => word.length < 2)

  if (hasShortWord) {
    return 'Informe nome e sobrenome.'
  }

  return ''
}

function formatEmail(value: string) {
  return value.replace(/\s+/g, '').toLowerCase()
}

function validateEmail(value: string) {
  const normalized = value.trim().toLowerCase()

  if (!normalized) {
    return 'Informe seu e-mail.'
  }

  if (/\s/.test(normalized)) {
    return 'O e-mail não pode conter espaços.'
  }

  if (normalized.includes('..')) {
    return 'Informe um e-mail válido.'
  }

  const parts = normalized.split('@')

  if (parts.length !== 2) {
    return 'Informe um e-mail válido.'
  }

  const [localPart, domain] = parts

  if (!localPart || !domain) {
    return 'Informe um e-mail válido.'
  }

  if (
    domain.startsWith('.') ||
    domain.endsWith('.') ||
    domain.startsWith('-') ||
    domain.endsWith('-')
  ) {
    return 'Informe um e-mail válido.'
  }

  if (!domain.includes('.')) {
    return 'Informe um e-mail válido.'
  }

  const domainParts = domain.split('.')

  if (domainParts.some((part) => !part)) {
    return 'Informe um e-mail válido.'
  }

  if (domainParts.some((part) => part.startsWith('-') || part.endsWith('-'))) {
    return 'Informe um e-mail válido.'
  }

  const emailRegex =
    /^[a-z0-9._%+-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i

  if (!emailRegex.test(normalized)) {
    return 'Informe um e-mail válido.'
  }

  const tld = domainParts[domainParts.length - 1]

  if (tld.length < 2) {
    return 'Informe um e-mail válido.'
  }

  return ''
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 3) {
    return digits
  }

  if (digits.length <= 6) {
    return digits.replace(/(\d{3})(\d+)/, '$1.$2')
  }

  if (digits.length <= 9) {
    return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
}

function isRepeatedDigits(value: string) {
  return /^(\d)\1+$/.test(value)
}

function isValidCpfDigits(cpf: string) {
  if (cpf.length !== 11) {
    return false
  }

  if (isRepeatedDigits(cpf)) {
    return false
  }

  let sum = 0

  for (let i = 0; i < 9; i += 1) {
    sum += Number(cpf.charAt(i)) * (10 - i)
  }

  let firstDigit = (sum * 10) % 11

  if (firstDigit === 10) {
    firstDigit = 0
  }

  if (firstDigit !== Number(cpf.charAt(9))) {
    return false
  }

  sum = 0

  for (let i = 0; i < 10; i += 1) {
    sum += Number(cpf.charAt(i)) * (11 - i)
  }

  let secondDigit = (sum * 10) % 11

  if (secondDigit === 10) {
    secondDigit = 0
  }

  if (secondDigit !== Number(cpf.charAt(10))) {
    return false
  }

  return true
}

function validateCpf(value: string) {
  const digits = onlyDigits(value)

  if (!digits) {
    return 'Informe seu CPF.'
  }

  if (digits.length !== 11) {
    return 'O CPF deve ter 11 dígitos.'
  }

  if (!isValidCpfDigits(digits)) {
    return 'Informe um CPF válido.'
  }

  return ''
}

function formatTelefone(value: string) {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 2) {
    return digits.replace(/(\d{0,2})/, '($1')
  }

  if (digits.length <= 7) {
    return digits.replace(/(\d{2})(\d{1})(\d+)/, '($1) $2$3')
  }

  return digits.replace(/(\d{2})(\d{1})(\d{4})(\d{1,4})/, '($1) $2$3-$4')
}

  function isInvalidDdd(ddd: string) {
    const validDdds = new Set([
      '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '21', '22', '24', '27', '28',
      '31', '32', '33', '34', '35', '37', '38',
      '41', '42', '43', '44', '45', '46',
      '47', '48', '49',
      '51', '53', '54', '55',
      '61', '62', '63', '64', '65', '66', '67',
      '68', '69',
      '71', '73', '74', '75', '77', '79',
      '81', '82', '83', '84', '85', '86', '87', '88', '89',
      '91', '92', '93', '94', '95', '96', '97', '98', '99',
    ])

    return !validDdds.has(ddd)
  }

function validateTelefone(value: string) {
  const digits = onlyDigits(value)

  if (!digits) {
    return 'Informe seu telefone.'
  }

  if (digits.length !== 11) {
    return 'O telefone deve ter 11 dígitos.'
  }

  if (isRepeatedDigits(digits)) {
    return 'Informe um telefone válido.'
  }

  const ddd = digits.slice(0, 2)
  const nonoDigito = digits.charAt(2)
  const numero = digits.slice(2)
  const miolo = digits.slice(3, 7)
  const final = digits.slice(7)

  if (isInvalidDdd(ddd)) {
    return 'Informe um telefone válido.'
  }

  if (nonoDigito !== '9') {
    return 'O telefone deve estar no formato (XX) 9XXXX-XXXX.'
  }

  if (/^0+$/.test(numero)) {
    return 'Informe um telefone válido.'
  }

  if (/^0000$/.test(miolo) || /^0000$/.test(final)) {
    return 'Informe um telefone válido.'
  }

  if (/^9?0+$/.test(numero)) {
    return 'Informe um telefone válido.'
  }

  return ''
}

export default function DadosPessoais({
  isActive,
  onContinue,
}: DadosPessoaisProps) {
  const [nome, setNome] = useState('')
  const [emailto, setEmailto] = useState('')  // ← ALTERAÇÃO 4: state
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')

  const [touched, setTouched] = useState<FieldTouched>({
    nome: false,
    emailto: false,  // ← ALTERAÇÃO 5: touched state
    cpf: false,
    telefone: false,
  })

  const errors = useMemo<FieldErrors>(
    () => ({
      nome: validateNome(nome),
      emailto: validateEmail(emailto),  // ← ALTERAÇÃO 6: useMemo
      cpf: validateCpf(cpf),
      telefone: validateTelefone(telefone),
    }),
    [nome, emailto, cpf, telefone]  // ← ALTERAÇÃO 7: dependency array
  )

  const isValid =
    !errors.nome &&
    !errors.emailto &&  // ← ALTERAÇÃO 8: isValid check
    !errors.cpf &&
    !errors.telefone &&
    nome.trim() &&
    emailto.trim() &&  // ← ALTERAÇÃO 9: isValid check
    cpf.trim() &&
    telefone.trim()

  const handleBlur = (field: keyof FieldTouched) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setTouched({
      nome: true,
      emailto: true,  // ← ALTERAÇÃO 10: setTouched
      cpf: true,
      telefone: true,
    })

    const normalizedNome = formatNomeOnBlur(nome)
    const normalizedEmailto = emailto.trim().toLowerCase()  // ← ALTERAÇÃO 11: normalized
    const normalizedCpf = onlyDigits(cpf)
    const normalizedTelefone = onlyDigits(telefone)

    setNome(normalizedNome)
    setEmailto(normalizedEmailto)  // ← ALTERAÇÃO 12: setEmailto
    setCpf(formatCpf(normalizedCpf))
    setTelefone(formatTelefone(normalizedTelefone))

    if (
      validateNome(normalizedNome) ||
      validateEmail(normalizedEmailto) ||  // ← ALTERAÇÃO 13: validate emailto
      validateCpf(normalizedCpf) ||
      validateTelefone(normalizedTelefone)
    ) {
      return
    }

    onContinue?.({
      nome: normalizedNome,
      emailto: normalizedEmailto,  // ← ALTERAÇÃO 14: payload
      cpf: normalizedCpf,
      telefone: normalizedTelefone,
    })
  }

  if (!isActive) {
    return (
      <section className={common.formSection}>
        <div className={common.formCardClosed}>
          <div className={common.titleWrapper}>
            <span className={common.step}>2</span>
            <h2 className={common.title}>Dados pessoais</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <form className={common.formSection} onSubmit={handleSubmit}>
      <div className={common.formCard}>
        <div className={common.titleWrapper}>
          <span className={common.step}>2</span>
          <h2 className={common.title}>Dados pessoais</h2>
        </div>

        <p className={common.description}>
          Solicitamos apenas as informações essenciais para a realização da
          extensão da garantia.
        </p>

        <div className={styles.field}>
          <label className={common.label}>Nome</label>
          <input
            type="text"
            className={`${common.input} ${
              touched.nome && errors.nome ? styles.inputError : ''
            }`}
            value={nome}
            onChange={(e) => setNome(formatNomeOnChange(e.target.value))}
            onBlur={() => {
              setNome(formatNomeOnBlur(nome))
              handleBlur('nome')
            }}
            placeholder="Digite seu nome completo"
          />
          {touched.nome && errors.nome ? (
            <span className={styles.errorMessage}>{errors.nome}</span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={common.label}>E-mail</label>
          <input
            type="email"
            className={`${common.input} ${
              touched.emailto && errors.emailto ? styles.inputError : ''  // ← ALTERAÇÃO 15: input field
            }`}
            placeholder="seu@email.com"
            value={emailto}  // ← ALTERAÇÃO 16: value
            onChange={(e) => setEmailto(formatEmail(e.target.value))}  // ← ALTERAÇÃO 17: onChange
            onBlur={() => handleBlur('emailto')}  // ← ALTERAÇÃO 18: onBlur
          />
          {touched.emailto && errors.emailto ? (  // ← ALTERAÇÃO 19: error display
            <span className={styles.errorMessage}>{errors.emailto}</span>
          ) : null}
        </div>

        <div className={styles.row}>
          <div className={styles.fieldHalf}>
            <label className={common.label}>CPF</label>
            <input
              type="text"
              className={`${common.input} ${
                touched.cpf && errors.cpf ? styles.inputError : ''
              }`}
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              onBlur={() => handleBlur('cpf')}
            />
            {touched.cpf && errors.cpf ? (
              <span className={styles.errorMessage}>{errors.cpf}</span>
            ) : null}
          </div>

          <div className={styles.fieldHalf}>
            <label className={common.label}>Telefone</label>
            <input
              type="text"
              className={`${common.input} ${
                touched.telefone && errors.telefone ? styles.inputError : ''
              }`}
              placeholder="(41) 98888-7777"
              value={telefone}
              onChange={(e) => setTelefone(formatTelefone(e.target.value))}
              onBlur={() => handleBlur('telefone')}
            />
            {touched.telefone && errors.telefone ? (
              <span className={styles.errorMessage}>{errors.telefone}</span>
            ) : null}
          </div>
        </div>

        <button type="submit" className={common.button} disabled={!isValid}>
          Continuar
        </button>
      </div>
    </form>
  )
}
