import React, { useState } from 'react'
import styles from './dadosEndereco.module.css'
import common from '../formCommon.module.css'

interface DadosEnderecoProps {
  isActive: boolean
  onContinue?: (data: {
    cep: string
    endereco: string
    numero: string
    complemento: string
  }) => void
}

interface ViaCepResponse {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function formatCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8)

  if (digits.length <= 5) {
    return digits
  }

  return digits.replace(/(\d{5})(\d+)/, '$1-$2')
}

function buildEndereco(data: ViaCepResponse) {
  const parts = [
    data.logradouro,
    data.bairro,
    data.localidade,
    data.uf,
  ].filter(Boolean)

  return parts.join(' - ')
}

export default function DadosEndereco({
  isActive,
  onContinue,
}: DadosEnderecoProps) {
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [loadingCep, setLoadingCep] = useState(false)
  const [cepError, setCepError] = useState('')
  const [semNumero, setSemNumero] = useState(false)

  const isValid =
    cep.trim() &&
    endereco.trim() &&
    (semNumero || numero.trim())

  const consultarCep = async (cepValue: string) => {
    const cepDigits = onlyDigits(cepValue)

    if (cepDigits.length !== 8) {
      setEndereco('')
      return
    }

    try {
      setLoadingCep(true)
      setCepError('')

      const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        setEndereco('')
        setCepError('Não foi possível consultar o CEP.')
        return
      }

      const data = (await response.json()) as ViaCepResponse

      if (data.erro) {
        setEndereco('')
        setCepError('CEP não encontrado.')
        return
      }

      const enderecoFormatado = buildEndereco(data)

      if (!enderecoFormatado) {
        setEndereco('')
        setCepError('Não foi possível carregar o endereço.')
        return
      }

      setEndereco(enderecoFormatado)
    } catch (_error) {
      setEndereco('')
      setCepError('Não foi possível consultar o CEP.')
    } finally {
      setLoadingCep(false)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValid) {
      return
    }

    onContinue?.({
      cep: onlyDigits(cep),
      endereco,
      numero: semNumero ? 'S/N' : onlyDigits(numero),
      complemento,
    })
  }

  if (!isActive) {
    return (
      <section className={common.formSection}>
        <div className={common.formCardClosed}>
          <div className={common.titleWrapper}>
            <span className={common.step}>3</span>
            <h2 className={common.title}>Endereço</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <form className={common.formSection} onSubmit={handleSubmit}>
      <div className={common.formCard}>
        <div className={common.titleWrapper}>
          <span className={common.step}>3</span>
          <h2 className={common.title}>Endereço</h2>
        </div>

        <div className={styles.field}>
          <label className={common.label}>CEP</label>
          <input
            type="text"
            className={common.input}
            placeholder="00000-000"
            value={cep}
            onChange={(e) => {
              const formatted = formatCep(e.target.value)
              setCep(formatted)

              if (cepError) {
                setCepError('')
              }

              if (!formatted.trim()) {
                setEndereco('')
              }
            }}
            onBlur={() => consultarCep(cep)}
          />

          {loadingCep ? (
            <span className={styles.helperMessage}>Consultando CEP...</span>
          ) : null}

          {cepError ? (
            <span className={styles.errorMessage}>{cepError}</span>
          ) : null}
        </div>

        {!endereco ? (
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noreferrer"
            className={styles.linkCep}
          >
            Não sei meu CEP
          </a>
        ) : null}

        <div className={styles.field}>
          <label className={common.label}>Endereço</label>
          <div className={styles.addressBox}>
            <div className={styles.addressLeft}>
              <span className={styles.houseIcon}>⌂</span>
              <span className={styles.addressText}>
                {endereco || 'Digite um CEP para carregar o endereço'}
              </span>
            </div>

            <button
              type="button"
              className={styles.changeButton}
              onClick={() => {
                setEndereco('')
                setCep('')
                setCepError('')
              }}
            >
              Alterar
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={common.label}>Número</label>
          <input
            type="text"
            inputMode="numeric"
            className={common.input}
            value={numero}
            onChange={(e) => setNumero(onlyDigits(e.target.value))}
            disabled={semNumero}
            placeholder={semNumero ? 'Sem número' : 'Digite o número'}
          />

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={semNumero}
              onChange={(e) => {
                const checked = e.target.checked
                setSemNumero(checked)

                if (checked) {
                  setNumero('')
                }
              }}
            />
            <span>Sem número</span>
          </label>
        </div>

        <div className={styles.field}>
          <label className={common.label}>Complemento e referência</label>
          <input
            type="text"
            className={common.input}
            placeholder="Ex.: Apto 12"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={common.button}
          disabled={!isValid || loadingCep}
        >
          Continuar
        </button>
      </div>
    </form>
  )
}
