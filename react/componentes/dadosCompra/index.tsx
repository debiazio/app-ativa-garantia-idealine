import React, { useState } from 'react'
import styles from './dadosCompra.module.css'
import common from '../formCommon.module.css'

interface DadosCompraProps {
  isActive: boolean
  onContinue?: (data: {
    canal: string
    outroCanal: string
  }) => void
}

export default function DadosCompra({
  isActive,
  onContinue,
}: DadosCompraProps) {
  const [canal, setCanal] = useState('')
  const [outroCanal, setOutroCanal] = useState('')

  const isOutro = canal === 'outros'
  const isValid = isOutro ? outroCanal.trim() : canal.trim()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValid) {
      return
    }

    onContinue?.({
      canal,
      outroCanal,
    })
  }

  if (!isActive) {
    return (
      <section className={common.formSection}>
        <div className={common.formCardClosed}>
          <div className={common.titleWrapper}>
            <span className={common.step}>4</span>
            <h2 className={common.title}>Canal de Compra</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <form className={common.formSection} onSubmit={handleSubmit}>
      <div className={common.formCard}>
        <div className={common.titleWrapper}>
          <span className={common.step}>4</span>
          <h2 className={common.title}>Canal de Compra</h2>
        </div>

        <p className={styles.description}>
          Informe o canal onde adquiriu nosso produto.
        </p>

        <div className={styles.grid}>
          <label className={styles.optionCard}>
            <input
              type="radio"
              name="canalCompra"
              value="shopee"
              checked={canal === 'shopee'}
              onChange={(e) => setCanal(e.target.value)}
            />
            <span className={styles.optionLabel}>Shopee</span>
            <img
              src="https://mfmgroup.vtexassets.com/assets/vtex.file-manager-graphql/images/78a3a5d4-e946-46f8-bfd4-4573d5d6d597___b42a02fb5bac9b7ce31c4c7851621d68.png"
              alt="Shopee"
              className={styles.optionBrandImage}
            />
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="canalCompra"
              value="site-idealine"
              checked={canal === 'site-idealine'}
              onChange={(e) => setCanal(e.target.value)}
            />
            <span className={styles.optionLabel}>Site da Idealine</span>
            <img
              src="https://mfmgroup.vtexassets.com/assets/vtex.file-manager-graphql/images/f28f2832-0ae9-4725-a936-19a7d9cbde1c___546ea76c7b381d30a938e3d8073e8774.png"
              alt="Site Idealine"
              className={styles.optionBrandImage}
              />
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="canalCompra"
              value="mercado-livre"
              checked={canal === 'mercado-livre'}
              onChange={(e) => setCanal(e.target.value)}
            />
            <span className={styles.optionLabel}>Mercado Livre</span>
              <img
                src="https://mfmgroup.vtexassets.com/assets/vtex.file-manager-graphql/images/ae6c7236-e625-4b99-89e8-8ef2ae38d0ac___8f0bcf19842d50e677c7a02ac14f397e.png"
                alt="Mercado Libre"
                className={styles.optionBrandImage}
              />
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="canalCompra"
              value="consultora"
              checked={canal === 'consultora'}
              onChange={(e) => setCanal(e.target.value)}
            />
            <span className={styles.optionLabel}>Consultora</span>
              <img
                src="https://mfmgroup.vtexassets.com/assets/vtex.file-manager-graphql/images/35e69c0d-13a4-4afb-b4f4-33cda5d33bd2___a31bd22c837b052db62c7aa9f9fc4561.png"
                alt="Consultoras"
                className={styles.optionBrandImage}
              />
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="canalCompra"
              value="magalu"
              checked={canal === 'magalu'}
              onChange={(e) => setCanal(e.target.value)}
            />
            <span className={styles.optionLabel}>Magalu</span>
              <img
                src="https://mfmgroup.vtexassets.com/assets/vtex.file-manager-graphql/images/220a33aa-bfef-4c11-ada3-9bc381185008___16ce855d38e7a579ee4d2053c4662044.png"
                alt="Magalu"
                className={styles.optionBrandImage}
              />
          </label>

          <label className={styles.optionCardOther}>
            <div className={styles.optionOtherLeft}>
              <input
                type="radio"
                name="canalCompra"
                value="outros"
                checked={canal === 'outros'}
                onChange={(e) => setCanal(e.target.value)}
              />
              <span className={styles.optionLabel}>Outros</span>
            </div>

            <input
              type="text"
              className={styles.otherInput}
              placeholder="Ex.: Apto 12"
              value={outroCanal}
              onChange={(e) => setOutroCanal(e.target.value)}
              disabled={!isOutro}
            />
          </label>
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
