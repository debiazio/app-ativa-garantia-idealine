import React, { useState } from 'react'
import styles from './dadosEquipamento.module.css'
import common from '../formCommon.module.css'

interface DadosEquipamentoProps {
  onContinue?: (serial: string) => void
}

interface ValidateSerialResponse {
  found: boolean
  message?: string
  serial?: string
  descricaoProduto?: string | null
  codigoItem?: string | null
  numeroPedido?: number | null
  dataLancamentoPedido?: string | null
}

export default function DadosEquipamento({
  onContinue,
}: DadosEquipamentoProps) {
  const [serial, setSerial] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [produtoDescricao, setProdutoDescricao] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedSerial = serial.trim().toUpperCase()

    if (!normalizedSerial) {
      setError('Informe o número de série.')
      setProdutoDescricao('')
      return
    }

    try {
      setLoading(true)
      setError('')
      setProdutoDescricao('')

      const response = await fetch(
        `/_v/garantia/serial/${encodeURIComponent(normalizedSerial)}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      )

      const data = (await response.json()) as ValidateSerialResponse

      if (!response.ok || !data.found) {
        setError(data.message || 'Número de série não encontrado.')
        return
      }

      setProdutoDescricao(data.descricaoProduto || '')

      if (onContinue) {
        onContinue(normalizedSerial)
      }
    } catch (err) {
      setError('Não foi possível validar o número de série no momento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={common.formSection} onSubmit={handleSubmit}>
      <div className={common.formCard}>
        <div className={styles.header}>
          <div className={common.titleWrapper}>
            <span className={common.step}>1</span>
            <h2 className={common.title}>Dados do equipamento</h2>
          </div>

          <button type="button" className={styles.help} aria-label="Ajuda">
            ?
          </button>
        </div>

        <p className={styles.description}>
          Número de série, encontrado na etiqueta parte de trás da autoclave
        </p>

        <input
          type="text"
          className={common.input}
          placeholder="Insira o número de série (ex.: ST0000732)"
          value={serial}
          onChange={(e) => {
            setSerial(e.target.value)
            if (error) {
              setError('')
            }
          }}
        />

        {error ? <p className={styles.error}>{error}</p> : null}

        {produtoDescricao ? (
          <div className={styles.productBox}>
            <span className={styles.productLabel}>Produto encontrado</span>
            <p className={styles.productText}>{produtoDescricao}</p>
          </div>
        ) : null}

        <button
          type="submit"
          className={common.button}
          disabled={!serial.trim() || loading}
        >
          {loading ? 'Validando...' : 'Continuar'}
        </button>
      </div>
    </form>
  )
}
