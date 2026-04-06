import React, { useState } from 'react'
import styles from './dadosEquipamento.module.css'
import common from '../formCommon.module.css'

interface DadosEquipamentoProps {
  onContinue?: (serial: string) => void
}

export default function DadosEquipamento({
  onContinue,
}: DadosEquipamentoProps) {
  const [serial, setSerial] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!serial.trim()) {
      return
    }

    if (onContinue) {
      onContinue(serial)
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

          <button
            type="button"
            className={styles.help}
            aria-label="Ajuda"
          >
            ?
          </button>
        </div>

        <p className={styles.description}>
          Número de série, encontrado na etiqueta parte de trás da autoclave
        </p>

        <input
          type="text"
          className={common.input}
          placeholder="Insira o número de série e lote (ex.: VAR153626191.253310):"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
        />

        <button
          type="submit"
          className={common.button}
          disabled={!serial.trim()}
        >
          Continuar
        </button>
      </div>
    </form>
  )
}
