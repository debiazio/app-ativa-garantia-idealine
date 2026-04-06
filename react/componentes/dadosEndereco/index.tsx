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

export default function DadosEndereco({
  isActive,
  onContinue,
}: DadosEnderecoProps) {
  const [cep, setCep] = useState('')
  const [endereco] = useState('Rua Inajá - Emiliano Perneta - Pinhais - PR')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')

  const isValid =
    cep.trim() &&
    endereco.trim() &&
    numero.trim()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValid) {
      return
    }

    onContinue?.({
      cep,
      endereco,
      numero,
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
            placeholder="88888-000"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
        </div>

        <button
          type="button"
          className={styles.linkCep}
        >
          Não sei meu CEP
        </button>

        <div className={styles.field}>
          <div className={styles.addressBox}>
            <div className={styles.addressLeft}>
              <span className={styles.houseIcon}>⌂</span>
              <span className={styles.addressText}>{endereco}</span>
            </div>

            <button
              type="button"
              className={styles.changeButton}
            >
              Alterar
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={common.label}>Número</label>
          <input
            type="text"
            className={common.input}
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
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
          disabled={!isValid}
        >
          Continuar
        </button>
      </div>
    </form>
  )
}
