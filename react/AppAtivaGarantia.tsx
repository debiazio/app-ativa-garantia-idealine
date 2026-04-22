import React, { useRef, useState } from 'react'

import DadosEquipamento from './componentes/dadosEquipamento'
import DadosPessoais from './componentes/dadosPessoais'
import DadosEndereco from './componentes/dadosEndereco'
import DadosCompra from './componentes/dadosCompra'
import InfoGarantia from './componentes/infoGarantia'

interface DadosPessoaisData {
  nome: string
  email: string
  cpf: string
  telefone: string
}

interface DadosEnderecoData {
  cep: string
  endereco: string
  numero: string
  complemento: string
}

interface DadosCompraData {
  canal: string
  outroCanal: string
}

export default function AppAtivaGarantia() {
  const [step, setStep] = useState(1)

  const [serial, setSerial] = useState('')
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoaisData | null>(
    null
  )

  const [dadosEndereco, setDadosEndereco] = useState<DadosEnderecoData | null>(
    null
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const step2Ref = useRef<HTMLDivElement | null>(null)
  const step3Ref = useRef<HTMLDivElement | null>(null)
  const step4Ref = useRef<HTMLDivElement | null>(null)

  const scrollToStep = (ref: React.RefObject<HTMLDivElement | null>) => {
    window.setTimeout(() => {
      if (!ref.current) {
        return
      }

      const offset = 120
      const elementTop =
        ref.current.getBoundingClientRect().top + window.scrollY

      const targetPosition = elementTop - offset

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    }, 150)
  }

  const handleContinueEquipamento = (nextSerial: string) => {
    setSerial(nextSerial)
    setStep(2)
    scrollToStep(step2Ref)
  }

  const handleContinuePessoais = (data: DadosPessoaisData) => {
    setDadosPessoais(data)
    setStep(3)
    scrollToStep(step3Ref)
  }

  const handleContinueEndereco = (data: DadosEnderecoData) => {
    setDadosEndereco(data)
    setStep(4)
    scrollToStep(step4Ref)
  }

  const handleFinishCompra = async (data: DadosCompraData) => {
    if (!serial || !dadosPessoais || !dadosEndereco) {
      setSubmitError('Não foi possível finalizar o cadastro. Tente novamente.')
      console.error('Missing data to finish activation', {
        serial,
        dadosPessoais,
        dadosEndereco,
        compra: data,
      })

      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/_v/garantia/ativacao', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serial,
          nome: dadosPessoais.nome,
          email: dadosPessoais.email,
          cpf: dadosPessoais.cpf,
          telefone: dadosPessoais.telefone,
          cep: dadosEndereco.cep,
          endereco: dadosEndereco.endereco,
          numero: dadosEndereco.numero,
          complemento: dadosEndereco.complemento,
          canalCompra: data.outroCanal.trim() || data.canal,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error('Erro ao finalizar cadastro:', result)
        setSubmitError(
          'Não foi possível finalizar o cadastro. Tente novamente.'
        )

        return
      }

      setIsSuccess(true)
      setStep(5)
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } catch (error) {
      console.error('Erro inesperado ao finalizar cadastro:', error)
      setSubmitError('Não foi possível finalizar o cadastro. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section id="form" style={{ scrollMarginTop: '120px' }}>
        {isSuccess ? (
          <div
            style={{
              maxWidth: '720px',
              margin: '0 auto 32px',
              padding: '24px',
              border: '1px solid #d9d9d9',
              borderRadius: '12px',
              background: '#fff',
            }}
          >
            <h2
              style={{
                margin: '0 0 12px',
                fontSize: '28px',
                lineHeight: 1.2,
                color: '#333',
              }}
            >
              Cadastro finalizado com sucesso
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: '16px',
                lineHeight: 1.5,
                color: '#4f4f4f',
              }}
            >
              Recebemos os dados da ativação da garantia. Em breve seguimos com
              as próximas etapas do processo.
            </p>
          </div>
        ) : (
          <>
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
                isSubmitting={isSubmitting}
                submitError={submitError}
                onFinish={handleFinishCompra}
              />
            </div>
          </>
        )}
      </section>

      <InfoGarantia />
    </>
  )
}
