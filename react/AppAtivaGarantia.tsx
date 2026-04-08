import React, { useRef, useState } from 'react'
import DadosEquipamento from './componentes/dadosEquipamento'
import DadosPessoais from './componentes/dadosPessoais'
import DadosEndereco from './componentes/dadosEndereco'
import DadosCompra from './componentes/dadosCompra'
import InfoGarantia from './componentes/infoGarantia'

export default function AppAtivaGarantia() {
  const [step, setStep] = useState(1)

  const step2Ref = useRef<HTMLDivElement | null>(null)
  const step3Ref = useRef<HTMLDivElement | null>(null)
  const step4Ref = useRef<HTMLDivElement | null>(null)

  const scrollToStep = (ref: React.RefObject<HTMLDivElement | null>) => {
    window.setTimeout(() => {
      if (!ref.current) {
        return
      }

      const offset = 120
      const elementTop = ref.current.getBoundingClientRect().top + window.scrollY
      const targetPosition = elementTop - offset

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    }, 150)
  }

  const handleContinueEquipamento = (_serial: string) => {
    setStep(2)
    scrollToStep(step2Ref)
  }

  const handleContinuePessoais = (_data: {
    nome: string
    email: string
    cpf: string
    telefone: string
  }) => {
    setStep(3)
    scrollToStep(step3Ref)
  }

  const handleContinueEndereco = (_data: {
    cep: string
    endereco: string
    numero: string
    complemento: string
  }) => {
    setStep(4)
    scrollToStep(step4Ref)
  }

  const handleContinueCompra = (_data: {
    canal: string
    outroCanal: string
  }) => {
    setStep(5)
  }

  return (
    <>
      <section id="form" style={{ scrollMarginTop: '120px' }}>
        <DadosEquipamento onContinue={handleContinueEquipamento} />

        <div ref={step2Ref}>
          <DadosPessoais
            isActive={step >= 2}
            onContinue={handleContinuePessoais}
          />
        </div>

        <div ref={step3Ref}>
          <DadosEndereco
            isActive={step >= 3}
            onContinue={handleContinueEndereco}
          />
        </div>

        <div ref={step4Ref}>
          <DadosCompra
            isActive={step >= 4}
            onContinue={handleContinueCompra}
          />
        </div>
      </section>

      <InfoGarantia />
    </>
  )
}
