import React, { useState } from 'react'
import styles from './dadosPessoais.module.css'
import common from '../formCommon.module.css'

interface DadosPessoaisProps {
  isActive: boolean
  serial?: string
  onContinue?: (data: {
    nome: string
    email: string
    cpf: string
    telefone: string
  }) => void
}

export default function DadosPessoais({
  isActive,
  onContinue,
}: DadosPessoaisProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')

  const isValid =
    nome.trim() &&
    email.trim() &&
    cpf.trim() &&
    telefone.trim()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValid) {
      return
    }

    if (onContinue) {
      onContinue({
        nome,
        email,
        cpf,
        telefone,
      })
    }
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
            className={common.input}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={common.label}>E-mail</label>
          <input
            type="email"
            className={common.input}
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.fieldHalf}>
            <label className={common.label}>CPF</label>
            <input
              type="text"
              className={common.input}
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>

          <div className={styles.fieldHalf}>
            <label className={common.label}>Telefone</label>
            <input
              type="text"
              className={common.input}
              placeholder="(41) 9 8888-7777"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
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
