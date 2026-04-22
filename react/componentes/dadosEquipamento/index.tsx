import React, { useState } from 'react'

import styles from './dadosEquipamento.module.css'
import common from '../formCommon.module.css'

interface DadosEquipamentoProps {
  onContinue?: (serial: string) => void
}

interface ValidateSerialResponse {
  found?: boolean
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
  const [showHelp, setShowHelp] = useState(false)

  const getFriendlyErrorMessage = () => {
    return 'Não foi possível validar o número de série agora. Tente novamente em instantes.'
  }

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

      const contentType = response.headers.get('content-type') ?? ''
      let data: ValidateSerialResponse | null = null
      let rawText = ''

      if (contentType.includes('application/json')) {
        data = (await response.json()) as ValidateSerialResponse
      } else {
        rawText = await response.text()
      }

      if (!response.ok) {
        if (response.status === 404 && data?.message) {
          setError(data.message)

          return
        }

        console.error('Erro ao validar serial:', {
          status: response.status,
          statusText: response.statusText,
          data,
          rawText,
        })

        setError(getFriendlyErrorMessage())

        return
      }

      if (!data || !data.found) {
        setError(data?.message ?? 'Número de série não encontrado.')

        return
      }

      setProdutoDescricao(data.descricaoProduto ?? '')

      if (onContinue) {
        onContinue(normalizedSerial)
      }
    } catch (err) {
      console.error('Erro inesperado ao validar serial:', err)
      setError(getFriendlyErrorMessage())
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

          <div
            className={styles.helpWrapper}
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
          >
            <button
              type="button"
              className={styles.help}
              aria-label="Ajuda"
              onClick={() => setShowHelp((prev) => !prev)}
            >
              ?
            </button>

            {showHelp ? (
              <div className={styles.helpPopover}>
                <img
                  src="https://mfmgroup.vtexassets.com/assets/vtex.file-manager-graphql/images/98af5303-6409-4353-8c8d-86e910f0ec4a___46610486027a3bf113daf0e3f3dd2bd1.png"
                  alt="Exemplo de onde encontrar o número de série"
                  className={styles.helpImage}
                />
                <span className={styles.helpArrow} />
              </div>
            ) : null}
          </div>
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
