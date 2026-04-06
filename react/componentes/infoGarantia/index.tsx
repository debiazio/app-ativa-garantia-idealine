import React from 'react'
import styles from './infoGarantia.module.css'

export default function InfoGarantia() {
  return (
    <section className={styles.infoGarantia}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Seu equipamento é um investimento essencial para o seu trabalho.
          <br />
          Ao realizar o cadastro, você:
        </h2>

        <div className={styles.cards}>
          <div className={styles.card}>
            <ul className={styles.list}>
              <li>Ativa a garantia estendida exclusiva;</li>
              <li>Garante a rastreabilidade junto aos órgãos regulatórios;</li>
              <li>Facilita suporte técnico e atendimento prioritário;</li>
              <li>Mantém a segurança e histórico do seu equipamento;</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3 className={styles.important}>⚠ IMPORTANTE</h3>

            <p className={styles.text}>
              A garantia padrão legal é de 90 dias.
              <br />
              A garantia estendida é um benefício adicional EXCLUSIVO, liberado
              somente após o cadastro e validação do equipamento.
            </p>
          </div>
        </div>

        <a href="#form" className={styles.button}>
          ATIVE SUA GARANTIA ESTENDIDA AGORA
        </a>
      </div>
    </section>
  )
}
