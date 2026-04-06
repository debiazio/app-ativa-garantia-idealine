import React, { useState } from 'react'
import DadosEquipamento from './componentes/dadosEquipamento'
import DadosPessoais from './componentes/dadosPessoais'
import DadosEndereco from './componentes/dadosEndereco'
import DadosCompra from './componentes/dadosCompra'
import InfoGarantia from './componentes/infoGarantia'

export default function AppAtivaGarantia() {
  const [step, setStep] = useState(1)

  const handleContinueEquipamento = (_serial: string) => {
    setStep(2)
  }

  const handleContinuePessoais = (_data: {
    nome: string
    email: string
    cpf: string
    telefone: string
  }) => {
    setStep(3)
  }

  const handleContinueEndereco = (_data: {
    cep: string
    endereco: string
    numero: string
    complemento: string
  }) => {
    setStep(4)
  }

  const handleContinueCompra = (_data: {
    canal: string
    outroCanal: string
  }) => {
    setStep(5)
  }

  return (
    <>
      <section id="form">
        <DadosEquipamento onContinue={handleContinueEquipamento} />

        <DadosPessoais
          isActive={step >= 2}
          onContinue={handleContinuePessoais}
        />

        <DadosEndereco
          isActive={step >= 3}
          onContinue={handleContinueEndereco}
        />

        <DadosCompra
          isActive={step >= 4}
          onContinue={handleContinueCompra}
        />
      </section>

      <InfoGarantia />
    </>
  )
}
